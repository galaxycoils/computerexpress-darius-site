import { useEffect, useRef } from 'react'

/**
 * IntersectionObserver hook that adds 'visible' class when element enters viewport.
 * Usage: const ref = useInView(); return <div ref={ref} className="animate-on-scroll">
 */
export function useInView(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return ref
}

/**
 * Wrapper component that animates children on scroll into view.
 * Usage: <AnimatedSection><YourContent /></AnimatedSection>
 */
export default function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useInView()
  return (
    <div ref={ref} className={`animate-on-scroll ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
