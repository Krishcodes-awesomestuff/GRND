"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import { updateUserOnboarding } from "@/services/auth.service"
import { Loader2, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const THEME_ACCENT = "#D1F34D" // A vibrant lime/neon green matching the screenshots
const BG_DARK_GRAY = "#1A1A1A"  // The unselected button background

const SPORTS = [
  { id: "basketball", label: "Basketball" },
  { id: "football", label: "Football" },
  { id: "cricket", label: "Cricket" },
  { id: "tennis", label: "Tennis" },
  { id: "badminton", label: "Badminton" },
  { id: "volleyball", label: "Volleyball" },
  { id: "swimming", label: "Swimming" },
  { id: "boxing", label: "Boxing" },
  { id: "pickleball", label: "Pickleball" },
  { id: "rugby", label: "Rugby" },
]

const LEVELS = [
  { id: "beginner", label: "BEGINNER", desc: "Just warming up" },
  { id: "intermediate", label: "INTERMEDIATE", desc: "Hitting my stride" },
  { id: "advanced", label: "ADVANCED", desc: "Full send mode" },
]

const FREQUENCIES = [
  { id: "rarely", label: "RARELY", desc: "Just starting out" },
  { id: "sometimes", label: "SOMETIMES", desc: "Weekend Warrior" },
  { id: "often", label: "OFTEN", desc: "Everyday Grind" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, profile, loading: userLoading } = useUser()

  const [step, setStep] = useState(1)
  const [sports, setSports] = useState<string[]>([])
  const [level, setLevel] = useState<string>("")
  const [frequency, setFrequency] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push("/")
      } else if (profile?.onboarding_completed) {
        router.push(profile.role === "turf_owner" ? "/turf/dashboard" : "/player/dashboard")
      }
    }
  }, [user, profile, userLoading, router])

  if (userLoading || profile?.onboarding_completed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D1F34D]" />
      </div>
    )
  }

  const toggleSport = (id: string) => {
    setSports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleNext = () => setStep((s) => Math.min(s + 1, 4))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        setGeoLoading(false)
      },
      (error) => {
        alert("Unable to retrieve your location.")
        setGeoLoading(false)
      }
    )
  }

  const handleFinish = async () => {
    if (!user) return
    setSubmitting(true)
    const { error } = await updateUserOnboarding(user.id, {
      sports,
      level,
      frequency,
      location,
    })

    if (error) {
      alert("Something went wrong saving your profile.")
      setSubmitting(false)
      return
    }

    if (profile?.role === "turf_owner") {
      router.push("/turf/dashboard")
    } else {
      router.push("/player/dashboard")
    }
  }

  // Derived button states based on Figma mockups
  const isStepValid = () => {
    if (step === 1 && sports.length < 3) return false
    if (step === 2 && !level) return false
    if (step === 3 && !frequency) return false
    if (step === 4 && location.trim().length === 0) return false
    return true
  }

  const getActionText = () => {
    if (step === 1) return sports.length >= 3 ? "Continue" : "Select at least 3"
    if (step === 4) return "Finish & Enter"
    return "Continue"
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-[#D1F34D] selection:text-black">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">

        {/* Progress Dashes */}
        <div className="flex gap-2 mb-8 items-center cursor-pointer" onClick={handleBack}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors duration-500",
                step >= i ? "bg-[#D1F34D]" : "bg-neutral-800"
              )}
            />
          ))}
        </div>

        {/* Step 1: Sports Grid */}
        {step === 1 && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-8 duration-300 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-center uppercase">
              CHOOSE YOUR SPORT.
            </h1>
            <div className="grid grid-cols-2 gap-3 w-full">
              {SPORTS.map((s) => {
                const isSelected = sports.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSport(s.id)}
                    className={cn(
                      "py-4 px-2 rounded-xl text-sm font-medium transition-colors duration-200 text-center w-full focus:outline-none",
                      isSelected
                        ? "bg-[#D1F34D] text-black"
                        : "bg-[#1A1A1A] text-neutral-400 hover:bg-[#2A2A2A]"
                    )}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
            {sports.length < 3 && (
              <p className="text-xs text-neutral-500 text-center uppercase tracking-wider !mt-4">
                Select 3 more sports to continue
              </p>
            )}
          </div>
        )}

        {/* Step 2: Level Stack */}
        {step === 2 && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-8 duration-300 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-center uppercase">
              WHAT&apos;S YOUR LEVEL?
            </h1>
            <div className="space-y-3 w-full">
              {LEVELS.map((l) => {
                const isSelected = level === l.id
                return (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-xl text-left transition-colors duration-200 focus:outline-none",
                      isSelected
                        ? "bg-[#D1F34D] text-black"
                        : "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]"
                    )}
                  >
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider">{l.label}</h3>
                      <p className={cn("text-xs mt-1", isSelected ? "text-black/70" : "text-neutral-500")}>
                        {l.desc}
                      </p>
                    </div>
                    {isSelected && <Check className="h-5 w-5 opacity-80" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Frequency Stack */}
        {step === 3 && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-8 duration-300 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-center uppercase">
              HOW OFTEN DO YOU SWEAT?
            </h1>
            <div className="space-y-3 w-full">
              {FREQUENCIES.map((f) => {
                const isSelected = frequency === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setFrequency(f.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-xl text-left transition-colors duration-200 focus:outline-none",
                      isSelected
                        ? "bg-[#D1F34D] text-black"
                        : "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]"
                    )}
                  >
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider">{f.label}</h3>
                      <p className={cn("text-xs mt-1", isSelected ? "text-black/70" : "text-neutral-500")}>
                        {f.desc}
                      </p>
                    </div>
                    {isSelected && <Check className="h-5 w-5 opacity-80" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-8 duration-300 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-center uppercase">
              LOCATE YOUR ARENA.
            </h1>
            <div className="space-y-3 w-full">
              <input
                autoFocus
                placeholder="City or Neighborhood"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-14 bg-[#1A1A1A] text-white placeholder-neutral-500 px-5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#D1F34D] transition-all"
              />

              <button
                className="w-full h-14 bg-[#1A1A1A] text-white font-medium text-sm rounded-xl hover:bg-[#2A2A2A] transition-colors focus:outline-none flex items-center justify-center"
                onClick={handleGetLocation}
                disabled={geoLoading}
              >
                {geoLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#D1F34D]" />
                ) : (
                  "Use Current Location"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Global Action Button */}
        <button
          onClick={step === 4 ? handleFinish : handleNext}
          disabled={!isStepValid() || submitting}
          className={cn(
            "mt-8 w-full h-14 rounded-xl flex items-center justify-center font-bold text-sm tracking-wide transition-all duration-300 focus:outline-none",
            isStepValid() && !submitting
              ? "bg-[#D1F34D] text-black hover:bg-[#bce03a]"
              : "bg-[#4f5c1d] text-black/50 cursor-not-allowed" // A faded dark-olive state mimicking a disabled version of the button
          )}
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <>
              {getActionText()} <ArrowRight className="ml-2 h-4 w-4" strokeWidth={3} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
