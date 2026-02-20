import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactPayload {
    name: string;
    email: string;
    company?: string;
    message: string;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ContactPayload;
        const { name, email, company, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.hostinger.com",
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true, // SSL on port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const companyLine = company ? `Company: ${company}\n` : "";

        await transporter.sendMail({
            from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself
            replyTo: email, // Reply goes to the person who filled out the form
            subject: `New message from ${name}${company ? ` (${company})` : ""}`,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                companyLine ? `Company: ${company}` : null,
                ``,
                `Message:`,
                message,
            ]
                .filter((line) => line !== null)
                .join("\n"),
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 100px;"><strong>Name</strong></td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${company
                    ? `<tr>
              <td style="padding: 8px 0; color: #666;"><strong>Company</strong></td>
              <td style="padding: 8px 0;">${company}</td>
            </tr>`
                    : ""
                }
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
            <p style="margin: 0 0 8px; color: #666; font-size: 13px;"><strong>Message</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from the portfolio contact form at russellbomer.com
          </p>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message. Please try again later." },
            { status: 500 }
        );
    }
}
