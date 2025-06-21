"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All fields are required" }
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <noreply@yourdomain.com>",
      to: ["hilalfauzan9@gmail.com"],
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    return { success: true, message: "Email sent successfully!" }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: "Failed to send email. Please try again." }
  }
}

export async function downloadCV() {
  return { success: true, url: "/assets/CV/Muhammad Hilal Darul Fauzan_CV.pdf" }
}
