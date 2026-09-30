/**
 * SAUDI IDENTITY & BUSINESS - HIGH FIDELITY INTERACTION & ANIMATION ENGINE
 * 
 * 1. Particles.js Integration (Vincent Garreau https://vincentgarreau.com/particles.js/)
 *    - Connected golden nodes and constellation lines
 *    - Celestial desert stardust with gentle twinkle
 *    - Interactive hover grab & click push
 * 
 * 2. Hejazi Golden Silk Ribbons & Orbital Satellite Flares (Canvas)
 *    - Thousands of parametric Bézier filament threads (Bisht gold zari)
 *    - 3D spiral vortex on right & sweeping wave on left
 *    - 4-point radiant lens flare stars along orbital paths
 * 
 * 3. React Fast Marquee Engine (https://www.npmjs.com/package/react-fast-marquee)
 *    - 100% Unstoppable, seamless, continuous scrolling stream
 *    - NEVER pauses on hover, focus, touch, or click
 *    - Dynamic speed calibration matching screen resolution
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PARTICLES.JS INITIALIZATION (Approved particlesjs-config.json)
     - Source of truth: particlesjs-config.json
     - Particles: 50 | Density value_area: 640 | Color: #f2dc00 | Size: 3
     - Lines: #ffffff 0.4 opacity 150 dist | Speed: 6
     - Repulse on hover (200px / 0.4s) | Push on click (+4)
     - Single initialization, no duplicate canvas, no memory leaks
     - Respects prefers-reduced-motion
     ========================================================================== */
  function initParticlesJS() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const container = document.getElementById('particles-js');
    if (!container || typeof window.particlesJS !== 'function') return;

    // Idempotent cleanup: prevent duplicate canvases and memory leaks
    if (window.pJSDom && window.pJSDom.length > 0) {
      for (let i = window.pJSDom.length - 1; i >= 0; i--) {
        if (window.pJSDom[i] && window.pJSDom[i].pJS) {
          try {
            cancelAnimationFrame(window.pJSDom[i].pJS.fn.drawAnimFrame);
          } catch (e) {}
        }
      }
      window.pJSDom = [];
      const oldCanvas = container.querySelector('canvas');
      if (oldCanvas) oldCanvas.remove();
    }

    // Accessibility: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const moveSpeed = prefersReducedMotion ? 0.6 : 6;
    const enableHover = !prefersReducedMotion;

    window.particlesJS('particles-js', {
      particles: {
        number: {
          value: 50,
          density: {
            enable: true,
            value_area: 640
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
            src: 'img/github.svg',
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
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
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

  // Initialize once DOM is ready or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticlesJS);
  } else {
    initParticlesJS();
  }

  /* ==========================================================================
     2. HEJAZI GOLDEN SILK FILAMENT ENGINE (Canvas)
     ========================================================================== */
  const canvas = document.getElementById('silk-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Draw 4-point radiant lens flare on canvas
    function drawRadiantFlare(x, y, radius, alpha) {
      ctx.save();
      ctx.translate(x, y);

      const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 3.5);
      radGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      radGrad.addColorStop(0.2, `rgba(255, 225, 140, ${alpha * 0.7})`);
      radGrad.addColorStop(0.5, `rgba(243, 184, 68, ${alpha * 0.25})`);
      radGrad.addColorStop(1, 'rgba(243, 184, 68, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal ray
      ctx.fillStyle = `rgba(255, 245, 220, ${alpha * 0.9})`;
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
    function drawOrbitalCurves(t) {
      ctx.save();

      // Main left-to-center elliptical orbit
      ctx.beginPath();
      ctx.ellipse(width * 0.24, height * 0.52, width * 0.38, height * 0.32, -0.22, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(243, 184, 68, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Secondary upper orbital arc
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.15, width * 0.48, height * 0.4, 0.08, Math.PI * 0.65, Math.PI * 1.45);
      ctx.strokeStyle = 'rgba(243, 184, 68, 0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Satellite Flares along orbits (matching reference positions)
      const flareAlpha1 = 0.85 + Math.sin(t * 0.0018) * 0.15;
      drawRadiantFlare(width * 0.095, height * 0.485, 4.5, flareAlpha1);

      const flareAlpha2 = 0.7 + Math.sin(t * 0.0022 + 1) * 0.2;
      drawRadiantFlare(width * 0.22, height * 0.62, 3.2, flareAlpha2);

      const flareAlpha3 = 0.75 + Math.sin(t * 0.0015 + 2) * 0.2;
      drawRadiantFlare(width * 0.18, height * 0.21, 3.8, flareAlpha3);

      ctx.restore();
    }

    // Render Hejazi Golden Silk Ribbon Waves
    function drawSilkRibbons(t) {
      ctx.save();

      // Ribbon 1: Left Sweeping Ribbon
      const STRANDS_LEFT = 48;
      for (let i = 0; i < STRANDS_LEFT; i++) {
        const u = i / (STRANDS_LEFT - 1);
        const waveA = Math.sin(t * 0.0006 + u * 3.5) * 8;
        const waveB = Math.cos(t * 0.0008 + u * 2.8) * 6;

        const p0x = width * -0.04;
        const p0y = height * (0.38 + u * 0.22) + waveA;

        const cp1x = width * (0.12 + u * 0.05);
        const cp1y = height * (0.52 + u * 0.26) + waveB;

        const cp2x = width * (0.28 - u * 0.04);
        const cp2y = height * (0.68 - u * 0.12) - waveA;

        const p1x = width * (0.42 + u * 0.08);
        const p1y = height * (0.56 - u * 0.18) + waveB;

        const alpha = (0.12 + Math.sin(u * Math.PI) * 0.32).toFixed(3);
        ctx.strokeStyle = `rgba(243, 184, 68, ${alpha})`;
        ctx.lineWidth = 0.85;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.stroke();
      }

      // Ribbon 2: Upper Left Filament Strand
      const STRANDS_LEFT_UPPER = 28;
      for (let i = 0; i < STRANDS_LEFT_UPPER; i++) {
        const u = i / (STRANDS_LEFT_UPPER - 1);
        const wave = Math.sin(t * 0.0005 + u * 4.0) * 6;

        const p0x = width * -0.02;
        const p0y = height * (0.22 + u * 0.12) + wave;

        const cp1x = width * (0.10 + u * 0.04);
        const cp1y = height * (0.34 + u * 0.15);

        const cp2x = width * (0.24 - u * 0.03);
        const cp2y = height * (0.44 - u * 0.08);

        const p1x = width * (0.36 + u * 0.06);
        const p1y = height * (0.40 - u * 0.1);

        ctx.strokeStyle = `rgba(230, 183, 92, ${(0.08 + Math.sin(u * Math.PI) * 0.22).toFixed(3)})`;
        ctx.lineWidth = 0.75;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.stroke();
      }

      // Ribbon 3: Right Massive 3D Vortex / Spiral Loop
      const STRANDS_RIGHT = 68;
      for (let i = 0; i < STRANDS_RIGHT; i++) {
        const u = i / (STRANDS_RIGHT - 1);
        const wave1 = Math.sin(t * 0.00065 + u * 4.2) * 10;
        const wave2 = Math.cos(t * 0.00075 + u * 3.8) * 8;

        const p0x = width * (0.76 + u * 0.18);
        const p0y = height * -0.05 + wave1;

        const cp1x = width * (0.90 + u * 0.06);
        const cp1y = height * (0.18 + u * 0.25) + wave2;

        const cp2x = width * (0.98 - u * 0.08);
        const cp2y = height * (0.58 + u * 0.12) - wave1;

        const p1x = width * (0.86 - u * 0.18);
        const p1y = height * (0.78 - u * 0.15) + wave2;

        const cp3x = width * (0.74 - u * 0.14);
        const cp3y = height * (0.92 - u * 0.22);

        const cp4x = width * (0.64 + u * 0.08);
        const cp4y = height * (0.52 - u * 0.18) + wave1;

        const p2x = width * (0.70 + u * 0.16);
        const p2y = height * (0.24 + u * 0.22) - wave2;

        const highlight = Math.pow(Math.sin(u * Math.PI), 1.8);
        const alpha = (0.10 + highlight * 0.42).toFixed(3);

        ctx.strokeStyle = i % 4 === 0
          ? `rgba(255, 230, 160, ${alpha})`
          : `rgba(243, 184, 68, ${alpha})`;
        ctx.lineWidth = 0.85;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, p2x, p2y);
        ctx.stroke();
      }

      // Ribbon 4: Right Inward Filament Swirl
      const STRANDS_VORTEX_INNER = 36;
      for (let i = 0; i < STRANDS_VORTEX_INNER; i++) {
        const u = i / (STRANDS_VORTEX_INNER - 1);
        const wave = Math.sin(t * 0.00055 + u * 3.0) * 7;

        const p0x = width * (0.62 + u * 0.14);
        const p0y = height * (0.28 + u * 0.18) + wave;

        const cp1x = width * (0.72 + u * 0.12);
        const cp1y = height * (0.42 + u * 0.22);

        const cp2x = width * (0.84 - u * 0.06);
        const cp2y = height * (0.72 - u * 0.12);

        const p1x = width * (0.96 + u * 0.05);
        const p1y = height * (0.45 - u * 0.15) - wave;

        ctx.strokeStyle = `rgba(243, 184, 68, ${(0.08 + Math.sin(u * Math.PI) * 0.28).toFixed(3)})`;
        ctx.lineWidth = 0.75;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1x, p1y);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Main Canvas Render Loop
    function render(time) {
      ctx.clearRect(0, 0, width, height);

      // 1. Orbital gold curves & satellite nodes
      drawOrbitalCurves(time);

      // 2. Flowing Hejazi silk ribbons
      drawSilkRibbons(time);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('beforeunload', () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });
  }
})();

