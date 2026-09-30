const fs = require('fs');

const net = JSON.parse(fs.readFileSync('saudi_network.json', 'utf8'));

// Format clean SVG string
let svg = `<svg class="saudi-constellation-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Soft Glow Filter -->
    <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Intense Flare Filter -->
    <filter id="flare-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Saudi Interior Radial Gradient -->
    <radialGradient id="saudi-glow-grad" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#f3b844" stop-opacity="0.12" />
      <stop offset="60%" stop-color="#f3b844" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#06163d" stop-opacity="0" />
    </radialGradient>

    <!-- Golden Line Linear Gradient -->
    <linearGradient id="gold-stroke-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe299" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#f3b844" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#c48a20" stop-opacity="0.3" />
    </linearGradient>

    <!-- Starburst Symbol -->
    <g id="star-flare">
      <ellipse cx="0" cy="0" rx="14" ry="1.2" fill="#ffffff" opacity="0.9" />
      <ellipse cx="0" cy="0" rx="1.2" ry="14" fill="#ffffff" opacity="0.9" />
      <circle cx="0" cy="0" r="3" fill="#ffffff" filter="url(#gold-glow)" />
      <circle cx="0" cy="0" r="1.5" fill="#fef08a" />
    </g>
  </defs>

  <!-- Saudi Land Ambient Backlight -->
  <path class="saudi-land-mass" d="${net.dPath}" fill="url(#saudi-glow-grad)" />

  <!-- Constellation Network Edges -->
  <g class="network-edges" stroke="url(#gold-stroke-grad)" stroke-width="0.85" opacity="0.45">
`;

net.lines.forEach(l => {
  svg += `    <line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" />\n`;
});

svg += `  </g>

  <!-- Saudi Boundary Outline with Gold Stroke -->
  <path class="saudi-boundary" d="${net.dPath}" fill="none" stroke="url(#gold-stroke-grad)" stroke-width="1.8" filter="url(#gold-glow)" opacity="0.85" />

  <!-- Constellation Nodes & City Hubs -->
  <g class="network-nodes">
`;

net.points.forEach((p, idx) => {
  const r = p.r || 2;
  const isCity = p.isCity;
  const flare = p.flare;
  const fill = flare ? '#ffffff' : (isCity ? '#ffe299' : '#f3b844');
  const animDelay = (idx % 12) * 0.4;
  
  if (flare) {
    svg += `    <g transform="translate(${p.x}, ${p.y})" class="pulsing-flare" style="animation-delay: -${animDelay}s;">
      <use href="#star-flare" />
    </g>\n`;
  } else {
    svg += `    <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${fill}" opacity="${p.brightness || 0.75}" class="star-node" style="animation-delay: -${animDelay}s;" />\n`;
  }
});

svg += `  </g>
</svg>`;

fs.writeFileSync('saudi-map-component.html', svg);
console.log('Generated saudi-map-component.html successfully!');
