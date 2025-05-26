"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { User, Users } from "lucide-react";
import { useDictionary } from "@/hooks/UseDictionnary";
import { useAuth } from "@/contexts/auth-context";

export function MainNav() {
	const { accessToken } = useAuth();

	const pathname = usePathname();

	const dict = useDictionary();
	if (!dict) return null;

	return (
		<div className="flex justify-between items-center w-full px-4 py-3 bg-game-dark border-b-4 border-game-blue">
			<Link href="/" className="flex items-center space-x-2">
				<span className="font-pixel text-xl bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent animate-pixelate uppercase">
					{dict.title}
				</span>
			</Link>

			<div className="flex items-center space-x-4">
				{accessToken ? (
					<>
						<div className="relative">
							<Link
								href="/friends"
								className={cn(
									"flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-muted",
									pathname === "/friends" ? "bg-muted" : ""
								)}
							>
								<Users className="h-5 w-5" />
								<span className="font-pixel text-xs hidden sm:inline-block uppercase">
									{dict.navbar.friends}
								</span>
							</Link>
						</div>
						<div className="relative">
							<Link
								href="/dashboard"
								className={cn(
									"flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-muted",
									pathname === "/dashboard" ? "bg-muted" : ""
								)}
							>
								<User className="h-5 w-5" />
								<span className="font-pixel text-xs hidden sm:inline-block uppercase">
									{dict.navbar.dashboard}
								</span>
							</Link>
						</div>
					</>
				) : (
					<>
						<Button
							asChild
							className="font-pixel bg-game-orange hover:bg-game-orange/90 uppercase hidden sm:flex"
						>
							<Link href="/login">{dict.connection.login}</Link>
						</Button>
						<Button
							asChild
							className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
						>
							<Link href="/register">{dict.connection.register}</Link>
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
