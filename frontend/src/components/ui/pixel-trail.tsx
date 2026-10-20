"use client"
import { useEffect, useRef, useCallback } from "react"

/**
 * PixelCursorTrail — canvas-based pixel trail that follows the mouse.
 *
 * Key design decisions vs. the original DOM-div approach:
 *   1. Uses a <canvas> instead of hundreds of React-managed <div>s.
 *      This avoids React reconciliation overhead and keeps 60 fps.
 *   2. The canvas has `pointer-events: none` so every button, link,
 *      and input underneath remains fully interactive.
 *   3. Listens on `window` for mousemove so it tracks globally —
 *      no need for the canvas to intercept events.
 *   4. The cursor is NEVER hidden (no cursor-none).
 */

interface Pixel {
  x: number
  y: number
  opacity: number
  age: number
  size: number
}

const PIXEL_COLOR = "#000000"
const PIXEL_SIZE = 10
const TRAIL_LENGTH = 40
const FADE_SPEED = 0.025
const MIN_DISTANCE = 10

export function PixelCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const lastPosRef = useRef({ x: -100, y: -100 })
  const animFrameRef = useRef<number>(0)
  const isActiveRef = useRef(false)

  // Resize canvas to fill the viewport
  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener("resize", resize, { passive: true })
    return () => window.removeEventListener("resize", resize)
  }, [resize])

  // Global mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e
      const dx = x - lastPosRef.current.x
      const dy = y - lastPosRef.current.y
      if (Math.sqrt(dx * dx + dy * dy) >= MIN_DISTANCE) {
        pixelsRef.current.push({ x, y, opacity: 1, age: 0, size: PIXEL_SIZE })
        if (pixelsRef.current.length > TRAIL_LENGTH) {
          pixelsRef.current = pixelsRef.current.slice(-TRAIL_LENGTH)
        }
        lastPosRef.current = { x, y }
      }
      if (!isActiveRef.current) {
        isActiveRef.current = true
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // Animation loop — pure canvas, no React state updates
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const pixels = pixelsRef.current
      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i]
        p.opacity -= FADE_SPEED
        p.age += 1

        if (p.opacity <= 0) {
          pixels.splice(i, 1)
          continue
        }

        const scale = Math.max(0.25, 1 - p.age / 80)
        const sz = p.size * scale
        const half = sz / 2

        ctx.globalAlpha = p.opacity
        ctx.fillStyle = PIXEL_COLOR
        ctx.fillRect(p.x - half, p.y - half, sz, sz)
      }
      ctx.globalAlpha = 1

      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  )
}

export default PixelCursorTrail
