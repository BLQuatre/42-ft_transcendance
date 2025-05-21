import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../styles/globals.css" // Updated path assuming styles are at project root
import { Toaster } from "@/components/ui/Toaster"
import { AuthProvider } from "@/contexts/auth-context"
import InitAuth from "@/hooks/InitAuth"
import SimpleChatWrapper from "@/components/SimpleChatWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Home - Transcendance",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <InitAuth />
          {children}
          <SimpleChatWrapper />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
