import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function handleImageUpload(file: File): Promise<string> {
	if (!["image/jpeg", "image/png"].includes(file.type)) {
		throw new Error("Format non supporté. Seulement PNG ou JPEG.");
	}

	if (file.size > 2 * 1024 * 1024) {
		throw new Error("Fichier trop gros (>2MB).");
	}

	const compressed = await imageCompression(file, {
		maxSizeMB: 1,
		maxWidthOrHeight: 256,
		useWebWorker: true,
	});

	return await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === "string") resolve(reader.result);
			else reject(new Error("Échec de la compression de l'image."));
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(compressed);
	});
}
