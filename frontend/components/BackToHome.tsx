import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/hooks/UseDictionnary";

interface BackToHomeButtonProps {
	gameType?: string;
	className?: string;
}

export default function BackToHomeButton({
	gameType,
	className,
}: BackToHomeButtonProps) {
	const isPong = gameType === "pong";
	const dict = useDictionary();

	return (
		<Button
			variant="outline"
			size="sm"
			className={cn(
				"font-pixel text-xs flex items-center gap-2 border-2",
				isPong
					? "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
					: "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
				className
			)}
			asChild
		>
			<Link href="/">
				<Home className="h-4 w-4" />
				{dict?.common?.backToHome || "BACK TO HOME"}
			</Link>
		</Button>
	);
}
