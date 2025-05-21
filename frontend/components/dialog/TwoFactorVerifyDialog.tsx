"use client"

import { useState, useEffect } from "react"
import { Loader2 } from 'lucide-react'
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

type TwoFactorVerifyDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (code: string) => Promise<void>
  isLoading: boolean
  error?: string | null
}

export function TwoFactorVerifyDialog({
  open,
  onOpenChange,
  onVerify,
  isLoading,
  error
}: TwoFactorVerifyDialogProps) {
  const [verificationCode, setVerificationCode] = useState("")

  // Reset the code when dialog opens
  useEffect(() => {
    if (open) {
      setVerificationCode("")
    }
  }, [open])

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) return
    await onVerify(verificationCode)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-pixel text-lg uppercase">Two-Factor Authentication</DialogTitle>
          <DialogDescription className="font-pixel text-xs uppercase">
            Enter the 6-digit code from your authenticator app
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="font-pixel text-xs space-y-2">
            <p>ENTER VERIFICATION CODE:</p>
            <Input
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value.replace(/\D/g, "").substring(0, 6))
              }}
              placeholder="123456"
              className="font-pixel text-sm h-10 bg-muted"
              maxLength={6}
              autoFocus
              disabled={isLoading}
            />
            {error && <p className="text-xs text-destructive font-pixel mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            className="font-pixel text-xs uppercase" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90"
            onClick={handleVerify}
            disabled={!verificationCode || verificationCode.length < 6 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
