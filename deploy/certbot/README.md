# certbot notes (wildcard DNS-01)

Issue wildcard cert for `*.russellbomer.com` and `russellbomer.com` (DNS-01):

1. Install certbot and DNS plugin for your provider (e.g., Cloudflare, Route53).
2. Use DNS-01 to avoid HTTP challenges for wildcard certs.

Example (Cloudflare DNS plugin):

```
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/certbot/cloudflare.ini \
  -d russellbomer.com -d *.russellbomer.com
```

Renewal is automatic; ensure the plugin credentials are present and secured. Reload Nginx after renewal if needed.
