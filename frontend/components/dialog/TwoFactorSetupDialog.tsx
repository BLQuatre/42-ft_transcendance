"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/hooks/UseDictionnary";

type TwoFactorSetupDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onComplete?: () => void;
};

export function TwoFactorSetupDialog({
	open,
	onOpenChange,
	onComplete,
}: TwoFactorSetupDialogProps) {
	const [loading, setLoading] = useState(false);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
	const [secret, setSecret] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const dict = useDictionary();

	useEffect(() => {
		if (open) {
			setError(null);
			setVerificationCode("");
			setLoading(true);
			setup();
		}
	}, [open]);

	const setup = async () => {
		try {
			const response = await api.get(`/user/tfa/setup`);
			if (response.data.qrCodeUrl) setQrCodeDataUrl(response.data.qrCodeUrl);
			if (response.data.secret) setSecret(response.data.secret);
		} catch (error) {
			console.error("Error setting up 2FA:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCopySecret = () => {
		navigator.clipboard.writeText(secret);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleVerify = async () => {
		if (!verificationCode) {
			setError(
				dict?.dialogs?.twoFactorSetup?.errors?.enterCode ||
					"Please enter the verification code"
			);
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await api.post(`/user/tfa-activate`, {
				token: verificationCode,
			});

			if (response.data.statusCode === 200) {
				setLoading(false);
				setError(null);
				setVerificationCode("");
				onOpenChange(false);
				if (onComplete) onComplete();
			} else {
				throw new Error("Invalid verification code");
			}
		} catch (error) {
			setLoading(false);
			setError(
				dict?.dialogs?.twoFactorSetup?.errors?.invalidCode ||
					"Invalid verification code. Please try again."
			);
		}
	};

	const handleCancel = () => {
		setVerificationCode("");
		setError("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-170">
				<DialogHeader>
					<DialogTitle className="font-pixel text-lg uppercase">
						{dict?.dialogs?.twoFactorSetup?.title ||
							"Setup Two-Factor Authentication"}
					</DialogTitle>
					<DialogDescription className="font-pixel text-xs uppercase">
						{dict?.dialogs?.twoFactorSetup?.description ||
							"Secure your account with an authenticator app"}
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
								<p>
									{dict?.dialogs?.twoFactorSetup?.scanQrCode ||
										"1. SCAN THIS QR CODE WITH YOUR AUTHENTICATOR APP"}
								</p>
								<div className="flex justify-center p-2 bg-muted rounded-md">
									{qrCodeDataUrl ? (
										<img
											src={qrCodeDataUrl}
											alt="2FA QR Code"
											className="w-48 h-48"
										/>
									) : (
										<div className="w-48 h-48 flex items-center justify-center bg-muted">
											<p className="font-pixel text-xs text-muted-foreground">
												{dict?.dialogs?.twoFactorSetup?.qrLoading ||
													"QR CODE LOADING..."}
											</p>
										</div>
									)}
								</div>
							</div>

							<Separator />

							<div className="font-pixel text-xs space-y-2">
								<p>
									{dict?.dialogs?.twoFactorSetup?.manualCode ||
										"2. OR MANUALLY ENTER THIS SECRET CODE:"}
								</p>
								<div className="flex items-center space-x-2 w-full justify-between">
									<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-pixel overflow-x-auto max-w-xs whitespace-nowrap">
										{secret}
									</code>
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8 flex-shrink-0"
										onClick={handleCopySecret}
										title={
											dict?.dialogs?.twoFactorSetup?.copyToClipboard ||
											"Copy to clipboard"
										}
									>
										{copied ? (
											<Check className="h-4 w-4" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<Separator />

							<div className="font-pixel text-xs space-y-2">
								<p>
									{dict?.dialogs?.twoFactorSetup?.enterCode ||
										"3. ENTER THE CODE FROM YOUR AUTHENTICATOR APP:"}
								</p>
								<Input
									id="verificationCode"
									value={verificationCode}
									onChange={(e) => {
										setError(null);
										setVerificationCode(
											e.target.value.replace(/\D/g, "").substring(0, 6)
										);
									}}
									placeholder="123456"
									className="font-pixel text-sm h-10 bg-muted"
									maxLength={6}
									autoComplete="off"
									error={error !== null}
								/>
								<p
									className={cn(
										"font-pixel text-xs text-destructive mt-1",
										error ? "" : "select-none"
									)}
								>
									{error || " "}
								</p>
							</div>
						</div>

						<DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
							<Button
								type="button"
								variant="cancel"
								className="font-pixel text-xs uppercase"
								onClick={handleCancel}
							>
								{dict?.common?.cancel || "Cancel"}
							</Button>
							<Button
								type="button"
								className="font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90"
								onClick={handleVerify}
								disabled={!verificationCode || verificationCode.length < 6}
							>
								{dict?.dialogs?.twoFactorSetup?.verifyEnable ||
									"Verify & Enable"}
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
