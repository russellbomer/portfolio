# Contact Email Setup

Use this guide when enabling the contact form in a new environment (local, staging, production). It documents the SMTP configuration, verification steps, and operational checks required for the portfolio contact flow.

## 1. Required Environment Variables

Set the following variables in `.env.local` for local development and in `.env.production` or your deployment secrets manager for live environments. All values are required unless noted otherwise.

| Variable                       | Description                                                  | Example                                  |
| ------------------------------ | ------------------------------------------------------------ | ---------------------------------------- |
| `SMTP_HOST`                    | SMTP server hostname                                         | `smtp.sendgrid.net`                      |
| `SMTP_PORT`                    | SMTP port (integer)                                          | `587`                                    |
| `SMTP_SECURE`                  | `true` for port 465, `false` otherwise                       | `false`                                  |
| `SMTP_USER`                    | SMTP auth username (omit if server supports anonymous relay) | `apikey`                                 |
| `SMTP_PASS`                    | SMTP auth password/API key                                   | `SG.xxxxxx`                              |
| `CONTACT_EMAIL_FROM`           | Display name and from email                                  | `"Portfolio" <contact@russellbomer.com>` |
| `CONTACT_EMAIL_TO`             | Destination inbox                                            | `contact@russellbomer.com`               |
| `SMTP_TLS_SERVERNAME`          | Optional override when TLS cert CN differs from `SMTP_HOST`  | `mail.example.com`                       |
| `SMTP_TLS_REJECT_UNAUTHORIZED` | Set to `false` only for trusted self-signed certs            | `true`                                   |
| `SMTP_DEBUG`                   | `true` enables Nodemailer debug logging (development only)   | `false`                                  |

> **Note:** Keep credentials out of source control. On DigitalOcean or other VPS hosts, use the platform’s secrets manager or a systemd unit environment file.

## 2. Local Verification Checklist

1. Populate `.env.local` with the variables above.
2. Start the dev server: `npm run dev` (PowerShell).
3. Submit the contact form at `http://localhost:3000/connect` (legacy: `/contact`).
4. Confirm terminal output shows Nodemailer delivering the message. If `SMTP_DEBUG=true`, you will see the SMTP conversation.
5. Verify the test email arrives in the inbox specified by `CONTACT_EMAIL_TO`.

If delivery fails, check the browser toast message (now surfaces detailed errors) and review server logs. Common causes are invalid credentials or blocked ports.

## 3. Production Deployment Notes

- Restart the app after updating environment variables so the Next.js server reloads the transporter.
- Outgoing TCP port 587 must be open on your VPS firewall.
- Configure SPF and DKIM DNS records for the sending domain to avoid spam folders. For SendGrid or Mailgun, follow their onboarding instructions.
- Create a monitoring filter in the inbox (e.g., Gmail label `Portfolio Contact`) to spot new inquiries quickly.
- Periodically send a test message to ensure the transporter still works after credential rotations.

## 4. Troubleshooting

| Symptom                                  | Likely Cause                                                                   | Resolution                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `SMTP not configured` error in logs      | Missing mandatory envs (`SMTP_HOST`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`) | Set the variables and redeploy                                                  |
| 500 response with `Email send failed`    | Authentication failure or blocked host                                         | Double-check `SMTP_USER`/`SMTP_PASS`; ensure firewall allows outbound SMTP      |
| Email delivers but replies go to default | `reply-to` header unset or overwritten                                         | Confirm `CONTACT_EMAIL_TO` mailbox respects Reply-To from `lib/email.ts`        |
| TLS handshake failure                    | Hostname mismatch or self-signed cert                                          | Set `SMTP_TLS_SERVERNAME` or (last resort) `SMTP_TLS_REJECT_UNAUTHORIZED=false` |
| Messages land in spam                    | Missing SPF/DKIM/DMARC                                                         | Publish DNS records for the sending domain                                      |

## 5. Anti-Spam Strategy

- Honeypot field `website` is wired in both the form and API route; submissions with data in this field are treated as spam and dropped.
- Short term mitigation: monitor submission frequency via inbox filters. If repetitive abuse appears, enable lightweight rate limiting on `/api/contact` using middleware (e.g., IP-based counters with Upstash Redis) and temporarily gate the form behind a magic link.
- Long term mitigation: integrate a behavioral signal such as reCAPTCHA v3 or hCaptcha and feed submissions into a CRM with built-in spam scoring. Update this section when additional controls are deployed.

## 6. Reference Implementation

The contact form pipeline:

1. `components/contact/ContactForm.tsx` submits `POST /api/contact`.
2. `app/api/contact/route.ts` validates payload and calls `sendContactEmail`.
3. `lib/email.ts` reads the env vars above, lazily initializes a Nodemailer transporter, and sends the email with the visitor’s address in `replyTo`.

Keep the transporter server-side only (`import "server-only"`). All secrets live in the environment, never in client bundles.

Once these steps are complete you can check off the contact/email items in `deployment-checklist.md` Section 4 (Operational Readiness).
