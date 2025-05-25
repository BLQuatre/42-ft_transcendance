'use client'

import { Footer } from "@/components/Footer"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { useDictionary } from "@/hooks/UseDictionnary"

export default function TermsPage() {

    const dict = useDictionary()
    if (!dict) return null

    return (
    <div className="min-h-screen bg-background flex flex-col font-pixel">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-pixel text-3xl md:text-4xl mb-4 text-game-blue">{dict.terms.title}</h1>
          <p className="font-pixel text-sm text-muted-foreground">{dict.terms.lastUpdated}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dict.terms.welcome}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">1.</span>
              {dict.terms.sections.acceptance.title}
            </h2>
            <div className="pl-4 space-y-3">
              {dict.terms.sections.acceptance.content.map((paragraph: string, index: number) => (
                <p key={index} className="text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">2.</span>
              {dict.terms.sections.service.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.terms.sections.service.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.terms.sections.service.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-game-blue mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">3.</span>
              {dict.terms.sections.registration.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.terms.sections.registration.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.terms.sections.registration.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-game-blue mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">4.</span>
              {dict.terms.sections.community.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.terms.sections.community.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.terms.sections.community.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">×</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {dict.terms.sections.community.violations}
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">5.</span>
              {dict.terms.sections.intellectual.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.terms.sections.intellectual.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.terms.sections.intellectual.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">6.</span>
              {dict.terms.sections.privacy.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.terms.sections.privacy.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.terms.sections.privacy.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-game-blue mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">7.</span>
              {dict.terms.sections.liability.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.terms.sections.liability.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.terms.sections.liability.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-game-blue flex items-center gap-2">
              <span className="text-game-blue">8.</span>
              {dict.terms.sections.termination.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">{dict.terms.sections.termination.content}</p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.terms.sections.termination.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-game-blue mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-xs text-muted-foreground">
            {dict.terms.footer}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
