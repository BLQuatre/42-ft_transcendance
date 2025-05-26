import { GameType } from "@/types/game"
import { ToastVariant } from "@/types/types"

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

export function getToastBorderClass(toastType: ToastVariant) {
	switch (toastType) {
		case ToastVariant.SUCCESS:
			return "minecraft-border-green"
		case ToastVariant.ERROR:
		case ToastVariant.DESTRUCTIVE:
			return "minecraft-border-red"
		case ToastVariant.WARNING:
			return "minecraft-border-yellow"
		case ToastVariant.INFO:
			return "minecraft-border-blue"
		default:
			return "minecraft-border"
	}
}

export function getToastShadowClass(toastType: ToastVariant) {
	switch (toastType) {
		case ToastVariant.SUCCESS:
			return "shadow-green-600/50"
		case ToastVariant.ERROR:
		case ToastVariant.DESTRUCTIVE:
			return "shadow-red-600/50"
		case ToastVariant.WARNING:
			return "shadow-yellow-600/50"
		case ToastVariant.INFO:
			return "shadow-blue-600/50"
		default:
			return "shadow-slate-600/50"
	}
}

export function getToastIconColor(toastType: ToastVariant) {
	switch (toastType) {
		case ToastVariant.SUCCESS:
			return "text-game-green"
		case ToastVariant.ERROR:
		case ToastVariant.DESTRUCTIVE:
			return "text-game-red"
		case ToastVariant.WARNING:
			return "text-game-yellow"
		case ToastVariant.INFO:
			return "text-game-blue"
		default:
			return "text-white"
	}
}
