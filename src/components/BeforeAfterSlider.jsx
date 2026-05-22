import { useState, useRef } from 'react'

const slides = [
  {
    id: 'plumbing',
    title: 'Plumbing',
    beforeImage: '/before-redesign.webp',
    afterImage: '/after-redesign.webp',
    beforeAlt: 'Outdated plumbing website design before optimization',
    afterAlt: 'Premium dark plumbing website design by St. Catharines Digital'
  },
  {
    id: 'hvac',
    title: 'HVAC',
    beforeImage: '/images/before_hvac.webp',
    afterImage: '/images/after_hvac.webp',
    beforeAlt: 'Outdated HVAC website design before optimization',
    afterAlt: 'Premium modern dark HVAC website design by St. Catharines Digital'
  },
  {
    id: 'legal',
    title: 'Family Law',
    beforeImage: '/images/before_legal.webp',
    afterImage: '/images/after_legal.webp',
    beforeAlt: 'Outdated family law website design before optimization',
    afterAlt: 'Premium minimalist dark law website design by St. Catharines Digital'
  }
]

export default function BeforeAfterSlider() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef(null)

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value))
  }

  const currentSlide = slides[activeSlideIndex]

  return (
    <div className="ba-slider-wrapper">
      <div className="ba-slider-tabs">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`ba-slider-tab-btn ${activeSlideIndex === index ? 'active' : ''}`}
            onClick={() => {
              setActiveSlideIndex(index)
              setSliderPosition(50)
            }}
          >
            {slide.title}
          </button>
        ))}
      </div>
      
      <div className="ba-slider-container" ref={containerRef}>
        {/* Before Image (Right Side, Clipped from sliderPosition to 100%) */}
        <div 
          className="ba-slider-before-container" 
          style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
        >
          <div className="ba-slider-label ba-slider-label-before">BEFORE</div>
          <img 
            src={currentSlide.beforeImage} 
            alt={currentSlide.beforeAlt} 
            className="ba-slider-image ba-slider-image-before"
            loading="lazy"
          />
        </div>
        
        {/* After Image (Left Side, Clipped from 0 to sliderPosition) */}
        <div 
          className="ba-slider-after-container" 
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <div className="ba-slider-label ba-slider-label-after">AFTER (St. Catharines Digital)</div>
          <img 
            src={currentSlide.afterImage} 
            alt={currentSlide.afterAlt} 
            className="ba-slider-image ba-slider-image-after"
            loading="lazy"
          />
        </div>
        
        {/* Visual divider line and handle */}
        <div 
          className="ba-slider-divider" 
          style={{ left: `${sliderPosition}%` }}
          aria-hidden="true"
        >
          <div className="ba-slider-handle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8 17 3 12 8 7" />
              <polyline points="16 17 21 12 16 7" />
            </svg>
          </div>
        </div>
        
        {/* Real range input overlay for accessibility and drag support */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPosition} 
          onChange={handleSliderChange} 
          className="ba-slider-range-input"
          aria-label="Before and after website design comparison slider"
        />
      </div>
    </div>
  )
}
