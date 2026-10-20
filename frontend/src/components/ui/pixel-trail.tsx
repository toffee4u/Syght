"use client"
import React, { useEffect, useRef, useState, useCallback } from "react"

interface Pixel {
  id: number
  x: number
  y: number
  opacity: number
  age: number
  color?: string
}

interface PixelCursorTrailProps {
  colors?: string[]
  pixelSize?: number
  trailLength?: number
  fadeSpeed?: number
  cursorVisible?: boolean
  className?: string
  showText?: boolean
}

const DEFAULT_COLORS = ["#863bff", "#0284c7", "#38bdf8", "#a855f7", "#64748b"]
const DEFAULT_PIXEL_SIZE = 10
const DEFAULT_TRAIL_LENGTH = 36
const DEFAULT_FADE_SPEED = 0.035

export function PixelCursorTrail({
  colors = DEFAULT_COLORS,
  pixelSize = DEFAULT_PIXEL_SIZE,
  trailLength = DEFAULT_TRAIL_LENGTH,
  fadeSpeed = DEFAULT_FADE_SPEED,
  cursorVisible = true,
  className = "",
  showText = false,
}: PixelCursorTrailProps) {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const pixelIdRef = useRef(0)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)

  const createPixel = useCallback((x: number, y: number) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    return {
      id: pixelIdRef.current++,
      x,
      y,
      opacity: 1,
      age: 0,
      color: randomColor,
    }
  }, [colors])

  // Track mouse globally across the window so pointer-events-none doesn't block cursor trail
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY

      const dx = x - lastPositionRef.current.x
      const dy = y - lastPositionRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > pixelSize) {
        const newPixel = createPixel(x, y)
        setPixels((prev) => [...prev.slice(-trailLength), newPixel])
        lastPositionRef.current = { x, y }
      }
    }

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
    }
  }, [createPixel, pixelSize, trailLength])

  useEffect(() => {
    const animate = () => {
      setPixels((prev) =>
        prev
          .map((pixel) => ({
            ...pixel,
            opacity: pixel.opacity - fadeSpeed,
            age: pixel.age + 1,
          }))
          .filter((pixel) => pixel.opacity > 0),
      )
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [fadeSpeed])

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none select-none z-[9999] ${
        cursorVisible ? "" : "cursor-none"
      } ${className}`}
      style={{ pointerEvents: "none" }}
    >
      {pixels.map((pixel) => {
        // Calculate size based on age - older pixels are smaller
        const sizeMultiplier = Math.max(0.25, 1 - pixel.age / 80)
        const currentSize = pixelSize * sizeMultiplier

        return (
          <div
            key={pixel.id}
            className="absolute pointer-events-none"
            style={{
              left: pixel.x - currentSize / 2,
              top: pixel.y - currentSize / 2,
              width: currentSize,
              height: currentSize,
              backgroundColor: pixel.color || "#863bff",
              borderRadius: "2px",
              boxShadow: `0 0 8px ${pixel.color || "#863bff"}66`,
              opacity: pixel.opacity,
              transition: "width 0.1s ease-out, height 0.1s ease-out",
              willChange: "transform, opacity",
            }}
          />
        )
      })}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-foreground/20">
            Move cursor
          </span>
        </div>
      )}
    </div>
  )
}

export default PixelCursorTrail
