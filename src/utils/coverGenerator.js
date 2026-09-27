/**
 * Generates bespoke, high-resolution SVG artwork covers and cinematic hero illustrations.
 * Completely offline, copyright-free, and styled with high-end editorial aesthetics.
 */

export function generateHeroArtworkSvg({
  accent = "#E5A93C",
  secondary = "#111420",
}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
    <defs>
      <!-- Deep Sky Gradient -->
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#05060A"/>
        <stop offset="45%" stop-color="${secondary}"/>
        <stop offset="75%" stop-color="#141824"/>
        <stop offset="100%" stop-color="#090A0F"/>
      </linearGradient>

      <!-- Celestial Rift / Core Glow -->
      <radialGradient id="portalGlow" cx="50%" cy="46%" r="48%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.55"/>
        <stop offset="35%" stop-color="#C28722" stop-opacity="0.25"/>
        <stop offset="70%" stop-color="#171A28" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#090A0F" stop-opacity="0"/>
      </radialGradient>

      <!-- Horizon Vignette & Blend -->
      <linearGradient id="edgeVignette" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#090A0F" stop-opacity="0.95"/>
        <stop offset="20%" stop-color="#090A0F" stop-opacity="0"/>
        <stop offset="80%" stop-color="#090A0F" stop-opacity="0"/>
        <stop offset="100%" stop-color="#090A0F" stop-opacity="0.95"/>
      </linearGradient>

      <linearGradient id="bottomVignette" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="60%" stop-color="#090A0F" stop-opacity="0"/>
        <stop offset="100%" stop-color="#090A0F" stop-opacity="1"/>
      </linearGradient>

      <!-- Distant Star Field Pattern -->
      <pattern id="stars" width="160" height="160" patternUnits="userSpaceOnUse">
        <circle cx="24" cy="40" r="1.2" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="85" cy="18" r="0.8" fill="${accent}" opacity="0.7"/>
        <circle cx="130" cy="95" r="1.5" fill="#FFFFFF" opacity="0.4"/>
        <circle cx="50" cy="140" r="1" fill="#FFFFFF" opacity="0.5"/>
        <circle cx="110" cy="145" r="0.7" fill="${accent}" opacity="0.8"/>
      </pattern>
    </defs>

    <!-- Canvas Base -->
    <rect width="1200" height="900" fill="url(#skyGrad)"/>
    <rect width="1200" height="900" fill="url(#stars)"/>

    <!-- Ambient Cosmic Nebula Glow -->
    <rect width="1200" height="900" fill="url(#portalGlow)"/>

    <!-- Geometric Horizon Coordinate Rings -->
    <circle cx="600" cy="450" r="320" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="16,10" opacity="0.25"/>
    <circle cx="600" cy="450" r="260" fill="none" stroke="#FFFFFF" stroke-width="0.75" opacity="0.15"/>
    <circle cx="600" cy="450" r="180" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4"/>

    <!-- The Great Arch / Celestial Gateway (Focal Monolith) -->
    <path d="M 440 680 L 440 380 Q 600 220 760 380 L 760 680" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.85"/>
    <path d="M 460 680 L 460 395 Q 600 250 740 395 L 740 680" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.3"/>

    <!-- Inner Core Eclipse Disk -->
    <circle cx="600" cy="430" r="100" fill="#0A0C13" stroke="${accent}" stroke-width="2"/>
    <circle cx="600" cy="430" r="94" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <!-- Solar Flare Core Emitter -->
    <circle cx="600" cy="430" r="28" fill="${accent}" opacity="0.9"/>
    <circle cx="600" cy="430" r="50" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.6"/>

    <!-- Horizon Beam -->
    <line x1="120" y1="450" x2="1080" y2="450" stroke="${accent}" stroke-width="1" stroke-dasharray="24,14" opacity="0.35"/>

    <!-- Layered Mountainous Terrain Ridges -->
    <!-- Far Ridge -->
    <path d="M 0 620 Q 280 570 520 600 T 880 580 Q 1060 600 1200 620 L 1200 900 L 0 900 Z" fill="#0F121C" opacity="0.9"/>
    <!-- Mid Ridge -->
    <path d="M 0 670 Q 220 620 460 650 T 840 630 Q 1080 645 1200 680 L 1200 900 L 0 900 Z" fill="#0C0E16"/>
    <!-- Fore Ridge -->
    <path d="M 0 740 Q 320 690 600 730 T 1200 750 L 1200 900 L 0 900 Z" fill="#080A0F"/>

    <!-- Solitary Explorer Silhouette at Summit Looking Up -->
    <circle cx="600" cy="708" r="4.5" fill="#E5A93C"/>
    <path d="M 596 714 L 604 714 L 602 730 L 598 730 Z" fill="#E5A93C"/>
    <line x1="597" y1="718" x2="592" y2="732" stroke="#E5A93C" stroke-width="1.5"/>

    <!-- Modern Typography Accents & Coordinates -->
    <text x="600" y="820" fill="rgba(255,255,255,0.4)" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="4">SECTOR HORIZON • EPSILON 09</text>
    <text x="600" y="842" fill="${accent}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="2">NOVA ARCHIVE ARCHITECTURE</text>

    <!-- Side and Bottom Vignettes for Natural Border Blending -->
    <rect width="1200" height="900" fill="url(#edgeVignette)" pointer-events="none"/>
    <rect width="1200" height="900" fill="url(#bottomVignette)" pointer-events="none"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateCoverSvg({
  title,
  type = "Manhwa",
  accent = "#E5A93C",
  secondary = "#1F232E",
  pattern = "mesh",
  monogram = "NP",
}) {
  const encodedTitle = encodeURIComponent(title);
  const encodedType = encodeURIComponent(type.toUpperCase());
  const encodedMonogram = encodeURIComponent(monogram);

  let patternMarkup = "";
  if (pattern === "mesh") {
    patternMarkup = `
      <defs>
        <radialGradient id="meshGlow" cx="60%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
          <stop offset="60%" stop-color="${secondary}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#090A0F" stop-opacity="1"/>
        </radialGradient>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="600" height="840" fill="#0C0E14"/>
      <rect width="600" height="840" fill="url(#meshGlow)"/>
      <rect width="600" height="840" fill="url(#grid)"/>
      <circle cx="300" cy="340" r="140" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4"/>
      <circle cx="300" cy="340" r="110" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <polygon points="300,240 380,380 220,380" fill="none" stroke="${accent}" stroke-width="2" opacity="0.6"/>
    `;
  } else if (pattern === "eclipse") {
    patternMarkup = `
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.45"/>
          <stop offset="80%" stop-color="#141822" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#090A0F" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="600" height="840" fill="#090A0F"/>
      <rect width="600" height="840" fill="url(#sunGlow)"/>
      <circle cx="300" cy="350" r="150" fill="#090A0F" stroke="${accent}" stroke-width="2"/>
      <circle cx="300" cy="350" r="130" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <line x1="80" y1="350" x2="520" y2="350" stroke="${accent}" stroke-width="1" stroke-dasharray="12,8" opacity="0.4"/>
      <line x1="300" y1="120" x2="300" y2="580" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    `;
  } else if (pattern === "constellation") {
    patternMarkup = `
      <defs>
        <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#161A26"/>
          <stop offset="50%" stop-color="${secondary}"/>
          <stop offset="100%" stop-color="#0A0C12"/>
        </linearGradient>
      </defs>
      <rect width="600" height="840" fill="url(#aurora)"/>
      <line x1="150" y1="260" x2="300" y2="210" stroke="${accent}" stroke-width="2" opacity="0.7"/>
      <line x1="300" y1="210" x2="420" y2="310" stroke="${accent}" stroke-width="2" opacity="0.7"/>
      <line x1="420" y1="310" x2="350" y2="440" stroke="${accent}" stroke-width="2" opacity="0.7"/>
      <line x1="350" y1="440" x2="220" y2="400" stroke="${accent}" stroke-width="2" opacity="0.7"/>
      <line x1="220" y1="400" x2="150" y2="260" stroke="${accent}" stroke-width="2" opacity="0.7"/>
      <circle cx="150" cy="260" r="6" fill="${accent}"/>
      <circle cx="300" cy="210" r="8" fill="#FFF"/>
      <circle cx="420" cy="310" r="5" fill="${accent}"/>
      <circle cx="350" cy="440" r="7" fill="#FFF"/>
      <circle cx="220" cy="400" r="6" fill="${accent}"/>
    `;
  } else {
    patternMarkup = `
      <defs>
        <linearGradient id="linearVibe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${secondary}"/>
          <stop offset="50%" stop-color="#11141D"/>
          <stop offset="100%" stop-color="#090A0F"/>
        </linearGradient>
      </defs>
      <rect width="600" height="840" fill="url(#linearVibe)"/>
      <rect x="60" y="80" width="480" height="680" fill="none" stroke="${accent}" stroke-width="1" opacity="0.25"/>
      <rect x="75" y="95" width="450" height="650" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <path d="M 200 400 L 300 260 L 400 400 Z" fill="${accent}" opacity="0.25"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 840" width="600" height="840">
    ${patternMarkup}
    <!-- Top Bar metadata -->
    <rect x="40" y="44" width="70" height="22" rx="4" fill="rgba(229,169,60,0.15)" stroke="${accent}" stroke-width="1"/>
    <text x="75" y="59" fill="${accent}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1.5">${encodedType}</text>
    <text x="560" y="60" fill="rgba(255,255,255,0.4)" font-family="system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="end" letter-spacing="2">NOVA ARCHIVE</text>

    <!-- Center Emblem -->
    <circle cx="300" cy="340" r="50" fill="#0E1118" stroke="${accent}" stroke-width="1.5"/>
    <text x="300" y="347" fill="${accent}" font-family="system-ui, sans-serif" font-size="18" font-weight="800" text-anchor="middle" letter-spacing="3">${encodedMonogram}</text>

    <!-- Bottom Editorial Card -->
    <rect x="40" y="600" width="520" height="190" rx="10" fill="rgba(9,10,15,0.85)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <line x1="70" y1="600" x2="160" y2="600" stroke="${accent}" stroke-width="3"/>
    <text x="70" y="645" fill="#F5F5F5" font-family="system-ui, sans-serif" font-size="28" font-weight="800" letter-spacing="-0.5">${encodedTitle}</text>
    <text x="70" y="675" fill="rgba(255,255,255,0.5)" font-family="system-ui, sans-serif" font-size="13" font-weight="500">ORIGINAL SERIALIZATION • OFFICIAL RELEASE</text>
    <rect x="70" y="710" width="100" height="28" rx="6" fill="#171A22" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="120" y="728" fill="${accent}" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">★ PREMIERE</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
