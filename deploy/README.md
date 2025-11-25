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

## Terminal Subdomain & WebSocket Proxy (Planned Demo Backend)

When the interactive terminal backend is introduced, it will live behind a dedicated subdomain (e.g. `terminal.russellbomer.com`) separate from the portfolio site (`russellbomer.com`). This isolation simplifies scaling, security hardening, and resource limits.

### Port & Process Assumptions

- Portfolio (Next.js) app runs on `127.0.0.1:3000`.
- Terminal service (Node/Express or Fastify + node-pty) runs on `127.0.0.1:4000`.
- WebSocket endpoint exposed at `/ws` (e.g. `ws://127.0.0.1:4000/ws`).
- REST session bootstrap endpoint at `/api/terminal/session` (future), served either by the portfolio app (if lightweight) or directly by the terminal service.

Adjust ports via environment variables (recommended):

```bash
export PORTFOLIO_PORT=3000
export TERMINAL_PORT=4000
```

### Minimal Nginx Server Block (WebSocket Upgrade)

Create `/etc/nginx/sites-available/terminal.conf`:

```nginx
server {
	listen 80;
	server_name terminal.russellbomer.com;

	# Enforce HTTPS (let's encrypt cert assumed already configured in a 443 block)
	return 301 https://$host$request_uri;
}

server {
	listen 443 ssl http2;
	server_name terminal.russellbomer.com;

	ssl_certificate     /etc/letsencrypt/live/russellbomer.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/russellbomer.com/privkey.pem;

	# Rate limiting (optional basic guard)
	limit_req_zone $binary_remote_addr zone=terminal_rate:10m rate=30r/m;
	limit_req_status 429;

	location /ws {
		proxy_pass http://127.0.0.1:4000/ws;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_read_timeout 60s; # Adjust if commands can run longer
	}

	# (Optional) REST endpoints for session lifecycle
	location /api/ {
		proxy_pass http://127.0.0.1:4000/;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	# Health check (define /health on backend)
	location /health {
		proxy_pass http://127.0.0.1:4000/health;
	}
}
```

### Portfolio + Terminal Together

If both services run on one host behind Nginx, you will have two server blocks: one for the root domain (proxying to `:3000`) and one for `terminal.` (proxying to `:4000`). Keep SSL certificates unified with wildcard issuance (preferred) or add a second cert.

### Hardening Considerations (Future)

- Add `seccomp` / containerization around the PTY process.
- Enforce command allowlist (env-driven) before spawning.
- Apply stricter rate limits on `/ws` (e.g., bursts) and consider IP reputation.
- Enable logs rotation (`/var/log/nginx/*.log`).
- Consider Cloudflare in front for DDoS mitigation.

### Quick Verification

After enabling the terminal server locally:

```bash
curl -I https://terminal.russellbomer.com/health
```

Expect `200 OK`. For WebSocket manual test you can use `wscat` (installed globally):

```bash
wscat --connect wss://terminal.russellbomer.com/ws
```

If connection upgrades successfully and echoes commands, proxy configuration is correct.

### Troubleshooting

- `400 Bad Request` on WebSocket upgrade: verify `proxy_set_header Upgrade` and `Connection "upgrade"` lines.
- Timeouts: increase `proxy_read_timeout` for long-running commands.
- 429 responses: adjust `limit_req_zone` / remove during early development.

---

This section will evolve once the PTY backend (todos #23–#27) is implemented.
