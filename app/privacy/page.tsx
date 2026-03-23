import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Anton } from "next/font/google"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
})

export const metadata = {
  title: "Privacy Policy - GRND",
  description: "Privacy Policy for GRND platform",
}

export default function PrivacyPolicyPage() {
  return (
    <div className={`dark min-h-screen bg-background text-foreground ${anton.variable}`}>
      {/* Top Navigation / Breadcrumbs */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-12 flex-wrap items-center gap-1.5 px-4 text-sm text-muted-foreground sm:px-6">
          <Link href="/" className="truncate hover:text-foreground transition-colors">
            GRND
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-foreground font-medium">Privacy Policy</span>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-48 w-full md:h-64 lg:h-72">
        <img
          src="/cover.jpg"
          alt="Cover"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Page Icon */}
        <div className="relative -mt-16 mb-6 inline-flex md:-mt-20 md:mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-background text-6xl shadow-sm ring-4 ring-background md:h-32 md:w-32 md:rounded-2xl md:text-7xl">
            🔒
          </div>
        </div>

        {/* Title */}
        <div className="group mb-12 rounded-sm outline-none">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground group-hover:text-foreground/80 transition-colors">
            Last updated: March 2026
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-6 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <p className="rounded-md px-1 py-1 transition-colors hover:bg-muted/50">
            GRND values your privacy and is committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, and safeguard
            your data when you use our platform.
          </p>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              1. Information We Collect
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20 space-y-2">
              <p>We may collect the following types of information:</p>
              <ul className="space-y-2 list-none">
                <li><span className="text-foreground font-medium">Personal Information:</span> Name, email address, phone number, and location provided during signup or profile setup.</li>
                <li><span className="text-foreground font-medium">Account Data:</span> Login credentials and authentication-related information (handled securely through third-party authentication services).</li>
                <li><span className="text-foreground font-medium">Usage Data:</span> Information about how you interact with the platform, such as pages visited, features used, and activity history.</li>
              </ul>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              2. How We Use Your Information
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20 space-y-2">
              <p>We use the collected information to:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Provide and improve platform functionality</li>
                <li>Enable user authentication and account management</li>
                <li>Help users discover games, players, teams, and events</li>
                <li>Facilitate communication and community interaction</li>
                <li>Ensure security and prevent misuse of the platform</li>
              </ul>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              3. Authentication and Security
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                GRND uses secure authentication mechanisms, including email verification
                and optional OTP-based login. Authentication services may be handled
                through trusted third-party providers. We do not store sensitive
                credentials such as passwords in plain text.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              4. Data Sharing
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20 space-y-2">
              <p>We do not sell or rent your personal information. Your data may be shared only in the following cases:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>With trusted third-party services required for platform functionality (such as authentication providers or payment gateways)</li>
                <li>When required by law or legal obligations</li>
                <li>To prevent fraud, misuse, or security threats</li>
              </ul>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              5. User Content
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                Any content you provide, such as profile details, game listings, or team
                participation, may be visible to other users of the platform. You are
                responsible for the information you choose to share.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              6. Data Storage and Protection
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                We implement appropriate security measures to protect your data from
                unauthorized access, loss, or misuse. However, no system is completely
                secure, and users should also take precautions to protect their accounts.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              7. Your Rights
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20 space-y-2">
              <p>You have the right to:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Withdraw consent for data usage (subject to platform limitations)</li>
              </ul>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              8. Third-Party Services
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                GRND may use third-party services such as authentication providers,
                payment gateways, or analytics tools. These services operate under their
                own privacy policies, and we are not responsible for their practices.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              9. Changes to This Policy
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                We may update this Privacy Policy from time to time. Continued use of
                the platform after updates indicates acceptance of the revised policy.
              </p>
            </div>
          </section>

          <section className="group space-y-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/50">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              10. Contact Us
            </h2>
            <div className="pl-4 border-l-2 border-muted-foreground/20">
              <p>
                If you have any questions or concerns about this Privacy Policy, you can
                contact us through the platform.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-white/5 bg-background">
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 pt-10 sm:flex-row sm:items-center sm:px-10">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            Crafted with ❤️ &nbsp;GRND developer team
          </p>
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
