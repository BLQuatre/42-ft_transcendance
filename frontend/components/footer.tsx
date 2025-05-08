import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-muted py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-pixel text-sm bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent animate-pixelate">
              FT_TRANSCENDANCE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cgu" className="font-pixel text-xs text-muted-foreground hover:text-game-blue">
              CGU
            </Link>
            <Link href="/privacy" className="font-pixel text-xs text-muted-foreground hover:text-game-blue">
              CONFIDENTIALITÉ
            </Link>
          </div>
          <p className="font-pixel text-xs text-muted-foreground">© 2025 FT_TRANSCENDANCE. TOUS DROITS RÉSERVÉS.</p>
        </div>
      </div>
    </footer>
  )
}
