/* Latar animasi pembuatan kopi (SVG + CSS, tanpa file video).
   Siklus 9 detik: espresso menetes -> cangkir terisi -> susu dituang -> latte jadi.
   Kelas animasi (cb-*) ada di globals.css. */

const BEANS = [
  { x: 120, y: 160, r: 20, d: 7, delay: 0 },
  { x: 300, y: 620, r: -15, d: 9, delay: 1.2 },
  { x: 520, y: 110, r: 35, d: 8, delay: 2.4 },
  { x: 700, y: 760, r: -40, d: 10, delay: 0.6 },
  { x: 860, y: 260, r: 10, d: 7.5, delay: 3 },
  { x: 220, y: 420, r: 60, d: 11, delay: 1.8 },
  { x: 640, y: 450, r: -25, d: 9.5, delay: 4 },
  { x: 1380, y: 140, r: 30, d: 8.5, delay: 2 },
  { x: 1400, y: 760, r: -10, d: 10, delay: 0.3 },
];

export default function CoffeeBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#140D09] ${className}`}>
      <svg className="cb-anim h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="cb-glow" cx="78%" cy="55%" r="55%">
            <stop offset="0" stopColor="#5A3A22" stopOpacity=".55" />
            <stop offset="1" stopColor="#140D09" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cb-shot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8A4F22" />
            <stop offset="1" stopColor="#3B1F10" />
          </linearGradient>
          <clipPath id="cb-cup-clip">
            <path d="M1082 502 L1218 502 L1204 598 Q1199 612 1185 612 L1115 612 Q1101 612 1096 598 Z" />
          </clipPath>
        </defs>

        <rect width="1440" height="900" fill="url(#cb-glow)" />

        {/* Biji kopi melayang */}
        {BEANS.map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r})`}>
            <g className="cb-bean" style={{ animationDuration: `${b.d}s`, animationDelay: `${b.delay}s` }}>
              <ellipse rx="16" ry="11" fill="#4A2A17" opacity=".75" />
              <path d="M-12 0 Q-4 -6 0 0 Q4 6 12 0" fill="none" stroke="#1F120A" strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
            </g>
          </g>
        ))}

        {/* Mesin espresso */}
        <rect x="975" y="60" width="350" height="205" rx="26" fill="#2A1C14" stroke="#3A2A1F" strokeWidth="3" />
        <rect x="1005" y="90" width="120" height="70" rx="12" fill="#1C130D" />
        <circle cx="1065" cy="125" r="24" fill="none" stroke="#C8924F" strokeWidth="3" opacity=".8" />
        <path d="M1065 125 L1078 112" stroke="#C8924F" strokeWidth="3" strokeLinecap="round" />
        <circle className="cb-led" cx="1290" cy="95" r="6" fill="#E3B57A" />
        <text x="1150" y="135" fill="#C8924F" fontSize="22" fontWeight="700" letterSpacing="6" opacity=".7">MAOST</text>
        <rect x="1105" y="255" width="90" height="34" rx="8" fill="#4A3527" />
        <rect x="1190" y="264" width="120" height="16" rx="8" fill="#151515" />
        <rect x="1128" y="289" width="10" height="16" rx="3" fill="#2A1C14" />
        <rect x="1162" y="289" width="10" height="16" rx="3" fill="#2A1C14" />

        {/* Aliran espresso + tetesan */}
        <g className="cb-shot">
          <rect className="cb-stream" x="1131" y="305" width="4" height="200" rx="2" fill="url(#cb-shot)" />
          <rect className="cb-stream" x="1165" y="305" width="4" height="200" rx="2" fill="url(#cb-shot)" />
          {[0, 0.3, 0.6].map((d, i) => (
            <circle key={i} className="cb-drop" cx={i % 2 ? 1167 : 1133} cy="306" r="3.5" fill="#6B3E1F" style={{ animationDelay: `${d}s` }} />
          ))}
        </g>

        {/* Pitcher susu */}
        <g className="cb-pitcher">
          <path d="M1232 402 L1286 402 L1296 470 L1240 470 Z" fill="#C9CED3" stroke="#9AA1A8" strokeWidth="2" />
          <path d="M1232 402 L1220 396 L1236 412 Z" fill="#C9CED3" />
          <path d="M1293 415 Q1318 425 1295 452" fill="none" stroke="#9AA1A8" strokeWidth="6" strokeLinecap="round" />
        </g>
        <path className="cb-milk" d="M1206 460 Q1176 468 1162 528" fill="none" stroke="#F3E9DC" strokeWidth="7" strokeLinecap="round" />

        {/* Cangkir + isi */}
        <g clipPath="url(#cb-cup-clip)">
          <rect className="cb-liquid" x="1080" y="500" width="140" height="120" />
        </g>
        <path d="M1080 500 L1220 500 L1205 600 Q1200 615 1185 615 L1115 615 Q1100 615 1095 600 Z" fill="none" stroke="#EDE3D6" strokeWidth="5" />
        <path d="M1213 525 Q1252 528 1246 560 Q1240 585 1206 582" fill="none" stroke="#EDE3D6" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="1150" cy="620" rx="100" ry="12" fill="#C8924F" opacity=".9" />
        <rect x="995" y="632" width="310" height="18" rx="8" fill="#2A1C14" />

        {/* Uap */}
        {[1120, 1150, 1180].map((x, i) => (
          <path key={x} className="cb-steam" d={`M${x} 490 q-14 -22 0 -44 q14 -22 0 -44`} fill="none" stroke="#F3E9DC" strokeWidth="5" strokeLinecap="round" style={{ animationDelay: `${i * 0.8}s` }} />
        ))}
      </svg>
    </div>
  );
}
