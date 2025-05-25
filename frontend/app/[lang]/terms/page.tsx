import { Footer } from "@/components/Footer"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-pixel text-3xl md:text-4xl mb-4 text-game-blue">TERMS OF SERVICE</h1>
          <p className="font-pixel text-sm text-muted-foreground">Last updated: May 25, 2025</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to FT_TRANSCENDANCE! These Terms of Service ("Terms") govern your use of our retro gaming
              platform. By accessing or using our service, you agree to be bound by these Terms. Please read them
              carefully.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">1.</span>
              ACCEPTANCE OF TERMS
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">
                By creating an account, accessing, or using FT_TRANSCENDANCE, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p className="text-sm leading-relaxed">
                If you do not agree to these Terms, you must not access or use our service.
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">2.</span>
              SERVICE DESCRIPTION
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">
                FT_TRANSCENDANCE is an online retro gaming platform that provides:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Classic arcade-style games and tournaments
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Player statistics tracking and leaderboards
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Social features including chat and friend systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Customizable profiles and avatars
                </li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">3.</span>
              ACCOUNT REGISTRATION
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Provide accurate and complete information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Maintain the security of your account credentials
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Be responsible for all activities under your account
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Notify us immediately of any unauthorized access
                </li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">4.</span>
              COMMUNITY GUIDELINES
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">
                We strive to maintain a positive gaming environment. You agree not to:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Engage in harassment, bullying, or toxic behavior
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Use cheats, exploits, or unauthorized third-party software
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Share inappropriate, offensive, or illegal content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Impersonate other users or create fake accounts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Attempt to gain unauthorized access to our systems
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Violations may result in warnings, temporary suspension, or permanent account termination.
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">5.</span>
              INTELLECTUAL PROPERTY
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">
                All content on FT_TRANSCENDANCE, including games, graphics, logos, music, and text, is protected by
                intellectual property laws. You may not:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Copy, distribute, or modify our content without permission
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Use our trademarks or branding in unauthorized ways
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">×</span>
                  Reverse engineer or attempt to extract source code
                </li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">6.</span>
              PRIVACY & DATA
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">
                Your privacy is important to us. We collect and use your data as described in our Privacy Policy,
                including:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Game statistics and performance data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Communication and social interaction logs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  Technical information for service improvement
                </li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">7.</span>
              LIMITATION OF LIABILITY
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">
                FT_TRANSCENDANCE is provided "as is" without warranties. We are not liable for:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  Service interruptions or technical issues
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  Actions of other users on the platform
                </li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">8.</span>
              TERMINATION
            </h2>
            <div className="pl-6 space-y-3">
              <p className="text-sm leading-relaxed">Either party may terminate this agreement:</p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  You may delete your account at any time
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-blue mt-1">•</span>
                  We may suspend accounts for Terms violations
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-xs text-muted-foreground">
            By using FT_TRANSCENDANCE, you acknowledge that you have read and understood these Terms of Service.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
