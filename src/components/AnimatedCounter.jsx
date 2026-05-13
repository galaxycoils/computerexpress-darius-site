import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number from 0 to target when the element scrolls into view.
 * suffix is appended after the number (e.g. "+", "x", "h")
 * prefix is prepended (e.g. "$", "#")
 */
function useCountUp(target, suffix = '', prefix = '', duration = 2000) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const from = 0
          const to = target
          const step = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setValue(Math.round(from + (to - from) * eased))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          obs.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { value, ref }
}

export default function AnimatedCounter({ value, suffix = '', prefix = '', label }) {
  // Extract leading numeric portion and trailing non-numeric suffix
  const match = value.match(/^(\d+)(.*)$/)
  const isNumeric = !!match
  const numValue = isNumeric ? parseInt(match[1], 10) : 0
  const extractedSuffix = isNumeric ? match[2] : value
  const { value: animatedValue, ref } = useCountUp(numValue)

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-value">
        {prefix}{isNumeric ? animatedValue : value}{extractedSuffix || suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
