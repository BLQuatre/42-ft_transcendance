"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useDictionary } from "@/hooks/UseDictionnary"

export default function NotFound() {
  const dict = useDictionary()
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [velocity, setVelocity] = useState({ x: 2, y: 2 })
  const [color, setColor] = useState("#ffffff")

  // Generate random color
  const getRandomColor = () => {
    const colors = [
      "#FF5252", // red
      "#4CAF50", // green
      "#2196F3", // blue
      "#FFC107", // yellow
      "#9C27B0", // purple
      "#FF9800", // orange
      "#00BCD4", // cyan
      "#E91E63", // pink
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  useEffect(() => {
    if (!dict) return // Move the check inside the effect

    const container = containerRef.current
    const text = textRef.current

    if (!container || !text) return

    let animationFrameId: number

    const updatePosition = () => {
      setPosition((prevPosition) => {
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const textWidth = text.clientWidth
        const textHeight = text.clientHeight

        const newX = prevPosition.x + velocity.x
        const newY = prevPosition.y + velocity.y
        let newVelocityX = velocity.x
        let newVelocityY = velocity.y
        let colorChanged = false

        // Check for horizontal bounds
        if (newX <= 0 || newX + textWidth >= containerWidth) {
          newVelocityX = -velocity.x
          colorChanged = true
        }

        // Check for vertical bounds
        if (newY <= 0 || newY + textHeight >= containerHeight) {
          newVelocityY = -velocity.y
          colorChanged = true
        }

        // Update velocity if needed
        if (newVelocityX !== velocity.x || newVelocityY !== velocity.y) {
          setVelocity({ x: newVelocityX, y: newVelocityY })
        }

        // Change color on bounce
        if (colorChanged) {
          setColor(getRandomColor())
        }

        return {
          x: newX <= 0 ? 0 : newX + textWidth >= containerWidth ? containerWidth - textWidth : newX,
          y: newY <= 0 ? 0 : newY + textHeight >= containerHeight ? containerHeight - textHeight : newY,
        }
      })

      animationFrameId = requestAnimationFrame(updatePosition)
    }

    animationFrameId = requestAnimationFrame(updatePosition)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [velocity, dict])

  // Conditional rendering instead of early return
  if (!dict) {
    return <div className="fixed inset-0 bg-black"></div>
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        ref={textRef}
        className="absolute font-bold whitespace-nowrap transition-colors duration-300 ease-in-out font-pixel text-center"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          color: color,
          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="text-[clamp(2.5rem,8vw,5rem)]">404</div>
        <div className="text-[clamp(1rem,2vw,1.5rem)]">{dict.notFound.title}</div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 text-center">
        <Link href="/" className="text-white hover:text-gray-300 underline transition-colors font-pixel">
          {dict.notFound.backToHome}
        </Link>
      </div>
    </div>
  )
}
