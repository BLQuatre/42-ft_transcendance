import Link from "next/link"

export function Footer({ dict }: { dict: any }) {
  return (
    <footer className="border-t border-muted py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-pixel text-sm bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent animate-pixelate uppercase">
              {dict.title}
            </span>
          </div>
          <p className="font-pixel text-xs text-muted-foreground uppercase">© 2025 {dict.title}</p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="font-pixel text-xs text-muted-foreground hover:text-game-blue uppercase">
              {dict.footer.terms}
            </Link>
            <Link href="/privacy" className="font-pixel text-xs text-muted-foreground hover:text-game-blue uppercase">
              {dict.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
