const fs = require('fs');

const net = JSON.parse(fs.readFileSync('saudi_network.json', 'utf8'));

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background:#06163d;">\n`;
svg += `  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>\n`;

svg += `  <path d="${net.dPath}" fill="rgba(243,184,68,0.06)" stroke="rgba(243,184,68,0.4)" stroke-width="1.5" />\n`;

// Connective lines
net.lines.forEach(l => {
  svg += `  <line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="rgba(243,184,68,0.22)" stroke-width="0.7" />\n`;
});

// Nodes
net.points.forEach(p => {
  const isFlare = p.flare;
  const fill = isFlare ? '#ffffff' : '#f3b844';
  const r = p.r || 2;
  const filter = isFlare ? ' filter="url(#glow)"' : '';
  svg += `  <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${fill}" opacity="${p.brightness || 0.8}"${filter} />\n`;
  if (isFlare) {
    // 4-point flare cross
    svg += `  <path d="M ${p.x - 7} ${p.y} Q ${p.x} ${p.y} ${p.x} ${p.y - 7} Q ${p.x} ${p.y} ${p.x + 7} ${p.y} Q ${p.x} ${p.y} ${p.x} ${p.y + 7} Z" fill="#ffffff" opacity="0.85" />\n`;
  }
});

svg += `</svg>`;

fs.writeFileSync('saudi_constellation.svg', svg);
console.log('Successfully generated saudi_constellation.svg with', net.points.length, 'points and', net.lines.length, 'lines.');
