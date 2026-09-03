import '@testing-library/jest-dom'

// jsdom lacks matchMedia and IntersectionObserver; provide no-op polyfills
// so useInView and scroll effects do not crash during test renders.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
  }

  if (!window.IntersectionObserver) {
    const observers = []
    window.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback
        observers.push(this)
      }
      observe() {
        // Notify immediately: element is "intersecting" so hooks add their class.
        this.callback([{ isIntersecting: true, target: {} }])
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
  }
}
