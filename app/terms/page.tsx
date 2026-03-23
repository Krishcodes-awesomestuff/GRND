import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Anton } from "next/font/google"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
})

export const metadata = {
  title: "Terms of Service - GRND",
  description: "Terms of Service for GRND platform",
}

export default function TermsOfServicePage() {
  return (
    <div className={`dark min-h-screen bg-background text-foreground ${anton.variable}`}>
      {/* Top Navigation / Breadcrumbs */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-12 flex-wrap items-center gap-1.5 px-4 text-sm text-muted-foreground sm:px-6">
          <Link
            href="/"
            className="truncate hover:text-foreground transition-colors"
          >
            GRND
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-foreground font-medium">Terms of Service</span>
        </div>
      </header>

      {/* Cover Image Area */}
      <div className="relative h-48 w-full md:h-64 lg:h-72">
        <img
          src="/cover.jpg"
          alt="Cover"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
        />
        <div className="absolute inset-y-0 bottom-0 block h-full w-full bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Main Content Container */}
      <main className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Page Icon (Overlapping Cover) */}
        <div className="relative -mt-16 mb-6 inline-flex md:-mt-20 md:mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-background text-6xl shadow-sm ring-4 ring-background md:h-32 md:w-32 md:rounded-2xl md:text-7xl">
            📜
          </div>
        </div>

        {/* Title and Meta info */}
        <div className="group mb-12 rounded-sm outline-none">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground group-hover:text-foreground/80 transition-colors">
            Last updated: March 2026
          </p>
        </div>

        {/* Document Content - Notion Style Blocks */}
        <div className="space-y-6 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <p className="rounded-md px-1 py-1 transition-colors hover:bg-muted/50">
            Welcome to GRND. By accessing or using our platform, you agree to
            comply with and be bound by the following terms and conditions.
            Please read them carefully.
          </p>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              1. Use of the Platform
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                GRND provides a digital platform for users to discover sports
                activities, connect with other players, join teams, and
                participate in events. By using GRND, you agree to use the
                platform only for lawful purposes and in a manner that does not
                violate the rights of others.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              2. User Accounts
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                To access certain features, users must create an account. You
                are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. GRND is not liable for any unauthorized access
                resulting from user negligence.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              3. User Conduct
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                Users are expected to interact respectfully within the
                community. Any form of harassment, abuse, fraudulent activity,
                or misuse of the platform is strictly prohibited. GRND reserves
                the right to suspend or terminate accounts that violate these
                standards.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              4. Content and Information
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                Users may provide personal information and content such as
                profile details, game listings, or team information. By
                submitting content, you grant GRND the right to use, display,
                and manage such content for platform functionality. Users are
                responsible for the accuracy of the information they provide.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              5. Third-Party Services
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                GRND may integrate with third-party services such as payment
                gateways or location services. We are not responsible for the
                performance or policies of these external services.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              6. Payments and Transactions
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                Certain features, such as joining paid games or bookings, may
                involve payments. Users agree to provide accurate payment
                information. GRND is not responsible for disputes arising
                between users and third-party service providers.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              7. Limitation of Liability
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                GRND acts as a platform to connect users and does not guarantee
                the quality, safety, or legality of any sports activity, event,
                or interaction. Users participate at their own risk. GRND is not
                liable for any injuries, damages, or losses incurred.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              8. Privacy
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                We respect user privacy and handle personal data in accordance
                with our Privacy Policy. By using GRND, you consent to the
                collection and use of your information as described.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              9. Termination
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                GRND reserves the right to suspend or terminate access to the
                platform at any time if a user violates these terms or engages
                in harmful activities.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              10. Changes to Terms
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                We may update these Terms of Service from time to time.
                Continued use of the platform after changes indicates
                acceptance of the updated terms.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              11. Contact
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                For any questions or concerns regarding these Terms, users may
                contact us through the platform.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-white/5 bg-background">
        {/* Meta bar – left credit / right contact */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 pt-10 sm:flex-row sm:items-center sm:px-10">
          {/* Left */}
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            Crafted with ❤️ &nbsp;GRND developer team
          </p>
          {/* Right */}
          <div className="text-right">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              Any queries contact
            </p>
            <a
              href="mailto:grnd.queries@gmail.com"
              className="mt-1 inline-block text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              grnd.queries@gmail.com
            </a>
          </div>
        </div>

        {/* Giant GRND wordmark — positioned so the bottom is clipped exactly like the Resend reference */}
        <div className="relative flex items-end justify-center overflow-hidden pb-0 pt-4">
          <span
            className="select-none leading-none tracking-tighter text-foreground/[0.06]"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(8rem, 22vw, 22rem)",
              lineHeight: 0.88,
            }}
          >
            GRND
          </span>
        </div>
      </footer>
    </div>
  )
}


