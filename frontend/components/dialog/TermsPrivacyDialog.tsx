"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import Link from "next/link";
import { useDictionary } from "@/hooks/UseDictionnary";

interface TermsPrivacyDialogProps {
	open: boolean;
	onAccept: () => void;
}

export function TermsPrivacyDialog({
	open,
	onAccept,
}: TermsPrivacyDialogProps) {
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [privacyAccepted, setPrivacyAccepted] = useState(false);
	const dict = useDictionary();

	const canAccept = termsAccepted && privacyAccepted;

	const handleAccept = () => {
		if (canAccept) {
			// Set cookie to remember acceptance
			document.cookie = "terms-privacy-accepted=true; path=/; max-age=31536000"; // 1 year
			onAccept();
		}
	};

	return (
		<Dialog open={open} onOpenChange={() => {}} modal>
			<DialogContent
				className="sm:max-w-120 font-pixel"
				hideCloseButton
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="font-pixel text-xl text-center uppercase">
						{dict?.dialogs?.termsPrivacy?.title || "Terms & Privacy"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<p className="font-pixel text-sm text-muted-foreground text-center">
						{dict?.dialogs?.termsPrivacy?.description ||
							"Before continuing, please accept our terms and privacy policy."}
					</p>

					<div className="space-y-3">
						<div className="flex items-start space-x-3">
							<Checkbox
								id="terms"
								checked={termsAccepted}
								onCheckedChange={(checked) =>
									setTermsAccepted(checked as boolean)
								}
								className="mt-1"
							/>
							<label
								htmlFor="terms"
								className="font-pixel text-xs leading-relaxed cursor-pointer"
							>
								{dict?.dialogs?.termsPrivacy?.agreeToTerms || "I agree to the"}{" "}
								<Link
									href="/terms"
									className="text-game-blue hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									{dict?.dialogs?.termsPrivacy?.termsOfService ||
										"Terms of Service"}
								</Link>
							</label>
						</div>

						<div className="flex items-start space-x-3">
							<Checkbox
								id="privacy"
								checked={privacyAccepted}
								onCheckedChange={(checked) =>
									setPrivacyAccepted(checked as boolean)
								}
								className="mt-1"
							/>
							<label
								htmlFor="privacy"
								className="font-pixel text-xs leading-relaxed cursor-pointer"
							>
								{dict?.dialogs?.termsPrivacy?.agreeToPrivacy ||
									"I agree to the"}{" "}
								<Link
									href="/privacy"
									className="text-game-blue hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									{dict?.dialogs?.termsPrivacy?.privacyPolicy ||
										"Privacy Policy"}
								</Link>
							</label>
						</div>
					</div>

					<div className="pt-4">
						<Button
							onClick={handleAccept}
							disabled={!canAccept}
							className="w-full font-pixel bg-game-blue hover:bg-game-blue/90 uppercase disabled:opacity-50"
						>
							{dict?.dialogs?.termsPrivacy?.acceptContinue ||
								"Accept & Continue"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
