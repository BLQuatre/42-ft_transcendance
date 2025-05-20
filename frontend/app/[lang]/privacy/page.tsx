import { Footer } from "@/components/Footer"
import { MainNav } from "@/components/Navbar"
import { getDictionary } from "@/lib/dictionnaries"
import { Language } from "@/types/types"

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: Language }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2">{"CONFIDENTIALITÉ"}</h1>
          <p className="font-pixel text-xs text-muted-foreground">{"Dernière mise à jour : 08/05/2025"}</p>
        </div>
      </div>

      <Footer dict={dict}/>
    </div>
  )
}
