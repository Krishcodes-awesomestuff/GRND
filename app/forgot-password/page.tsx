"use client"

import React, { useState } from "react"
import { resetPasswordForEmail } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await resetPasswordForEmail(email)
      
      if (resetError) {
        setError(resetError.message)
        return
      }
      
      setSuccess(true)
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md overflow-hidden p-0">
        <CardContent className="p-0">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-6 p-10 text-center">
              <div className="text-5xl">📬</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Check your inbox</h2>
                <p className="text-muted-foreground">
                  We sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                </p>
              </div>
              <Link
                href="/"
                className="text-sm border rounded-md px-4 py-2 hover:bg-muted transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    Enter your email to receive a password reset link.
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive border border-destructive/30">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </Field>

                <Field className="mt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                </Field>

                <FieldDescription className="text-center mt-2">
                  Remember your password?{" "}
                  <Link href="/" className="underline underline-offset-4 hover:text-primary transition-colors">
                    Back to login
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
