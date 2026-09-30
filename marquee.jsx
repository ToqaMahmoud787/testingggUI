import React from 'react';
import { createRoot } from 'react-dom/client';
import Marquee from 'react-fast-marquee';

/**
 * High-performance bottom marquee powered by react-fast-marquee
 * - autoFill={true}: dynamic calculation to fill viewport + seamless loop without gaps
 * - speed={35}: 35 px/sec slow, continuous, premium motion
 * - pauseOnHover={false}, pauseOnClick={false}: never stops or stutters
 */
const MarqueeTicker = () => {
  return (
    <Marquee
      autoFill={true}
      play={true}
      pauseOnHover={false}
      pauseOnClick={false}
      direction="left"
      speed={35}
      delay={0}
      loop={0}
      gradient={false}
    >
      <div className="ticker-item-set">
        <span className="ticker-word arabic">الهوية</span>
        <span className="ticker-bullet">◆</span>
        <span className="ticker-word arabic">الأعمال</span>
        <span className="ticker-bullet">◆</span>
        <span className="ticker-word arabic">التراث</span>
        <span className="ticker-bullet">◆</span>
        <span className="ticker-word arabic">الابتكار</span>
        <span className="ticker-divider">|</span>
        <span className="ticker-word">Identity</span>
        <span className="ticker-bullet">◆</span>
        <span className="ticker-word">Business</span>
        <span className="ticker-bullet">◆</span>
        <span className="ticker-word">Heritage</span>
        <span className="ticker-bullet">◆</span>
        <span className="ticker-word">Innovation</span>
        <span className="ticker-bullet">◆</span>
      </div>
    </Marquee>
  );
};

const mountMarquee = () => {
  const container = document.getElementById('hero-marquee-root');
  if (container) {
    const root = createRoot(container);
    root.render(<MarqueeTicker />);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMarquee);
} else {
  mountMarquee();
}
