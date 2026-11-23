/* Latar animasi dashboard kasir: "Dapur Roastery Maost" (siklus 16 detik), berbeda dari halaman pemesanan.
   Babak 1 (0–4 dtk)  : Karung biji kopi miring, biji mentah mengalir ke corong roaster
   Babak 2 (4–9 dtk)  : Drum berputar, api menyala, asap mengepul dari cerobong
   Babak 3 (9–12 dtk) : Pintu drum terbuka, biji matang tumpah ke nampan pendingin yang diaduk
   Terus-menerus      : Printer struk mencetak tiket pesanan, ban berjalan membawa cangkir panas
   Dibuat redup supaya kartu pesanan tetap mudah dibaca. */

const DUR = "16s";
const CUP_GAP = 220;

function Cup({ x, delay }: { x: number; delay: string }) {
  return <g transform={`translate(${x} 0)`}>
    <path d="M-24 -46 L24 -46 L19 -6 Q17 0 10 0 L-10 0 Q-17 0 -19 -6 Z" fill="#F3E9DC" />
    <path d="M22 -38 Q38 -34 21 -16" fill="none" stroke="#F3E9DC" strokeWidth="5" />
    <ellipse cx="0" cy="-45" rx="21" ry="4" fill="#6B3E1F" />
    <path d="M0 -56 q-9 -14 0 -28 q9 -14 0 -28" fill="none" stroke="#F3E9DC" strokeWidth="4" strokeLinecap="round" opacity="0">
      <animate attributeName="opacity" values="0;.5;0" dur="2.6s" begin={delay} repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0 6;0 -18" dur="2.6s" begin={delay} repeatCount="indefinite" />
    </path>
  </g>;
}

export default function RoasteryBackdrop() {
  const cups = Array.from({ length: 9 }, (_, i) => -CUP_GAP + i * CUP_GAP);
  const rollers = Array.from({ length: 13 }, (_, i) => 20 + i * 120);

  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#140D09]">
    <svg className="h-full w-full opacity-60" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="rs-glow" cx="18%" cy="72%" r="45%">
          <stop offset="0" stopColor="#7A3B1E" stopOpacity=".55" />
          <stop offset="1" stopColor="#140D09" stopOpacity="0" />
        </radialGradient>
        <clipPath id="rs-window"><circle cx="260" cy="600" r="58" /></clipPath>
      </defs>
      <rect width="1440" height="900" fill="url(#rs-glow)" />
      {/* Cahaya api membesar saat drum bekerja */}
      <circle cx="260" cy="720" r="160" fill="#C8642E" opacity=".08">
        <animate attributeName="opacity" values=".04;.04;.16;.16;.04" keyTimes="0;.25;.35;.6;1" dur={DUR} repeatCount="indefinite" />
      </circle>

      {/* Babak 1: karung miring, biji mentah mengalir ke corong */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 120 420;-35 120 420;-35 120 420;0 120 420;0 120 420" keyTimes="0;.06;.22;.28;1" dur={DUR} repeatCount="indefinite" />
        <path d="M70 330 Q60 300 90 290 L170 300 Q190 310 180 340 L175 420 Q120 440 70 420 Z" fill="#B89B72" stroke="#8A7050" strokeWidth="3" />
        <text x="95" y="380" fill="#5A341A" fontSize="16" fontWeight="800">MAOST</text>
      </g>
      {[0, 0.15, 0.3, 0.45, 0.6].map((d, i) => <ellipse key={i} cx={190 + (i % 2) * 8} cy="320" rx="6" ry="4" fill="#9AA36B" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.06;.07;.22;.23;1" dur={DUR} repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0 0;30 140" dur=".8s" begin={`${d}s`} repeatCount="indefinite" />
      </ellipse>)}

      {/* Asap dari cerobong (lebih tebal di babak 2) */}
      {[0, 1.2, 2.4].map(d => <circle key={d} cx="320" cy="400" r="18" fill="#B9A795" opacity="0">
        <animate attributeName="opacity" values="0;.35;0" dur="3.6s" begin={`${d}s`} repeatCount="indefinite" />
        <animate attributeName="r" values="14;34" dur="3.6s" begin={`${d}s`} repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0 0;30 -160" dur="3.6s" begin={`${d}s`} repeatCount="indefinite" />
      </circle>)}

      {/* Mesin roaster */}
      <rect x="306" y="420" width="28" height="90" fill="#2A1C14" />
      <path d="M200 470 L290 470 L272 520 L218 520 Z" fill="#5A341A" />
      <rect x="150" y="500" width="220" height="200" rx="26" fill="#3A2A1F" stroke="#C8924F" strokeWidth="3" />
      <circle cx="260" cy="600" r="66" fill="#1F140E" stroke="#9AA1A8" strokeWidth="6" />
      <g clipPath="url(#rs-window)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 260 600;360 260 600" dur="2.5s" repeatCount="indefinite" />
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2, r = 22 + (i % 3) * 12, cx = 260 + Math.cos(a) * r, cy = 600 + Math.sin(a) * r;
            return <ellipse key={i} cx={cx} cy={cy} rx="7" ry="5" fill="#9AA36B" transform={`rotate(${i * 25} ${cx} ${cy})`}>
              <animate attributeName="fill" values="#9AA36B;#9AA36B;#7A4A22;#4A2A17;#4A2A17" keyTimes="0;.25;.45;.56;1" dur={DUR} repeatCount="indefinite" />
            </ellipse>;
          })}
        </g>
      </g>
      <path d="M202 600 A58 58 0 0 1 260 542" fill="none" stroke="#F3E9DC" strokeWidth="4" opacity=".25" />
      <circle cx="345" cy="530" r="7" fill="#E3B57A">
        <animate attributeName="opacity" values=".4;1;.4" dur="1.4s" repeatCount="indefinite" />
      </circle>
      {/* Pintu drum terbuka */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 370 610;0 370 610;-60 370 610;-60 370 610;0 370 610;0 370 610" keyTimes="0;.56;.6;.74;.78;1" dur={DUR} repeatCount="indefinite" />
        <rect x="362" y="590" width="16" height="40" rx="4" fill="#5A341A" stroke="#C8924F" strokeWidth="2" />
      </g>
      {/* Babak 3: biji matang tumpah ke nampan pendingin */}
      {[0, 0.12, 0.24, 0.36, 0.48].map((d, i) => <ellipse key={i} cx="380" cy="615" rx="6" ry="4" fill="#4A2A17" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.59;.6;.74;.75;1" dur={DUR} repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values={`0 0;${40 + i * 6} 80`} dur=".7s" begin={`${d}s`} repeatCount="indefinite" />
      </ellipse>)}
      <ellipse cx="450" cy="705" rx="80" ry="18" fill="#2A1C14" stroke="#9AA1A8" strokeWidth="3" />
      <ellipse cx="450" cy="700" rx="64" ry="10" fill="#3B2414">
        <animate attributeName="fill" values="#2A1C14;#2A1C14;#4A2A17;#4A2A17;#2A1C14" keyTimes="0;.6;.72;.95;1" dur={DUR} repeatCount="indefinite" />
      </ellipse>
      <line x1="450" y1="640" x2="450" y2="700" stroke="#9AA1A8" strokeWidth="5" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 450 700;360 450 700" dur="3s" repeatCount="indefinite" />
        <line x1="400" y1="700" x2="500" y2="700" stroke="#C8924F" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Api */}
      {[220, 260, 300].map((x, i) => <g key={x} transform={`translate(${x} 715)`}>
        <path d="M-12 0 Q0 -35 12 0 Z" fill={i === 1 ? "#E3B57A" : "#C8642E"}>
          <animateTransform attributeName="transform" type="scale" values="1 1;1 1.3;1 .85;1 1" dur={`${0.6 + i * 0.15}s`} repeatCount="indefinite" />
        </path>
      </g>)}
      <rect x="170" y="712" width="180" height="10" rx="4" fill="#2A1C14" />

      {/* Printer struk pesanan (kanan atas) */}
      <g transform="translate(1210 470)">
        <rect x="0" y="0" width="150" height="70" rx="12" fill="#2A1C14" stroke="#3A2A1F" strokeWidth="3" />
        <rect x="20" y="62" width="110" height="8" rx="3" fill="#0F0A07" />
        <circle cx="128" cy="20" r="6" fill="#7BD88F">
          <animate attributeName="opacity" values=".3;1;.3" dur="8s" repeatCount="indefinite" />
        </circle>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 -60;0 -60;0 0;0 0;0 40" keyTimes="0;.1;.4;.85;1" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;1;0" keyTimes="0;.85;.95;1" dur="8s" repeatCount="indefinite" />
          <path d="M30 66 L120 66 L120 150 L112 158 L104 150 L96 158 L88 150 L80 158 L72 150 L64 158 L56 150 L48 158 L40 150 L30 158 Z" fill="#F3E9DC" />
          <rect x="42" y="80" width="50" height="6" rx="3" fill="#C8924F" />
          <rect x="42" y="96" width="66" height="4" rx="2" fill="#B9A795" />
          <rect x="42" y="108" width="56" height="4" rx="2" fill="#B9A795" />
          <rect x="42" y="120" width="62" height="4" rx="2" fill="#B9A795" />
          <rect x="42" y="134" width="40" height="6" rx="3" fill="#6B3E1F" />
        </g>
        {/* Bel kasir ikut bergoyang tiap ada tiket */}
        <g transform="translate(190 50)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0;0;-14;12;-8;0;0" keyTimes="0;.38;.42;.46;.5;.54;1" dur="8s" repeatCount="indefinite" />
            <path d="M-26 0 Q-26 -30 0 -32 Q26 -30 26 0 Z" fill="#C8924F" />
            <circle cx="0" cy="-36" r="5" fill="#E3B57A" />
          </g>
          <rect x="-32" y="0" width="64" height="8" rx="3" fill="#5A341A" />
        </g>
      </g>

      {/* Ban berjalan + cangkir */}
      <g>
        <animateTransform attributeName="transform" type="translate" values={`0 0;${CUP_GAP} 0`} dur="5s" repeatCount="indefinite" />
        {cups.map((x, i) => <g key={x} transform="translate(0 808)"><Cup x={x} delay={`${(i % 3) * 0.8}s`} /></g>)}
      </g>
      <rect x="0" y="808" width="1440" height="22" fill="#2A1C14" />
      {rollers.map(x => <g key={x}>
        <circle cx={x} cy="842" r="13" fill="#3A2A1F" stroke="#5A341A" strokeWidth="3" />
        <line x1={x - 10} y1="842" x2={x + 10} y2="842" stroke="#7A4A22" strokeWidth="3">
          <animateTransform attributeName="transform" type="rotate" values={`0 ${x} 842;360 ${x} 842`} dur="1.6s" repeatCount="indefinite" />
        </line>
      </g>)}
      <rect x="0" y="856" width="1440" height="44" fill="#1A120D" />
    </svg>
  </div>;
}
