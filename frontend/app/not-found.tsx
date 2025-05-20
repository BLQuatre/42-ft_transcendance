'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function NotFoundRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    const isAlreadyLocalized404 = /^\/[a-z]{2}(?:-[A-Z]{2})?\/not-found$/.test(pathname)

    if (!isAlreadyLocalized404) {
      const lang = pathname.split('/')[1] || 'en'
      router.replace(`/${lang}/not-found`)
    }
  }, [pathname, router])

  return null
}
