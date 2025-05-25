"use client"

import { useState, useEffect } from "react"

export function useTermsPrivacy() {
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if terms and privacy have been accepted
    const checkAcceptance = () => {
      const cookies = document.cookie.split(";")
      const termsAccepted = cookies.some((cookie) => cookie.trim().startsWith("terms-privacy-accepted=true"))

      if (!termsAccepted) {
        setShowDialog(true)
      }
      setIsLoading(false)
    }

    checkAcceptance()
  }, [])

  const handleAccept = () => {
    setShowDialog(false)
  }

  return {
    showDialog,
    isLoading,
    handleAccept,
  }
}
