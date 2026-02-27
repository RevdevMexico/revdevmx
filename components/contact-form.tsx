"use client"

import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { sendContactEmail } from "@/app/actions/send-email"
import { analytics } from "@/lib/analytics"

const ContactForm = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string

    try {
      const result = await sendContactEmail(formData)

      // Track analytics
      if (result.success) {
        analytics.contactFormSubmit({ name, email, company })
      }

      setSubmitMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      })

      if (result.success) {
        const form = document.getElementById("contact-form") as HTMLFormElement
        form?.reset()
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Hubo un error inesperado. Por favor intenta nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Solicita una cotización</CardTitle>
          <CardDescription>Cuéntanos sobre tu proyecto de desarrollo web y te contactaremos pronto</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="contact-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(new FormData(e.target as HTMLFormElement))
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nombre *
                </label>
                <Input id="name" name="name" placeholder="Tu nombre" required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-foreground">
                  Empresa
                </label>
                <Input id="company" name="company" placeholder="Tu empresa" disabled={isSubmitting} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email *
              </label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Mensaje *
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Cuéntanos sobre tu proyecto..."
                className="min-h-[100px]"
                required
                disabled={isSubmitting}
              />
            </div>

            {submitMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  submitMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
})

ContactForm.displayName = "ContactForm"

export { ContactForm }
