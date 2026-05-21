import { useState, useRef, useEffect } from 'react'

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef(null)

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value))
  }

  return (
    <div className="ba-slider-container" ref={containerRef}>
      <div className="ba-slider-label ba-slider-label-before">BEFORE</div>
      <div className="ba-slider-label ba-slider-label-after">AFTER (St. Catharines Digital)</div>
      
      {/* Before Image (Background) */}
      <img 
        src="/before-redesign.png" 
        alt="Outdated website design before optimization" 
        className="ba-slider-image ba-slider-image-before"
        loading="lazy"
      />
      
      {/* After Image (Foreground, Clipped) */}
      <div 
        className="ba-slider-after-container" 
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img 
          src="/after-redesign.png" 
          alt="Premium, fast website design by St. Catharines Digital" 
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
      
      {/* Real range input overlay for accessibility and perfect drag/touch support */}
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
  )
}
