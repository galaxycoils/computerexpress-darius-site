import { useState, useEffect, useRef } from 'react'

function useCountUp(target, suffix = '', prefix = '', duration = 2000) {
  const [value, setValue] = useState(target) // Start at target, animate down then up
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check if already in viewport on mount
    const rect = el.getBoundingClientRect()
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0

    if (inViewport) {
      // Already visible — animate immediately
      hasAnimated.current = true
      setValue(0)
      const start = performance.now()
      const to = target
      const step = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setValue(Math.round(to * eased))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    } else {
      // Not visible — wait for scroll
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            setValue(0)
            const start = performance.now()
            const to = target
            const step = (now) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
              setValue(Math.round(to * eased))
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
            obs.unobserve(el)
          }
        },
        { threshold: 0.1 }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }
  }, [target, duration])

  return { value, ref }
}

export default function AnimatedCounter({ value, suffix = '', prefix = '', label }) {
  const match = value.match(/^(\d+)(.*)$/)
  const isNumeric = !!match
  const numValue = isNumeric ? parseInt(match[1], 10) : 0
  const extractedSuffix = isNumeric ? match[2] : ''
  const { value: animatedValue, ref } = useCountUp(numValue)

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-value">
        {prefix}{isNumeric ? animatedValue : value}{isNumeric ? (extractedSuffix || suffix) : ''}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
