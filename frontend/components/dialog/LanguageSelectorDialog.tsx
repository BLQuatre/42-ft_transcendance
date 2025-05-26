"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { setCookie, getCookie } from "cookies-next";
import { Check, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/hooks/UseDictionnary";

const languages: {
	code: string;
	name: string;
	nativeName: string;
	flag: string;
}[] = [
	{
		code: "en",
		name: "English",
		nativeName: "English",
		flag: "/images/en.png",
	},
	{
		code: "fr",
		name: "French",
		nativeName: "Français",
		flag: "/images/fr.webp",
	},
	{
		code: "ru",
		name: "Russian",
		nativeName: "Русский",
		flag: "/images/ru.png",
	},
	{
		code: "ro",
		name: "Romanian",
		nativeName: "Română",
		flag: "/images/ro.png",
	},
];

interface LanguageSelectorDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LanguageSelectorDialog({
	open,
	onOpenChange,
}: LanguageSelectorDialogProps) {
	const router = useRouter();
	const [currentLanguage, setCurrentLanguage] = useState<string>("en");
	const [isChanging, setIsChanging] = useState<string | null>(null);
	const dict = useDictionary();

	useEffect(() => {
		// Get current language from cookie or URL
		const cookieLanguage = getCookie("selectedLanguage");
		const urlLanguage = window.location.pathname.split("/")[1];
		const detectedLanguage = cookieLanguage || urlLanguage || "en";
		setCurrentLanguage(detectedLanguage as string);
	}, []);

	const selectLanguage = async (lang: string) => {
		if (lang === currentLanguage) {
			onOpenChange(false);
			return;
		}

		setIsChanging(lang);

		// Set cookie with language preference
		setCookie("selectedLanguage", lang, {
			maxAge: 60 * 60 * 24 * 365, // 1 year
			path: "/",
			sameSite: "lax",
		});

		// Small delay for visual feedback
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Navigate to new language
		let path = window.location.pathname.slice(3);
		if (path.startsWith("/")) {
			path = path.slice(1);
		}

		onOpenChange(false);
		window.location.href = `/${lang}/${path}`;
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg bg-game-dark rounded-lg shadow-2xl">
				<DialogHeader className="text-center space-y-3">
					<div className="flex justify-center">
						<div className="p-3 bg-game-blue/20 rounded-full">
							<Globe className="h-8 w-8 text-game-blue" />
						</div>
					</div>
					<DialogTitle className="font-pixel mt-2.5 text-center tetext-2xl bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent uppercase">
						{dict?.language?.title || "Choose Language"}
					</DialogTitle>
					<DialogDescription className="font-pixel text-center text-sm text-muted-foreground">
						{dict?.language?.description ||
							"Select your preferred language for the interface"}
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
					{languages.map((language) => {
						const isSelected = currentLanguage === language.code;
						const isLoading = isChanging === language.code;

						return (
							<Button
								key={language.code}
								variant="outline"
								className={cn(
									"relative flex items-center justify-start p-4 h-auto font-pixel transition-all duration-200",
									"border-2 rounded-lg hover:scale-105 hover:shadow-lg",
									isSelected
										? "border-game-blue bg-game-blue/10 text-game-blue"
										: "border-muted hover:border-game-orange hover:bg-game-orange/5 hover:text-foreground",
									isLoading && "opacity-50 cursor-not-allowed"
								)}
								onClick={() => selectLanguage(language.code)}
								disabled={isLoading}
							>
								<div className="flex items-center space-x-3 w-full">
									<div className="relative w-8 h-6 rounded overflow-hidden border border-muted flex-shrink-0">
										<Image
											src={language.flag || "/placeholder.svg"}
											alt={`${language.name} flag`}
											fill
											className="object-cover"
											sizes="32px"
										/>
									</div>

									<div className="flex-1 text-left">
										<div className="font-pixel text-sm uppercase">
											{language.nativeName}
										</div>
										<div className="font-pixel text-xs text-muted-foreground">
											{language.name}
										</div>
									</div>

									{isSelected && (
										<Check className="h-4 w-4 text-game-blue flex-shrink-0" />
									)}

									{isLoading && (
										<div className="h-4 w-4 border-2 border-game-blue border-t-transparent rounded-full animate-spin flex-shrink-0" />
									)}
								</div>
							</Button>
						);
					})}
				</div>

				<div className="text-center">
					<p className="font-pixel text-xs text-muted-foreground">
						{dict?.language?.savedPreference ||
							"Language preference will be saved for future visits"}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
