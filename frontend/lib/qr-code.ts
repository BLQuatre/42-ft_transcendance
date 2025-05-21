import QRCode from 'qrcode'

/**
 * Generates a QR code from a string and returns it as a base64-encoded image
 *
 * @param text The text to encode in the QR code (e.g., TOTP URI or hash)
 * @param options Optional QR code generation options
 * @returns Promise that resolves to a base64-encoded image string
 */
export async function generateQRCode(text: string, options: QRCode.QRCodeToDataURLOptions = {}): Promise<string> {
  try {
    // Default options for good QR code readability
    const defaultOptions: QRCode.QRCodeToDataURLOptions = {
      margin: 1,
      width: 250,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      ...options,
    }

    // Generate QR code as data URL (base64)
    const dataUrl = await QRCode.toDataURL(text, defaultOptions)
    return dataUrl
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

/**
 * Generates a TOTP URI for use with authenticator apps
 *
 * @param issuer The name of your application/service
 * @param accountName The user's account name/email
 * @param secret The TOTP secret key
 * @returns A properly formatted TOTP URI
 */
export function generateTOTPUri(issuer: string, accountName: string, secret: string): string {
  // Ensure the issuer and account name are URL encoded
  const encodedIssuer = encodeURIComponent(issuer)
  const encodedAccount = encodeURIComponent(accountName)

  // Format: otpauth://totp/ISSUER:ACCOUNT?secret=SECRET&issuer=ISSUER
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}`
}
