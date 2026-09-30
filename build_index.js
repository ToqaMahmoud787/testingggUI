const fs = require('fs');

const mapSvg = fs.readFileSync('saudi-map-component.html', 'utf8');

const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saudi Identity &amp; Business | Heritage, Enterprise &amp; Vision</title>
  <meta name="description" content="Saudi Arabia Identity and Business - Heritage, enterprise, and vision shaping the future.">
  
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Montserrat:wght@300;400;500;600;700&family=Oswald:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- =========================================================================
       SAUDI IDENTITY HERO SECTION
       ========================================================================= -->
  <section class="saudi-hero" aria-label="Saudi Identity &amp; Business Hero">

    <!-- Top-Left Breadcrumb -->
    <nav class="hero-breadcrumb" aria-label="Breadcrumb">
      <a href="#" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">&gt;</span>
      <a href="#" class="breadcrumb-link">Saudi Arabia</a>
      <span class="breadcrumb-separator">&gt;</span>
      <a href="#" class="breadcrumb-link">Identity</a>
      <span class="breadcrumb-separator">&gt;</span>
      <span class="breadcrumb-active">Business</span>
    </nav>

    <!-- Left Edge Cultural Geometric Diamond Motifs -->
    <div class="left-geometric-motifs" aria-hidden="true">
      <div class="diamond diamond-1 solid-deep"></div>
      <div class="diamond diamond-2 solid"></div>
      <div class="diamond diamond-3 grid-3x3">
        <div class="mini-diamond"></div><div class="mini-diamond"></div><div class="mini-diamond"></div>
        <div class="mini-diamond"></div><div class="mini-diamond"></div><div class="mini-diamond"></div>
        <div class="mini-diamond"></div><div class="mini-diamond"></div><div class="mini-diamond"></div>
      </div>
      <div class="diamond diamond-4 solid"></div>
      <div class="diamond diamond-5"></div>
      <div class="diamond diamond-6 solid"></div>
      <div class="diamond diamond-7"></div>
    </div>

    <!-- Dynamic Canvas Layer: Golden Silk Waves & Twinkling Flares -->
    <canvas id="silk-canvas" aria-hidden="true"></canvas>

    <!-- Central Saudi Arabia Constellation Map -->
    <div class="map-container" aria-hidden="true">
${mapSvg}
    </div>

    <!-- Center Horizontal Lens Flare Light Beam -->
    <div class="horizontal-flare-beam" aria-hidden="true"></div>

    <!-- Main Content: Typography & Action Buttons -->
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="title-line">SAUDI IDENTITY</span>
        <span class="title-line">&amp; BUSINESS</span>
      </h1>

      <p class="hero-subtitle">
        Heritage, enterprise, and vision shaping the future.
      </p>

      <div class="hero-actions">
        <a href="#explore" class="btn btn-primary" id="cta-explore">
          <span>Explore opportunities</span>
          <svg class="btn-arrow" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <polyline points="14 6 20 12 14 18"></polyline>
          </svg>
        </a>

        <a href="#identity" class="btn btn-secondary" id="cta-identity">
          <span>Discover our identity</span>
          <svg class="btn-arrow" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <polyline points="14 6 20 12 14 18"></polyline>
          </svg>
        </a>
      </div>
    </div>

    <!-- Bottom Horizontal Gold Ticker Marquee -->
    <div class="bottom-ticker-bar" aria-label="Identity and Business Highlights">
      <!-- Cultural Islamic Geometric Emblem at Far Left -->
      <div class="ticker-emblem-left" aria-hidden="true">
        <svg class="ticker-emblem-svg" viewBox="0 0 100 100">
          <!-- Traditional 8-Pointed Geometric Star Medallion -->
          <polygon points="50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38" />
          <polygon points="50,18 72,28 82,50 72,72 50,82 28,72 18,50 28,28" fill="none" stroke="#ebb85c" stroke-width="4" />
          <rect x="43" y="43" width="14" height="14" transform="rotate(45 50 50)" fill="#ebb85c" />
        </svg>
      </div>

      <!-- Continuous Scrolling Track -->
      <div class="ticker-track-container">
        <div class="ticker-track">
          <!-- Group 1 -->
          <div class="ticker-group">
            <span class="ticker-word arabic">الهوية</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">الأعمال</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">التراث</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">الابتكار</span>
            <span class="ticker-divider">|</span>
            <span class="ticker-word">Identity</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Business</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Heritage</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Innovation</span>
            <span class="ticker-bullet">◆</span>
          </div>

          <!-- Group 2 (Exact duplicate for seamless looping) -->
          <div class="ticker-group" aria-hidden="true">
            <span class="ticker-word arabic">الهوية</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">الأعمال</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">التراث</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">الابتكار</span>
            <span class="ticker-divider">|</span>
            <span class="ticker-word">Identity</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Business</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Heritage</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Innovation</span>
            <span class="ticker-bullet">◆</span>
          </div>

          <!-- Group 3 (Extra buffer for ultra-wide displays) -->
          <div class="ticker-group" aria-hidden="true">
            <span class="ticker-word arabic">الهوية</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">الأعمال</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">التراث</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word arabic">الابتكار</span>
            <span class="ticker-divider">|</span>
            <span class="ticker-word">Identity</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Business</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Heritage</span>
            <span class="ticker-bullet">◆</span>
            <span class="ticker-word">Innovation</span>
            <span class="ticker-bullet">◆</span>
          </div>
        </div>
      </div>
    </div>

  </section>

  <!-- Interactive Silk & Animation Script -->
  <script src="script.js"></script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Successfully created index.html!');
