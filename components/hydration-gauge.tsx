import React, { useRef, useEffect, useState } from "react"

interface HydrationGaugeProps {
  hydrationLevel: number // percent, 0-100
  activeHydration: number // L, 0-1
  size?: number // px
}

export const HydrationGauge: React.FC<HydrationGaugeProps> = ({ hydrationLevel, activeHydration, size = 360 }) => {
  const [wavePhase, setWavePhase] = useState(0)
  const [wavePhase2, setWavePhase2] = useState(0)
  const [wavePhase3, setWavePhase3] = useState(0)
  const [bubbles, setBubbles] = useState<{x: number, r: number, speed: number, y: number}[]>([])
  const [ripple, setRipple] = useState(false)
  const [scale, setScale] = useState(1)
  const prevHydration = useRef(hydrationLevel)
  const requestRef = useRef<number>(0)

  // Animate waves horizontally, slower and with different speeds
  useEffect(() => {
    const animate = () => {
      setWavePhase((prev) => prev + 0.012)
      setWavePhase2((prev) => prev + 0.008)
      setWavePhase3((prev) => prev + 0.005)
      setBubbles((prev) => prev.map(b => ({...b, y: b.y - b.speed})).filter(b => b.y + b.r > 0))
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Add new bubbles randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.7) {
        setBubbles(prev => [
          ...prev,
          {
            x: Math.random() * (size - 80) + 40,
            r: Math.random() * 8 + 4,
            speed: Math.random() * 0.7 + 0.3,
            y: size - 40
          }
        ])
      }
    }, 600)
    return () => clearInterval(interval)
  }, [size])

  // Ripple and scale animation on hydrationLevel increase
  useEffect(() => {
    if (hydrationLevel > prevHydration.current) {
      setRipple(true)
      setScale(1.08)
      setTimeout(() => setRipple(false), 600)
      setTimeout(() => setScale(1), 400)
    }
    prevHydration.current = hydrationLevel
  }, [hydrationLevel])

  // SVG dimensions
  const radius = size / 2 - 18
  const center = size / 2
  const border = 14
  const waveHeight = 18
  const waveLength = size / 1.1
  // Water level (0 = bottom, 1 = top)
  const waterY = size - (hydrationLevel / 100) * (size - 48)

  // Calculate ring rotation speed based on hydrationLevel (faster at high hydration)
  const minSpeed = 20 // seconds (dehydrated, slowest)
  const maxSpeed = 6  // seconds (fully hydrated, fastest)
  const ringSpeed = ((minSpeed - maxSpeed) * (1 - hydrationLevel / 100)) + maxSpeed

  // Generate wave path (param: phase, amp, freq)
  const getWavePath = (phase: number, amp: number, freq: number, yOffset: number = 0) => {
    let d = `M 0 ${size}`
    for (let x = 0; x <= size; x += 2) {
      const y =
        waterY +
        Math.sin((x / waveLength) * freq * Math.PI + phase) * waveHeight * amp +
        yOffset
      d += ` L ${x} ${y}`
    }
    d += ` L ${size} ${size} Z`
    return d
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "radial-gradient(ellipse at 60% 40%, #232323 80%, #111 100%)",
        borderRadius: "50%",
        position: "relative",
        boxShadow:
          hydrationLevel < 30
            ? "0 0 16px 6px #ff6a3c33, 0 2px 16px #000a"
            : hydrationLevel > 80
            ? "0 0 10px 4px #3cff6a33, 0 2px 16px #000a"
            : "0 0 6px 2px #e6f3ffcc, 0 2px 16px #000a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        transition: "box-shadow 0.7s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)",
        transform: `scale(${scale})`,
        animation:
          hydrationLevel < 30
            ? "dehydrate-pulse 1.2s infinite alternate"
            : hydrationLevel > 80
            ? "hydrate-glow 1.8s infinite alternate"
            : undefined,
      }}
      className="hydration-gauge-hover"
    >
      <svg width={size} height={size}>
        {/* Fancy glowing gradient border */}
        <defs>
          <radialGradient id="border-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e6f3ff" stopOpacity="0.13" />
            <stop offset="80%" stopColor="#e6f3ff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.01" />
          </radialGradient>
          <linearGradient id="water-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5fdfff" />
            <stop offset="100%" stopColor="#1a7fc1" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#3cf"
          strokeOpacity={0.7}
          strokeWidth={border}
          fill="none"
          strokeDasharray="10 12"
          style={{
            transition: "stroke 0.3s cubic-bezier(.4,0,.2,1)",
            filter:
              hydrationLevel > 80
                ? "drop-shadow(0 0 6px #3cff6a33) drop-shadow(0 0 2px #3cff6a33)"
                : hydrationLevel < 30
                ? "drop-shadow(0 0 8px #ff6a3c33)"
                : "drop-shadow(0 0 3px #e6f3ffcc)",
            transformOrigin: "50% 50%",
            transformBox: "fill-box",
          }}
          className="hydration-gauge-rotating-ring"
        />
        {/* Overlay the gradient for glow/accent */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#border-glow)"
          strokeWidth={border}
          fill="none"
          strokeDasharray="10 12"
          style={{ pointerEvents: "none" }}
        />
        {/* Water fill (animated waves) */}
        <clipPath id="water-clip">
          <circle cx={center} cy={center} r={radius - 10} />
        </clipPath>
        <g clipPath="url(#water-clip)">
          {/* Main wave */}
          <path d={getWavePath(wavePhase, 1.0, 2)} fill="url(#water-gradient)" fillOpacity={0.85} />
          {/* Second wave, lighter, offset */}
          <path d={getWavePath(wavePhase2, 0.7, 2.5, 8)} fill="#fff" fillOpacity={0.10} />
          {/* Third wave, deeper blue, more offset */}
          <path d={getWavePath(wavePhase3, 0.5, 1.5, 16)} fill="#1a7fc1" fillOpacity={0.18} />
          {/* Animated bubbles */}
          {bubbles.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#fff" fillOpacity={0.18 + 0.12 * Math.random()} />
          ))}
          {/* Ripple effect on add */}
          {ripple && (
            <circle
              cx={center}
              cy={waterY}
              r={radius - 18}
              fill="none"
              stroke="#fff"
              strokeWidth={6}
              style={{
                opacity: 0.25,
                transformOrigin: `${center}px ${waterY}px`,
                animation: "ripple-anim 0.6s cubic-bezier(.4,0,.2,1)"
              }}
            />
          )}
        </g>
        {/* Center text */}
        <text x={center} y={center - 8} textAnchor="middle" fontSize={size / 7.5} fill="#fff" fontWeight="bold" style={{ filter: "drop-shadow(0 2px 8px #000b)" }}>
          {Math.round(hydrationLevel)}%
        </text>
        <text x={center} y={center + 36} textAnchor="middle" fontSize={size / 11} fill="#3cf" fontWeight="bold" style={{ filter: "drop-shadow(0 2px 8px #000b)" }}>
          {activeHydration.toFixed(2)}L
        </text>
        <style>{`
          @keyframes ripple-anim {
            0% { opacity: 0.4; stroke-width: 6; r: ${radius - 18}; }
            80% { opacity: 0.15; stroke-width: 2; r: ${radius + 10}; }
            100% { opacity: 0; stroke-width: 1; r: ${radius + 30}; }
          }
          .hydration-gauge-rotating-ring {
            animation: rotate-ring ${ringSpeed}s linear infinite;
          }
          @keyframes rotate-ring {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes dehydrate-pulse {
            0% { box-shadow: 0 0 16px 6px #ff6a3c33, 0 2px 16px #000a; }
            100% { box-shadow: 0 0 24px 10px #ff6a3c33, 0 2px 16px #000a; }
          }
          @keyframes hydrate-glow {
            0% { box-shadow: 0 0 10px 4px #3cff6a33, 0 2px 16px #000a; }
            100% { box-shadow: 0 0 18px 8px #3cff6a33, 0 2px 16px #000a; }
          }
        `}</style>
      </svg>
      <style jsx>{`
        .hydration-gauge-hover:hover {
          box-shadow: 0 0 48px 12px #3cf8, 0 2px 32px #000a;
          transform: scale(1.04);
        }
        .hydration-gauge-hover:hover svg circle {
          stroke: #6ff;
        }
      `}</style>
    </div>
  )
} 