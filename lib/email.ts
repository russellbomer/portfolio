import nodemailer from "nodemailer";
import "server-only";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
};

function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = (process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  const user = process.env.SMTP_USER || undefined;
  const pass = process.env.SMTP_PASS || undefined;
  const from = process.env.CONTACT_EMAIL_FROM || "";
  const to = process.env.CONTACT_EMAIL_TO || "";

  return { host, port, secure, user, pass, from, to };
}

let cachedTransport: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (cachedTransport) return cachedTransport;
  const cfg = getSmtpConfig();
  if (!cfg.host || !cfg.from || !cfg.to) {
    throw new Error(
      "SMTP not configured: set SMTP_HOST, CONTACT_EMAIL_FROM, CONTACT_EMAIL_TO"
    );
  }

  const auth =
    cfg.user && cfg.pass ? { user: cfg.user, pass: cfg.pass } : undefined;
  cachedTransport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth,
    logger: (process.env.SMTP_DEBUG || "false").toLowerCase() === "true",
    debug: (process.env.SMTP_DEBUG || "false").toLowerCase() === "true",
    // Allow TLS overrides for shared hosting where cert CN differs from SMTP_HOST
    tls: {
      servername:
        process.env.SMTP_TLS_SERVERNAME &&
        process.env.SMTP_TLS_SERVERNAME.trim() !== ""
          ? process.env.SMTP_TLS_SERVERNAME.trim()
          : cfg.host,
      rejectUnauthorized:
        (process.env.SMTP_TLS_REJECT_UNAUTHORIZED || "true").toLowerCase() ===
        "true",
    },
  });
  return cachedTransport;
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  interest?: string;
  message: string;
}) {
  const cfg = getSmtpConfig();
  const transporter = getTransporter();

  const subject = `[Portfolio Contact] ${input.name} – ${
    input.interest || "General"
  }`;
  const text = `New contact submission\n\nName: ${input.name}\nEmail: ${
    input.email
  }\nInterest: ${input.interest || ""}\n\nMessage:\n${input.message}\n`;

  const info = await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    replyTo: input.email,
    subject,
    text,
  });

  return { messageId: info.messageId };
}
