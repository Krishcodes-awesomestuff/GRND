"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { SignupForm } from "@/components/auth/SignupForm"

export function AuthScreen() {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div className="dark flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 transition-colors duration-300">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div
          key={showLogin ? "login" : "signup"}
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          {showLogin ? (
            <LoginForm onShowSignup={() => setShowLogin(false)} />
          ) : (
            <SignupForm onShowLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
