import Image from "next/image";
import { MainNav } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Gamepad2, Users } from "lucide-react";
import { getDictionary } from "@/lib/dictionnaries";
import { Language } from "@/types/language";
import { GameButtons } from "@/components/GameButtons";
import { GameType } from "@/types/game";

export default async function GamesPage({
	params,
}: {
	params: Promise<{ lang: Language }>;
}) {
	const { lang } = await params;
	const dict = await getDictionary(lang);

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<MainNav />

			<main className="flex-1" id="pong">
				{/* Games Section */}
				<section className="py-12 md:py-24 lg:py-16">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center mb-12">
							<h2 className="font-pixel text-2xl md:text-4xl text-game-orange uppercase">
								{dict.games.title}
							</h2>
							<div className="w-20 h-1 bg-game-orange"></div>
							<p className="max-w-3xl text-muted-foreground font-pixel text-sm uppercase">
								{dict.games.description}
							</p>
						</div>

						{/* Pong Game Feature */}
						<div className="mb-20">
							<div className="rounded-xl pixel-border bg-card overflow-hidden">
								<div className="grid md:grid-cols-2 gap-0">
									<div className="p-8 md:p-10 flex flex-col justify-center">
										<div className="inline-flex items-center px-3 py-1 rounded-full bg-game-blue/20 text-game-blue font-pixel text-xs mb-4 w-fit uppercase">
											<Gamepad2 className="mr-2 h-4 w-4" />
											{dict.games.pong.type}
										</div>
										<h3 className="font-pixel text-3xl text-game-blue mb-4 uppercase">
											PONG
										</h3>
										<div className="space-y-4 mb-6">
											<p className="font-pixel text-sm uppercase">
												{dict.games.pong.description}
											</p>
											<div className="space-y-2">
												<h4 className="font-pixel text-lg text-game-blue uppercase  ">
													{dict.games.how}:
												</h4>
												<ul className="space-y-2 font-pixel text-xs text-muted-foreground">
													{dict.games.pong.explications.map(
														(text: string, index: number) => (
															<li key={index} className="flex items-start">
																<span className="mr-2">•</span>
																<span className="uppercase">{text}</span>
															</li>
														)
													)}
												</ul>
											</div>

											<div className="flex flex-wrap gap-4 items-center">
												<div className="flex items-center gap-2 font-pixel text-xs">
													<Users className="h-4 w-4 text-game-blue" />
													<span className="uppercase">
														{dict.games.pong.players}
													</span>
												</div>
											</div>
										</div>

										<GameButtons
											gameType={GameType.PONG}
											buttonText={`${dict.common.play} PONG`}
										/>
									</div>
									<div className="aspect-auto overflow-hidden bg-black/5">
										<Image
											src="/images/pong.png"
											alt="Pong Game"
											width={800}
											height={600}
											className="object-cover h-full w-full"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Dino Game Feature */}
						<div id="dino">
							<div className="rounded-xl pixel-border bg-card overflow-hidden">
								<div className="grid md:grid-cols-2 gap-0">
									<div className="order-2 md:order-1 aspect-auto overflow-hidden bg-black/5">
										<Image
											src="/images/dino.jpg"
											alt="Dino Game"
											width={800}
											height={600}
											className="object-cover h-full w-full"
										/>
									</div>
									<div className="order-1 md:order-2 p-8 md:p-10 flex flex-col justify-center">
										<div className="inline-flex items-center px-3 py-1 rounded-full bg-game-orange/20 text-game-orange font-pixel text-xs mb-4 w-fit uppercase">
											<Gamepad2 className="mr-2 h-4 w-4" />
											{dict.games.dino.type}
										</div>
										<h3 className="font-pixel text-3xl text-game-orange mb-4 uppercase">
											DINO RUN
										</h3>
										<div className="space-y-4 mb-6">
											<p className="font-pixel text-sm uppercase">
												{dict.games.dino.description}
											</p>

											<div className="space-y-2">
												<h4 className="font-pixel text-lg text-game-orange uppercase">
													{dict.games.how}:
												</h4>
												<ul className="space-y-2 font-pixel text-xs text-muted-foreground">
													{dict.games.dino.explications.map(
														(text: string, index: number) => (
															<li key={index} className="flex items-start">
																<span className="mr-2">•</span>
																<span className="uppercase">{text}</span>
															</li>
														)
													)}
												</ul>
											</div>

											<div className="flex flex-wrap gap-4 items-center">
												<div className="flex items-center gap-2 font-pixel text-xs">
													<Users className="h-4 w-4 text-game-orange" />
													<span className="uppercase">
														{dict.games.dino.players}
													</span>
												</div>
											</div>
										</div>

										<GameButtons
											gameType={GameType.DINO}
											buttonText={`${dict.common.play} DINO RUN`}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
