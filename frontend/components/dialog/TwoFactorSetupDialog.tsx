"use client"

import { useState, useEffect } from "react"
import { Check, Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Separator } from "@/components/ui/Separator"
import { generateQRCode, generateTOTPUri } from "@/lib/qr-code"

type TwoFactorSetupDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
  // Optional props for direct integration with backend
  secretHash?: string
  userEmail?: string
  appName?: string
}

export function TwoFactorSetupDialog({
  open,
  onOpenChange,
  onComplete,
  secretHash,
  userEmail = "player_one@example.com",
  appName = "RetroArcade",
}: TwoFactorSetupDialogProps) {
  const [loading, setLoading] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)

      // If a secret hash is provided directly, use it
      if (secretHash) {
        generateQRCodeFromHash(secretHash)
      } else {
        // Otherwise simulate getting one from the backend
        fetchSecretFromBackend()
      }
    }
  }, [open, secretHash])

  // Function to generate QR code from provided hash
  const generateQRCodeFromHash = async (hash: string) => {
    try {
      // Format the hash into a TOTP URI
      const uri = generateTOTPUri(appName, userEmail, hash)

      // Generate the QR code
      const dataUrl = await generateQRCode(uri)

      setQrCodeDataUrl(dataUrl)
      setSecret(hash)
      setLoading(false)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
      setError("Failed to generate QR code. Please try again.")
      setLoading(false)
    }
  }

  // Mock function to simulate fetching a secret from the backend
  const fetchSecretFromBackend = async () => {
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a delay and return a mock secret
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response from backend
      const mockResponse = {
        success: true,
        data: {
          secret: "JBSWY3DPEHPK3PXP", // Example secret
          factorId: "factor_" + Math.random().toString(36).substring(2, 11),
        },
      }

      if (mockResponse.success) {
        // Generate QR code from the secret
        await generateQRCodeFromHash(mockResponse.data.secret)
      } else {
        throw new Error("Failed to get 2FA secret from server")
      }
    } catch (error) {
      console.error("Error fetching 2FA secret:", error)
      setError("Failed to initialize 2FA setup. Please try again.")
      setLoading(false)
    }
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code")
      return
    }

    setLoading(true)
    setError("")

    try {
      // In a real app, this would be an API call to verify the code
      // For demo purposes, we'll simulate a delay and success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock verification - in a real app, you would call your backend API
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        // Success scenario
        setLoading(false)
        onOpenChange(false)
        if (onComplete) onComplete()
      } else {
        // Error scenario
        throw new Error("Invalid verification code")
      }
    } catch (error) {
      setLoading(false)
      setError("Invalid verification code. Please try again.")
    }
  }

  const handleCancel = () => {
    setVerificationCode("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-pixel text-lg uppercase">Setup Two-Factor Authentication</DialogTitle>
          <DialogDescription className="font-pixel text-xs uppercase">
            Secure your account with an authenticator app
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && (
          <>
            <div className="space-y-4 py-4">
              <div className="font-pixel text-xs space-y-2">
                <p>1. SCAN THIS QR CODE WITH YOUR AUTHENTICATOR APP</p>
                <div className="flex justify-center p-2 bg-muted rounded-md">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl || "/placeholder.svg"} alt="2FA QR Code" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-muted">
                      <p className="font-pixel text-xs text-muted-foreground">QR CODE LOADING...</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="font-pixel text-xs space-y-2">
                <p>2. OR MANUALLY ENTER THIS SECRET CODE:</p>
                <div className="flex items-center space-x-2">
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-pixel">
                    {secret}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopySecret}
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="font-pixel text-xs space-y-2">
                <p>3. ENTER THE CODE FROM YOUR AUTHENTICATOR APP:</p>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, "").substring(0, 6))
                    setError("")
                  }}
                  placeholder="123456"
                  className="font-pixel text-sm h-10 bg-muted"
                  maxLength={6}
                />
                {error && <p className="text-xs text-destructive font-pixel mt-1">{error}</p>}
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
              <Button type="button" variant="cancel" className="font-pixel text-xs uppercase" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                className="font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90"
                onClick={handleVerify}
                disabled={!verificationCode || verificationCode.length < 6}
              >
                Verify & Enable
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
