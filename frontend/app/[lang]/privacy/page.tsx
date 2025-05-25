"use client"

import { Footer } from "@/components/Footer"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { useDictionary } from "@/hooks/UseDictionnary"

export default function PrivacyPage() {
  const dict = useDictionary()
  if (!dict) return null

  return (
    <div className="min-h-screen bg-background flex flex-col font-pixel">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-pixel text-3xl md:text-4xl mb-4 text-primary">{dict.privacy.title}</h1>
          <p className="font-pixel text-sm text-muted-foreground">{dict.privacy.lastUpdated}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dict.privacy.welcome}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">1.</span>
              {dict.privacy.sections.collect.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.collect.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.collect.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">2.</span>
              {dict.privacy.sections.use.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">{dict.privacy.sections.use.content}</p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.use.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">3.</span>
              {dict.privacy.sections.sharing.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.sharing.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.sharing.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">4.</span>
              {dict.privacy.sections.security.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.security.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.security.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground mt-3">
                {dict.privacy.sections.security.disclaimer}
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">5.</span>
              {dict.privacy.sections.rights.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.rights.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.rights.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">6.</span>
              {dict.privacy.sections.cookies.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.cookies.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.cookies.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">7.</span>
              {dict.privacy.sections.retention.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.retention.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.retention.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">8.</span>
              {dict.privacy.sections.international.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.international.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.international.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-pixel text-2xl text-primary flex items-center gap-2">
              <span className="text-primary">9.</span>
              {dict.privacy.sections.changes.title}
            </h2>
            <div className="pl-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {dict.privacy.sections.changes.content}
              </p>
              <ul className="text-sm space-y-2 ml-4">
                {dict.privacy.sections.changes.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-xs text-muted-foreground">
            {dict.privacy.footer}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
