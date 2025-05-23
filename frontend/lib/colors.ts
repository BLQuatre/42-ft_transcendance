import { GameType } from "@/types/game"

export function getBgColor(gameType: GameType) {
	return gameType === GameType.PONG ? "bg-game-blue" : "bg-game-orange"
}

export function getTextColor(gameType: GameType) {
	return gameType === GameType.PONG ? "text-game-blue" : "text-game-orange"
}

export function getBorderColor(gameType: GameType) {
	return gameType === GameType.PONG ? "border-game-blue" : "border-game-orange"
}

export function getHoverBgColor(gameType: GameType) {
	return gameType === GameType.PONG ? "hover:bg-game-blue/90" : "hover:bg-game-orange/90"
}

export function getHoverTextColor(gameType: GameType) {
	return gameType === GameType.PONG ? "text-game-blue" : "text-game-orange"
}
