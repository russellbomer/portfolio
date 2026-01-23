# Terminal Demo Deployment Runbook

This runbook provides copy/paste-ready steps to deploy the terminal demo service to a DigitalOcean droplet.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Bootstrap](#server-bootstrap)
3. [Application Deployment](#application-deployment)
4. [TLS Certificate Setup](#tls-certificate-setup-manual)
5. [Service Management](#service-management)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Security Checklist](#security-checklist)

---

## Prerequisites

### MANUAL: Infrastructure Setup

Before running these commands, complete these steps manually:

1. **Create DigitalOcean droplet**
   - Image: Ubuntu 22.04 LTS
   - Size: 1GB RAM minimum (2GB recommended)
   - Region: Choose closest to target users
   - Add SSH key during creation

2. **Configure DigitalOcean Cloud Firewall**
   - Inbound rules:
     - SSH (22): Your IP only
     - HTTP (80): All IPv4, All IPv6
     - HTTPS (443): All IPv4, All IPv6
   - Outbound rules: Allow all (or restrict as needed)

3. **DNS Configuration**
   - Add A record: `quarry.russellbomer.com` → Droplet IP
   - Wait for DNS propagation (check with `dig quarry.russellbomer.com`)

4. **Generate secrets**
   ```bash
   # Generate TOKEN_SECRET locally, save securely
   openssl rand -hex 32
   ```

---

## Server Bootstrap

SSH into the new droplet as root, then run these commands:

### 1. Create deploy user

```bash
# Create non-root deploy user
adduser --disabled-password --gecos "" deploy

# Add to docker group (created after docker install)
# Run this again after docker install if group doesn't exist yet
usermod -aG docker deploy 2>/dev/null || echo "Will add to docker group after install"

# Enable passwordless sudo for deploy user (optional, for convenience)
echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
chmod 440 /etc/sudoers.d/deploy

# Copy SSH authorized_keys from root to deploy
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### 2. Harden SSH

```bash
# Backup original sshd_config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Disable root login and password authentication
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' /etc/ssh/sshd_config

# Restart SSH
systemctl restart sshd

# Test SSH as deploy user in a NEW terminal before closing root session!
```

### 3. System updates and security packages

```bash
# Update system
apt update && apt upgrade -y

# Install security packages
apt install -y unattended-upgrades fail2ban ufw

# Configure unattended upgrades
dpkg-reconfigure -plow unattended-upgrades

# Enable automatic security updates
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF
```

### 4. Install Docker

```bash
# Install Docker using official convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Add deploy user to docker group
usermod -aG docker deploy

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Verify installation
docker --version
docker compose version
```

### 5. Create application directories

```bash
# Create app directory structure
mkdir -p /var/www/terminal
chown -R deploy:deploy /var/www/terminal

# Create output data directory
mkdir -p /var/www/terminal/deploy/docker/data/quarry-output
chown -R deploy:deploy /var/www/terminal
```

---

## Application Deployment

Switch to the deploy user:

```bash
su - deploy
cd /var/www/terminal
```

### 1. Clone or copy application code

**Option A: Git clone (if using deploy key)**

```bash
# MANUAL: First add deploy key to GitHub repository
# Generate key on droplet:
ssh-keygen -t ed25519 -C "terminal-deploy@quarry" -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key.pub
# Add this public key to GitHub repo as deploy key (read-only)

# Configure SSH to use deploy key
cat >> ~/.ssh/config << 'EOF'
Host github.com
    IdentityFile ~/.ssh/deploy_key
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config

# Clone repository
git clone git@github.com:russellbomer/portfolio.git /var/www/terminal
```

**Option B: Manual copy (rsync from local)**

```bash
# From your LOCAL machine:
rsync -avz --exclude='node_modules' --exclude='.git' \
  apps/terminal/ deploy@<DROPLET_IP>:/var/www/terminal/
```

### 2. Configure environment variables

```bash
# Create environment file (MANUAL: replace <TOKEN_SECRET> with generated value)
cat > /var/www/terminal/.env << 'EOF'
# Terminal server secrets
# MANUAL: Replace with actual secret from `openssl rand -hex 32`
TOKEN_SECRET=<TOKEN_SECRET>

# Configuration
NODE_ENV=production
ALLOWED_HOSTS=quarry.russellbomer.com
TERMINAL_DEBUG=false
SESSION_TIMEOUT_SEC=900
SANDBOX_IMAGE=quarry-session:latest
EOF

# Secure the env file
chmod 600 /var/www/terminal/.env
```

### 3. Build Docker images

```bash
cd /var/www/terminal/deploy

# Build the session sandbox image
docker build -t quarry-session:latest -f docker/Dockerfile.session docker/

# Build the terminal server image
docker compose build
```

### 4. Install systemd service

```bash
# Copy service file (as root or with sudo)
sudo cp /var/www/terminal/deploy/systemd/terminal-stack.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable terminal-stack.service
```

---

## TLS Certificate Setup (MANUAL)

TLS certificate issuance requires DNS validation or HTTP challenge. This is a MANUAL step.

### Option A: Certbot with HTTP challenge (simpler)

```bash
# Install certbot
sudo apt install -y certbot

# Stop nginx temporarily if running
sudo docker compose -f /var/www/terminal/deploy/docker-compose.yml down || true

# Issue certificate (HTTP-01 challenge)
# MANUAL: Ensure DNS is propagated and port 80 is open
sudo certbot certonly --standalone \
  -d quarry.russellbomer.com \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com

# Set up auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Option B: Certbot with DNS-01 challenge (for wildcard or when port 80 unavailable)

```bash
# MANUAL: Follow certbot prompts to add DNS TXT record
sudo certbot certonly --manual \
  --preferred-challenges dns \
  -d quarry.russellbomer.com
```

### Verify certificate paths

The nginx config expects certificates at:
- `/etc/letsencrypt/live/quarry.russellbomer.com/fullchain.pem`
- `/etc/letsencrypt/live/quarry.russellbomer.com/privkey.pem`

---

## Service Management

### Start the service

```bash
# Start the terminal stack
sudo systemctl start terminal-stack.service

# Check status
sudo systemctl status terminal-stack.service
```

### View logs

```bash
# All service logs
sudo journalctl -u terminal-stack.service -f

# Docker compose logs
cd /var/www/terminal/deploy
docker compose logs -f

# Terminal server logs only
docker compose logs -f terminal-server

# Nginx logs only
docker compose logs -f nginx
```

### Restart / Stop

```bash
# Restart
sudo systemctl restart terminal-stack.service

# Stop
sudo systemctl stop terminal-stack.service

# Reload (restart containers)
sudo systemctl reload terminal-stack.service
```

### Manual docker compose commands

```bash
cd /var/www/terminal/deploy

# Start services
docker compose up -d

# Stop services
docker compose down

# Rebuild and restart
docker compose up -d --build

# Check service health
docker compose ps
```

---

## Verification

### 1. Nginx configuration check

```bash
# Test nginx config syntax inside container
docker compose exec nginx nginx -t
```

Expected output:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2. Health check

```bash
# Check health endpoint
curl -k https://quarry.russellbomer.com/health

# Or locally:
curl http://localhost:4001/health
```

### 3. Token endpoint

```bash
# Request a session token
curl -k -X POST https://quarry.russellbomer.com/session
```

Should return JSON with a token.

### 4. WebSocket connection test

```bash
# Install websocat if needed: cargo install websocat
# Or use wscat: npm install -g wscat

# Get token first
TOKEN=$(curl -sk -X POST https://quarry.russellbomer.com/session | jq -r .token)

# Connect to WebSocket
wscat -c "wss://quarry.russellbomer.com/ws?token=$TOKEN"
```

### 5. Check for security violations

```bash
# Ensure no privileged containers or host network
cd /var/www/terminal/deploy
grep -rn "privileged:\s*true\|network_mode:\s*host\|/var/run/docker\.sock" . || echo "No violations found"

# Check running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## Troubleshooting

### Service won't start

```bash
# Check logs
sudo journalctl -u terminal-stack.service -n 50 --no-pager

# Check docker compose directly
cd /var/www/terminal/deploy
docker compose config  # Validate compose file
docker compose up      # Run in foreground to see errors
```

### Certificate issues

```bash
# Check certificate exists
sudo ls -la /etc/letsencrypt/live/quarry.russellbomer.com/

# Check certificate validity
sudo openssl x509 -in /etc/letsencrypt/live/quarry.russellbomer.com/fullchain.pem -text -noout | head -20

# Renew certificate manually
sudo certbot renew --dry-run
```

### Connection refused

```bash
# Check if services are running
docker compose ps

# Check if ports are listening
ss -tlnp | grep -E ':(80|443|4001)'

# Check firewall
sudo ufw status
```

### Rate limiting issues

```bash
# Check nginx access logs for 429 errors
docker compose logs nginx | grep 429

# Temporarily increase limits in nginx.conf for debugging
```

---

## Security Checklist

Before going live, verify:

- [ ] SSH root login disabled
- [ ] SSH password auth disabled
- [ ] fail2ban running: `sudo systemctl status fail2ban`
- [ ] unattended-upgrades enabled: `sudo systemctl status unattended-upgrades`
- [ ] DO firewall configured (22 restricted, 80/443 open)
- [ ] TOKEN_SECRET set in `/var/www/terminal/.env`
- [ ] TLS certificate valid and auto-renewal configured
- [ ] No `privileged: true` in docker-compose.yml
- [ ] No `network_mode: host` in docker-compose.yml
- [ ] Session containers use `--network none`
- [ ] Health endpoint responds: `curl -k https://quarry.russellbomer.com/health`
- [ ] Wrong hosts rejected: `curl -k -H "Host: evil.com" https://quarry.russellbomer.com/` returns 444

### Deploy key rotation

To rotate the deploy key:

```bash
# Generate new key
ssh-keygen -t ed25519 -C "terminal-deploy-$(date +%Y%m%d)" -f ~/.ssh/deploy_key_new -N ""

# Add new public key to GitHub
cat ~/.ssh/deploy_key_new.pub

# After confirming new key works, replace old key
mv ~/.ssh/deploy_key ~/.ssh/deploy_key.old
mv ~/.ssh/deploy_key_new ~/.ssh/deploy_key
mv ~/.ssh/deploy_key_new.pub ~/.ssh/deploy_key.pub

# Remove old key from GitHub
# Delete ~/.ssh/deploy_key.old after confirming
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start service | `sudo systemctl start terminal-stack` |
| Stop service | `sudo systemctl stop terminal-stack` |
| View logs | `sudo journalctl -u terminal-stack -f` |
| Docker logs | `docker compose logs -f` |
| Test nginx config | `docker compose exec nginx nginx -t` |
| Rebuild images | `docker compose up -d --build` |
| Check health | `curl -k https://quarry.russellbomer.com/health` |
| Renew TLS | `sudo certbot renew` |
