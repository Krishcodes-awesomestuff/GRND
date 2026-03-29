"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { updatePassword } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await updatePassword(password)
      
      if (updateError) {
        setError(updateError.message)
        return
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 3000)
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
              <div className="text-5xl">✅</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Password Updated</h2>
                <p className="text-muted-foreground">
                  Your password has been changed successfully. Redirecting you...
                </p>
              </div>
              <Link href="/" className="text-sm border rounded-md px-4 py-2 hover:bg-muted transition-colors">
                Go back home
              </Link>
            </div>
          ) : (
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <h1 className="text-2xl font-bold">Create New Password</h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    Enter your new password below.
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive border border-destructive/30">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </Field>

                <Field className="mt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
