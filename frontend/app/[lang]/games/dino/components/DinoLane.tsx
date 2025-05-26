// components/DinoLane.tsx
"use client";

import { useEffect, useRef } from "react";

type Obstacle = {
	x: number;
	y: number;
	type: number;
};

type Dino = {
	y: number;
	lean: boolean;
	score: number;
};

interface DinoLaneProps {
	dino: Dino;
	obstacles: Obstacle[];
	images: any;
	frame: number;
}

const TYPE_CACTUS = 1;
const TYPE_SMALL = 2;
const TYPE_GROUP = 3;
const TYPE_PTERO = 4;

export default function DinoLane({
	dino,
	obstacles,
	images,
	frame,
}: DinoLaneProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !dino) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw ground line
			ctx.fillStyle = "#555";
			ctx.fillRect(20, canvas.height - 6, canvas.width - 40, 2);

			// Draw dino
			if (frame === -1) {
				const img = images.dinoStanding;
				if (img.complete)
					ctx.drawImage(img, 40, canvas.height - 48 - dino.y, 48, 48);
			} else if (dino.lean) {
				const img = frame % 2 === 0 ? images.dinoLean1 : images.dinoLean2;
				if (img.complete)
					ctx.drawImage(img, 40, canvas.height - 48 - dino.y, 64, 48);
			} else {
				const img =
					dino.y > 0
						? images.dinoStanding
						: frame % 2 === 0
							? images.dinoRun1
							: images.dinoRun2;
				if (img.complete)
					ctx.drawImage(img, 40, canvas.height - 48 - dino.y, 48, 48);
			}

			// Draw obstacles
			for (const ob of obstacles) {
				const y = canvas.height - ob.y;
				if (ob.type === TYPE_CACTUS && images.cactus.complete)
					ctx.drawImage(images.cactus, ob.x, y, 32, 48);
				else if (ob.type === TYPE_SMALL && images.small.complete)
					ctx.drawImage(images.small, ob.x, y, 16, 32);
				else if (ob.type === TYPE_GROUP && images.group.complete)
					ctx.drawImage(images.group, ob.x, y, 48, 48);
				else if (ob.type === TYPE_PTERO) {
					const img = frame % 2 === 0 ? images.ptero1 : images.ptero2;
					if (img.complete) ctx.drawImage(img, ob.x, y, 48, 48);
				}
			}

			if (frame === -1) {
				ctx.font = '16px "Press Start 2P"';
				ctx.fillText(`${dino.score}`, canvas.width - 100, 50, 100);
			}
		};

		draw();
	}, [dino, obstacles, images, frame]);

	return (
		<canvas
			ref={canvasRef}
			width={800}
			height={100}
			className="w-full bg-game-dark pixel-border"
		/>
	);
}
