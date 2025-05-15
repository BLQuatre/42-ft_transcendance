import { Footer } from "./footer";
import { MainNav } from "./main-nav";

export default function Loading({ dict }: { dict: any }) {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<MainNav />
				<div className="flex-1 container py-8 px-4 md:px-6 flex items-center justify-center">
					<div className="font-pixel text-xl animate-pulse uppercase">{dict.common.loading}</div>
				</div>
			<Footer dict={dict} />
		</div>
	)
}
