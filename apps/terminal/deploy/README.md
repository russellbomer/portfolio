# Deployment Templates (MVP)

These files support ADR-0001 (Subdomain Routing) for a DigitalOcean VPS using Nginx + certbot with wildcard DNS. Values are placeholders; do not commit secrets.

## Files

- `nginx/sites-available/portfolio.conf` — Example server blocks for wildcard subdomains and app upstream.
- `certbot/README.md` — Notes on issuing a wildcard certificate (DNS-01) and renewal.

## Usage (outline)

1. Configure wildcard DNS: `*.russellbomer.com` and `russellbomer.com` to your VPS IP.
2. Install Nginx and certbot on the VPS.
3. Issue wildcard cert (DNS-01) as described in `certbot/README.md`.
4. Copy `portfolio.conf` to `/etc/nginx/sites-available/` and symlink into `sites-enabled/`.
5. Reload Nginx.

See ADR-0001 for spike exit criteria and portability guidance.
