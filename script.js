/**
 * SAUDI IDENTITY & BUSINESS - HIGH FIDELITY INTERACTION & ANIMATION ENGINE
 * 
 * Enterprise Architecture ported from Reference Project (Testing UI2):
 * 1. Layered Hero Lifecycle Management:
 *    - IntersectionObserver: Automatically halts rendering when scrolled off-screen.
 *    - Page Visibility API: Halts animation frames and particle updates when tab is hidden.
 *    - Delta-time calculation: Refresh-rate independent animation (60Hz / 120Hz / 144Hz).
 *    - ResizeObserver with cached dimensions: Zero layout thrashing, DPR capping (max 2x).
 * 
 * 2. Particles.js Integration (Vincent Garreau):
 *    - Coordinated lifecycle with hero visibility to eliminate CPU waste.
 *    - Mobile-adaptive density scaling.
 *    - Clean idempotent initialization without duplicate canvas elements.
 * 
 * 3. Hejazi Golden Silk Ribbons & Orbital Satellite Flares:
 *    - Zero-allocation render loop: Precomputed color lookup tables (LUT) for 180 strands.
 *    - Hardware-accelerated GPU alpha compositing.
 *    - Passive pointer interaction with smooth spring interpolation.
 *    - Adaptive fidelity scaling for mobile & tablet screens.
 * 
 * 4. Accessibility & Reduced Motion:
 *    - Immediate detection of prefers-reduced-motion with dynamic change listener.
 *    - Static high-definition rendering fallback when reduced motion is preferred.
 */

(function () {
  'use strict';

  // Guard for server-side rendering / non-browser environments
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  /* ==========================================================================
     0. ENVIRONMENT & ACCESSIBILITY TOKENS
     ========================================================================== */
  const requestAnimFrame = (typeof window !== 'undefined' && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame))
    || function (cb) { return setTimeout(cb, 16); };

  const cancelAnimFrame = (typeof window !== 'undefined' && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame))
    || function (id) { clearTimeout(id); };

  const motionQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let prefersReducedMotion = motionQuery ? motionQuery.matches : false;

  motionQuery.addEventListener?.('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      engine.pause();
      engine.renderStaticFrame();
    } else {
      engine.resume();
    }
  });

  /* ==========================================================================
     1. PRECOMPUTED LOOKUP TABLES (ZERO-ALLOCATION RENDER LOOP)
     Eliminates 10,000+ template string allocations and .toFixed() calls per second.
     ========================================================================== */
  const STRANDS_LEFT = 48;
  const RIBBON_1_LUT = new Array(STRANDS_LEFT);
  for (let i = 0; i < STRANDS_LEFT; i++) {
    const u = i / (STRANDS_LEFT - 1);
    const alpha = (0.12 + Math.sin(u * Math.PI) * 0.32).toFixed(3);
    RIBBON_1_LUT[i] = {
      u,
      style: `rgba(243, 184, 68, ${alpha})`
    };
  }

  const STRANDS_LEFT_UPPER = 28;
  const RIBBON_2_LUT = new Array(STRANDS_LEFT_UPPER);
  for (let i = 0; i < STRANDS_LEFT_UPPER; i++) {
    const u = i / (STRANDS_LEFT_UPPER - 1);
    const alpha = (0.08 + Math.sin(u * Math.PI) * 0.22).toFixed(3);
    RIBBON_2_LUT[i] = {
      u,
      style: `rgba(230, 183, 92, ${alpha})`
    };
  }

  const STRANDS_RIGHT = 68;
  const RIBBON_3_LUT = new Array(STRANDS_RIGHT);
  for (let i = 0; i < STRANDS_RIGHT; i++) {
    const u = i / (STRANDS_RIGHT - 1);
    const highlight = Math.pow(Math.sin(u * Math.PI), 1.8);
    const alpha = (0.10 + highlight * 0.42).toFixed(3);
    RIBBON_3_LUT[i] = {
      u,
      style: i % 4 === 0
        ? `rgba(255, 230, 160, ${alpha})`
        : `rgba(243, 184, 68, ${alpha})`
    };
  }

  const STRANDS_VORTEX_INNER = 36;
  const RIBBON_4_LUT = new Array(STRANDS_VORTEX_INNER);
  for (let i = 0; i < STRANDS_VORTEX_INNER; i++) {
    const u = i / (STRANDS_VORTEX_INNER - 1);
    const alpha = (0.08 + Math.sin(u * Math.PI) * 0.28).toFixed(3);
    RIBBON_4_LUT[i] = {
      u,
      style: `rgba(243, 184, 68, ${alpha})`
    };
  }

  /* ==========================================================================
     2. PARTICLES.JS COORDINATION & LIFECYCLE
     ========================================================================== */
  function initParticlesJS() {
    const container = document.getElementById('particles-js');
    if (!container || typeof window.particlesJS !== 'function') return;

    // Idempotent cleanup: prevent duplicate canvases and memory leaks
    if (window.pJSDom && window.pJSDom.length > 0) {
      for (let i = window.pJSDom.length - 1; i >= 0; i--) {
        if (window.pJSDom[i] && window.pJSDom[i].pJS) {
          try {
            cancelAnimFrame(window.pJSDom[i].pJS.fn.drawAnimFrame);
          } catch (e) {}
        }
      }
      window.pJSDom = [];
      const oldCanvas = container.querySelector('canvas');
      if (oldCanvas) oldCanvas.remove();
    }

    const width = window.innerWidth;
    let particleCount = 45;
    let valueArea = 900;

    if (width < 768) {
      // Mobile: around 20–25 particles
      particleCount = 22;
      valueArea = 950;
    } else if (width <= 1024) {
      // Tablet: around 30–35 particles
      particleCount = 32;
      valueArea = 900;
    } else {
      // Desktop: around 45 particles
      particleCount = 45;
      valueArea = 900;
    }

    const isMobile = width < 768;
    const moveSpeed = prefersReducedMotion ? 0.6 : 6;
    const enableHover = !prefersReducedMotion && !isMobile;

    window.particlesJS('particles-js', {
      particles: {
        number: {
          value: particleCount,
          density: {
            enable: true,
            value_area: valueArea
          }
        },
        color: {
          value: '#f2dc00'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: './img/github.svg',
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 30,
            size_min: 0.8102611471677327,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: isMobile ? 120 : 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: !prefersReducedMotion,
          speed: moveSpeed,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: enableHover,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });
  }

  function pauseParticles() {
    if (window.pJSDom && window.pJSDom.length > 0) {
      for (let i = 0; i < window.pJSDom.length; i++) {
        const pJS = window.pJSDom[i]?.pJS;
        if (pJS?.fn?.drawAnimFrame) {
          cancelAnimFrame(pJS.fn.drawAnimFrame);
          pJS.fn.drawAnimFrame = null;
        }
      }
    }
  }

  function resumeParticles() {
    if (prefersReducedMotion) return;
    if (window.pJSDom && window.pJSDom.length > 0) {
      for (let i = 0; i < window.pJSDom.length; i++) {
        const pJS = window.pJSDom[i]?.pJS;
        if (pJS?.fn && !pJS.fn.drawAnimFrame && pJS.particles?.move?.enable) {
          pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);
        }
      }
    }
  }

  /* ==========================================================================
     3. HIGH-PERFORMANCE HERO ANIMATION ENGINE
     ========================================================================== */
  class SaudiHeroEngine {
    constructor() {
      this.hero = document.querySelector('.saudi-hero');
      this.canvas = document.getElementById('silk-canvas');
      this.mapContainer = document.querySelector('.map-container');
      this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: true }) : null;

      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.isMobile = false;

      // Animation lifecycle state
      this.animationFrameId = null;
      this.lastTimestamp = 0;
      this.accumulatedTime = 0;
      this.isVisible = true;
      this.isRunning = false;

      // Pointer parallax tracking
      this.pointer = {
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0
      };

      // Observers
      this.resizeObserver = null;
      this.intersectionObserver = null;

      // Bound methods
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerLeave = this.onPointerLeave.bind(this);
      this.onVisibilityChange = this.onVisibilityChange.bind(this);
      this.render = this.render.bind(this);
    }

    init() {
      if (!this.canvas || !this.ctx || !this.hero) return;

      this.setupObservers();
      this.setupEventListeners();
      initParticlesJS();

      if (prefersReducedMotion) {
        this.renderStaticFrame();
      } else {
        this.start();
      }
    }

    setupObservers() {
      // 1. ResizeObserver: measures cached container rect without layout thrashing
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const cr = entry.contentRect;
            if (Math.abs(cr.width - this.width) > 1 || Math.abs(cr.height - this.height) > 1) {
              this.handleResize(cr.width, cr.height);
            }
          }
        });
        this.resizeObserver.observe(this.hero);
      } else {
        // Fallback with passive RAF throttling
        let resizeTimeout = null;
        window.addEventListener('resize', () => {
          if (resizeTimeout) cancelAnimFrame(resizeTimeout);
          resizeTimeout = requestAnimFrame(() => {
            const rect = this.hero.getBoundingClientRect();
            this.handleResize(rect.width, rect.height);
          });
        }, { passive: true });
      }

      // Initial measurement
      const rect = this.hero.getBoundingClientRect();
      this.handleResize(rect.width, rect.height);

      // 2. IntersectionObserver: pause heavy animation when hero is off-screen
      if (typeof IntersectionObserver !== 'undefined') {
        this.intersectionObserver = new IntersectionObserver((entries) => {
          const entry = entries[0];
          const isIntersecting = entry ? entry.isIntersecting : true;

          if (isIntersecting !== this.isVisible) {
            this.isVisible = isIntersecting;
            if (this.isVisible) {
              this.resume();
            } else {
              this.pause();
            }
          }
        }, { threshold: 0.05 });
        this.intersectionObserver.observe(this.hero);
      }
    }

    setupEventListeners() {
      // Passive pointer tracking
      this.hero.addEventListener('pointermove', this.onPointerMove, { passive: true });
      this.hero.addEventListener('pointerleave', this.onPointerLeave, { passive: true });

      // Page Visibility API
      document.addEventListener('visibilitychange', this.onVisibilityChange);

      // Teardown on unload / pagehide
      window.addEventListener('pagehide', () => this.destroy());
      window.addEventListener('beforeunload', () => this.destroy());
    }

    handleResize(w, h) {
      if (!w || !h) return;
      this.width = w;
      this.height = h;
      this.isMobile = w < 768;

      const deviceCategory = w < 768 ? 'mobile' : (w <= 1024 ? 'tablet' : 'desktop');
      if (this.currentDeviceCategory && this.currentDeviceCategory !== deviceCategory) {
        initParticlesJS();
      }
      this.currentDeviceCategory = deviceCategory;

      // Cap DPR to 2x for optimal balance of sharpness and rendering performance
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);

      // Explicitly set scale without cumulative transform drift
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      if (prefersReducedMotion) {
        this.renderStaticFrame();
      }
    }

    onPointerMove(e) {
      if (this.isMobile || prefersReducedMotion) return;
      const rect = this.hero.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle parallax target displacement (+/- 6px)
      this.pointer.targetX = normX * 12;
      this.pointer.targetY = normY * 8;
    }

    onPointerLeave() {
      this.pointer.targetX = 0;
      this.pointer.targetY = 0;
    }

    onVisibilityChange() {
      if (document.hidden) {
        this.pause();
      } else if (this.isVisible && !prefersReducedMotion) {
        this.resume();
      }
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTimestamp = 0;
      this.animationFrameId = requestAnimFrame(this.render);
      resumeParticles();
    }

    pause() {
      if (!this.isRunning) return;
      this.isRunning = false;
      if (this.animationFrameId) {
        cancelAnimFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      pauseParticles();
    }

    resume() {
      if (document.hidden || !this.isVisible || prefersReducedMotion) return;
      this.start();
    }

    // High-performance radiant lens flare with hardware-composited alpha
    drawRadiantFlare(x, y, radius, alpha) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 3.5);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.2, 'rgba(255, 225, 140, 0.7)');
      radGrad.addColorStop(0.5, 'rgba(243, 184, 68, 0.25)');
      radGrad.addColorStop(1, 'rgba(243, 184, 68, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal ray
      ctx.fillStyle = 'rgba(255, 245, 220, 0.9)';
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 5, radius * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vertical ray
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 0.45, radius * 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Core star point
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Render Orbital Gold Rings & Flares
    drawOrbitalCurves(t) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.save();

      // Main left-to-center elliptical orbit
      ctx.beginPath();
      ctx.ellipse(w * 0.24, h * 0.52, w * 0.38, h * 0.32, -0.22, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(243, 184, 68, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Secondary upper orbital arc
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.15, w * 0.48, h * 0.4, 0.08, Math.PI * 0.65, Math.PI * 1.45);
      ctx.strokeStyle = 'rgba(243, 184, 68, 0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Satellite Flares along orbits (exact reference positions)
      const flareAlpha1 = 0.85 + Math.sin(t * 0.0018) * 0.15;
      this.drawRadiantFlare(w * 0.095, h * 0.485, 4.5, flareAlpha1);

      const flareAlpha2 = 0.7 + Math.sin(t * 0.0022 + 1) * 0.2;
      this.drawRadiantFlare(w * 0.22, h * 0.62, 3.2, flareAlpha2);

      const flareAlpha3 = 0.75 + Math.sin(t * 0.0015 + 2) * 0.2;
      this.drawRadiantFlare(w * 0.18, h * 0.21, 3.8, flareAlpha3);

      ctx.restore();
    }

    // Render Hejazi Golden Silk Ribbon Waves with Zero Allocation
    drawSilkRibbons(t) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const step = this.isMobile ? 2 : 1; // Adaptive mobile fill-rate scaling

      ctx.save();

      // Ribbon 1: Left Sweeping Ribbon
      for (let i = 0; i < STRANDS_LEFT; i += step) {
        const item = RIBBON_1_LUT[i];
        const u = item.u;
        const waveA = Math.sin(t * 0.0006 + u * 3.5) * 8;
        const waveB = Math.cos(t * 0.0008 + u * 2.8) * 6;

        const p0x = w * -0.04;
        const p0y = h * (0.38 + u * 0.22) + waveA;

        const cp1x = w * (0.12 + u * 0.05);
        const cp1y = h * (0.52 + u * 0.26) + waveB;

        const cp2x = w * (0.28 - u * 0.04);
        const cp2y = h * (0.68 - u * 0.12) - waveA;

        const p1x = w * (0.42 + u * 0.08);
        const p1y = h * (0.56 - u * 0.18) + waveB;

        ctx.strokeStyle = item.style;
        ctx.lineWidth = 0.85;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.stroke();
      }

      // Ribbon 2: Upper Left Filament Strand
      for (let i = 0; i < STRANDS_LEFT_UPPER; i += step) {
        const item = RIBBON_2_LUT[i];
        const u = item.u;
        const wave = Math.sin(t * 0.0005 + u * 4.0) * 6;

        const p0x = w * -0.02;
        const p0y = h * (0.22 + u * 0.12) + wave;

        const cp1x = w * (0.10 + u * 0.04);
        const cp1y = h * (0.34 + u * 0.15);

        const cp2x = w * (0.24 - u * 0.03);
        const cp2y = h * (0.44 - u * 0.08);

        const p1x = w * (0.36 + u * 0.06);
        const p1y = h * (0.40 - u * 0.1);

        ctx.strokeStyle = item.style;
        ctx.lineWidth = 0.75;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.stroke();
      }

      // Ribbon 3: Right Massive 3D Vortex / Spiral Loop
      for (let i = 0; i < STRANDS_RIGHT; i += step) {
        const item = RIBBON_3_LUT[i];
        const u = item.u;
        const wave1 = Math.sin(t * 0.00065 + u * 4.2) * 10;
        const wave2 = Math.cos(t * 0.00075 + u * 3.8) * 8;

        const p0x = w * (0.76 + u * 0.18);
        const p0y = h * -0.05 + wave1;

        const cp1x = w * (0.90 + u * 0.06);
        const cp1y = h * (0.18 + u * 0.25) + wave2;

        const cp2x = w * (0.98 - u * 0.08);
        const cp2y = h * (0.58 + u * 0.12) - wave1;

        const p1x = w * (0.86 - u * 0.18);
        const p1y = h * (0.78 - u * 0.15) + wave2;

        const cp3x = w * (0.74 - u * 0.14);
        const cp3y = h * (0.92 - u * 0.22);

        const cp4x = w * (0.64 + u * 0.08);
        const cp4y = h * (0.52 - u * 0.18) + wave1;

        const p2x = w * (0.70 + u * 0.16);
        const p2y = h * (0.24 + u * 0.22) - wave2;

        ctx.strokeStyle = item.style;
        ctx.lineWidth = 0.85;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, p2x, p2y);
        ctx.stroke();
      }

      // Ribbon 4: Right Inward Filament Swirl
      for (let i = 0; i < STRANDS_VORTEX_INNER; i += step) {
        const item = RIBBON_4_LUT[i];
        const u = item.u;
        const wave = Math.sin(t * 0.00055 + u * 3.0) * 7;

        const p0x = w * (0.62 + u * 0.14);
        const p0y = h * (0.28 + u * 0.18) + wave;

        const cp1x = w * (0.72 + u * 0.12);
        const cp1y = h * (0.42 + u * 0.22);

        const cp2x = w * (0.84 - u * 0.06);
        const cp2y = h * (0.72 - u * 0.12);

        const p1x = w * (0.96 + u * 0.05);
        const p1y = h * (0.45 - u * 0.15) - wave;

        ctx.strokeStyle = item.style;
        ctx.lineWidth = 0.75;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.stroke();
      }

      ctx.restore();
    }

    renderStaticFrame() {
      if (!this.ctx || !this.width || !this.height) return;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawOrbitalCurves(2000);
      this.drawSilkRibbons(2000);
    }

    render(timestamp) {
      if (!this.isRunning || document.hidden || !this.isVisible) {
        this.animationFrameId = null;
        return;
      }

      // Delta time calculation capped at 50ms (avoids temporal leaps after pause)
      if (!this.lastTimestamp) this.lastTimestamp = timestamp;
      const delta = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05);
      this.lastTimestamp = timestamp;
      this.accumulatedTime += delta * 1000;

      // Smooth pointer parallax interpolation
      if (!this.isMobile) {
        this.pointer.currentX += (this.pointer.targetX - this.pointer.currentX) * 0.06;
        this.pointer.currentY += (this.pointer.targetY - this.pointer.currentY) * 0.06;

        if (this.mapContainer && (Math.abs(this.pointer.currentX) > 0.01 || Math.abs(this.pointer.currentY) > 0.01)) {
          this.mapContainer.style.transform = `translate(calc(-50% + ${this.pointer.currentX.toFixed(2)}px), calc(-50% + ${this.pointer.currentY.toFixed(2)}px))`;
        }
      }

      // Clear Canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render layers
      this.drawOrbitalCurves(this.accumulatedTime);
      this.drawSilkRibbons(this.accumulatedTime);

      this.animationFrameId = requestAnimFrame(this.render);
    }

    destroy() {
      this.pause();
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
        this.intersectionObserver = null;
      }
      if (this.hero) {
        this.hero.removeEventListener('pointermove', this.onPointerMove);
        this.hero.removeEventListener('pointerleave', this.onPointerLeave);
      }
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  // Instantiate and launch engine
  const engine = new SaudiHeroEngine();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => engine.init());
  } else {
    engine.init();
  }

  // Expose global handle for clean debugging and testing
  window.SaudiHeroAnimationEngine = engine;

})();
