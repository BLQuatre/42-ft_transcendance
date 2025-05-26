"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useDictionary } from "@/hooks/UseDictionnary";

type TwoFactorVerifyDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onVerify: (code: string) => Promise<void>;
	isLoading: boolean;
	error?: string | null;
};

export function TwoFactorVerifyDialog({
	open,
	onOpenChange,
	onVerify,
	isLoading,
	error,
}: TwoFactorVerifyDialogProps) {
	const [verificationCode, setVerificationCode] = useState("");
	const dict = useDictionary();

	// Reset the code when dialog opens
	useEffect(() => {
		if (open) {
			setVerificationCode("");
		}
	}, [open]);

	const handleVerify = async () => {
		if (!verificationCode || verificationCode.length !== 6) return;
		await onVerify(verificationCode);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md z-100">
				<DialogHeader>
					<DialogTitle className="font-pixel text-lg uppercase">
						{dict?.dialogs?.twoFactorVerify?.title ||
							"Two-Factor Authentication"}
					</DialogTitle>
					<DialogDescription className="font-pixel text-xs uppercase">
						{dict?.dialogs?.twoFactorVerify?.description ||
							"Enter the 6-digit code from your authenticator app"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="font-pixel text-xs space-y-2">
						<p>
							{dict?.dialogs?.twoFactorVerify?.enterCode ||
								"ENTER VERIFICATION CODE:"}
						</p>
						<Input
							id="verificationCode"
							value={verificationCode}
							onChange={(e) => {
								setVerificationCode(
									e.target.value.replace(/\D/g, "").substring(0, 6)
								);
							}}
							placeholder="123456"
							className="font-pixel text-sm h-10 bg-muted"
							maxLength={6}
							autoComplete="off"
							autoFocus
							disabled={isLoading}
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
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						{dict?.common?.cancel || "Cancel"}
					</Button>
					<Button
						type="button"
						className="font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90"
						onClick={handleVerify}
						disabled={
							!verificationCode || verificationCode.length < 6 || isLoading
						}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{dict?.dialogs?.twoFactorVerify?.verifying || "Verifying..."}
							</>
						) : (
							dict?.dialogs?.twoFactorVerify?.verify || "Verify"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
