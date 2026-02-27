"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string
  const company = formData.get("company") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Validate required fields
  if (!name || !email || !message) {
    return {
      success: false,
      message: "Por favor completa todos los campos requeridos.",
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Por favor ingresa un email válido.",
    }
  }

  // Check if API key exists
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not found in environment variables")
    return {
      success: false,
      message: "Error de configuración del servidor. Por favor contacta al administrador.",
    }
  }

  try {
    console.log("Attempting to send email with Resend...")

    const { data, error } = await resend.emails.send({
      from: "RevDev Solutions <onboarding@resend.dev>", // Usar dominio de Resend por defecto
      to: ["revdevsolutions@gmail.com"], // Usar tu email registrado en Resend
      replyTo: email, // Para que puedas responder directamente al cliente
      subject: `Nueva solicitud de cotización de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #fe6307 0%, #ff8c42 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Nueva Solicitud de Cotización
            </h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; font-size: 20px; border-bottom: 2px solid #fe6307; padding-bottom: 10px;">
                📋 Información del Cliente
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Nombre:</td>
                  <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Empresa:</td>
                  <td style="padding: 8px 0; color: #333;">${company || "No especificada"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="mailto:${email}" style="color: #fe6307; text-decoration: none;">${email}</a>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; font-size: 20px; border-bottom: 2px solid #fe6307; padding-bottom: 10px;">
                💬 Mensaje
              </h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #fe6307;">
                <p style="line-height: 1.6; color: #555; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #fe6307 0%, #ff8c42 100%); color: white; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 16px;">
                <strong>🚀 RevDev Solutions México</strong><br>
                <span style="font-size: 14px; opacity: 0.9;">Desarrollo Web Profesional en Guadalajara</span>
              </p>
              <div style="margin-top: 15px;">
                <a href="mailto:${email}" style="background-color: white; color: #fe6307; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Responder al Cliente
                </a>
              </div>
            </div>
          </div>
        </div>
      `,
      text: `
Nueva Solicitud de Cotización

Información del Cliente:
- Nombre: ${name}
- Empresa: ${company || "No especificada"}
- Email: ${email}

Mensaje:
${message}

---
RevDev Solutions México
Desarrollo Web Profesional en Guadalajara
      `,
    })

    // NOTA: En el plan gratuito de Resend, solo puedes enviar emails a tu propia dirección
    // Para enviar a otros emails, necesitas verificar un dominio en resend.com/domains

    if (error) {
      console.error("Resend error details:", error)
      return {
        success: false,
        message: `Error al enviar el mensaje: ${error.message || "Error desconocido"}`,
      }
    }

    console.log("Email sent successfully:", data)
    return {
      success: true,
      message: "¡Mensaje enviado exitosamente! Te contactaremos pronto.",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      message: `Error inesperado: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}
