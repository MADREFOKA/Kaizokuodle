/** Ilustración decorativa: atardecer en el Grand Line. Original, sin personajes ni barcos de la obra. */
export function Escena() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] overflow-hidden">
      <svg viewBox="0 0 1440 460" preserveAspectRatio="xMaxYMax slice" className="h-full w-full">
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e1530" />
            <stop offset="0.45" stopColor="#2b2a5c" />
            <stop offset="0.72" stopColor="#7a3a5e" />
            <stop offset="0.86" stopColor="#e0703f" />
          </linearGradient>
          <radialGradient id="sol" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe3a0" />
            <stop offset="0.55" stopColor="#f5b83d" />
            <stop offset="1" stopColor="#f5b83d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24325f" />
            <stop offset="1" stopColor="#0e1530" />
          </linearGradient>
          <linearGradient id="reflejo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5b83d" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f5b83d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="velo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0e1530" stopOpacity="0.75" />
            <stop offset="0.55" stopColor="#0e1530" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fundido" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e1530" stopOpacity="0" />
            <stop offset="1" stopColor="#0e1530" />
          </linearGradient>
        </defs>

        <rect width="1440" height="330" fill="url(#cielo)" />
        <g fill="#fff">
          <circle cx="140" cy="40" r="1.4" opacity=".7" /><circle cx="310" cy="88" r="1" opacity=".5" />
          <circle cx="520" cy="30" r="1.2" opacity=".6" /><circle cx="760" cy="70" r="1" opacity=".5" />
          <circle cx="980" cy="26" r="1.5" opacity=".7" /><circle cx="1180" cy="64" r="1" opacity=".5" />
          <circle cx="1330" cy="34" r="1.3" opacity=".6" /><circle cx="60" cy="120" r="1" opacity=".4" />
          <circle cx="1400" cy="130" r="1" opacity=".4" /><circle cx="860" cy="120" r=".9" opacity=".35" />
        </g>

        {/* Sol poniente y nubes */}
        <circle cx="1190" cy="318" r="120" fill="url(#sol)" />
        <circle cx="1190" cy="318" r="46" fill="#ffd27a" />
        <g fill="#f09a6a" opacity=".55">
          <rect x="1010" y="250" width="240" height="7" rx="3.5" />
          <rect x="1080" y="266" width="300" height="6" rx="3" />
        </g>

        {/* Islas lejanas */}
        <path d="M0 330 C60 300 110 296 170 312 C210 290 250 288 300 330 Z" fill="#1d2550" />
        <path d="M420 330 C470 318 520 300 560 306 C590 296 640 304 700 330 Z" fill="#26305c" />
        <path d="M1240 330 C1280 280 1320 270 1360 292 C1390 284 1420 296 1440 306 V330 Z" fill="#1d2550" />

        {/* Mar */}
        <rect y="328" width="1440" height="132" fill="url(#mar)" />
        <ellipse cx="1190" cy="380" rx="90" ry="56" fill="url(#reflejo)" />
        <g stroke="#ffd27a" strokeLinecap="round" opacity=".55">
          <line x1="1160" y1="342" x2="1222" y2="342" strokeWidth="3" />
          <line x1="1140" y1="358" x2="1242" y2="358" strokeWidth="2.5" />
          <line x1="1170" y1="376" x2="1210" y2="376" strokeWidth="2" />
        </g>

        {/* Barco pirata genérico a contraluz */}
        <g transform="translate(930 270) scale(0.85)" fill="#0b1126">
          <path d="M-70 62 C-52 84 52 84 74 62 L80 50 H-78 Z" />
          <rect x="-3" y="-34" width="5" height="88" />
          <rect x="-40" y="-6" width="4" height="58" />
          <path d="M3 -28 C40 -20 44 22 3 30 Z" />
          <path d="M-36 0 C-8 6 -8 40 -36 44 Z" />
          <path d="M2 -34 L30 -30 L2 -24 Z" fill="#e0343f" />
        </g>

        {/* Olas en primer plano */}
        <path d="M0 392 C120 378 240 404 360 392 S600 378 720 392 960 404 1080 392 1320 378 1440 392 V460 H0 Z" fill="#141c3f" opacity=".9" />
        <path d="M0 420 C160 408 300 432 480 420 S800 408 960 420 1260 432 1440 418 V460 H0 Z" fill="#0e1530" />
        <rect width="1440" height="460" fill="url(#velo)" />
        <rect y="300" width="1440" height="160" fill="url(#fundido)" />
      </svg>
    </div>
  )
}
