/* Latar animasi halaman pemesanan: "Kisah Kurcaci Barista Maost" (siklus 24 detik).
   Babak 1  (0–6 dtk)  : Kurcaci hijau menggiling biji kopi ("Hup! Hup!"), kurcaci kurir masuk dari kanan
   Babak 2  (6–9 dtk)  : Kurcaci di bangku menarik tuas, espresso mengucur ("Espresso!"), kurir mengambil cangkir
   Babak 3  (9–15 dtk) : Kurir membawa kopi panas ke kiri, kamera perlahan zoom
   Babak 4  (18–22 dtk): Semua kurcaci melompat merayakan, biji kopi beterbangan, uap membentuk hati, "Kopi siap!"
   Babak 5  (22–24 dtk): Kurir mengantar pesanan keluar layar, cerita diulang
   Semua karakter adalah desain orisinal Maost Kopi. Animasi memakai SVG (tanpa file video). */

const SKIN = "#F0C29E";
const DUR = "24s";
const JUMP = { values: "0 0;0 0;0 -30;0 0;0 -30;0 0;0 0", keyTimes: "0;.76;.79;.82;.85;.88;1" };

function Gnome({ tunic, hat, arm, delay = "0s" }: { tunic: string; hat: string; arm?: React.ReactNode; delay?: string }) {
  return <g>
    <ellipse cx="0" cy="2" rx="40" ry="6" fill="#000" opacity=".35" />
    <ellipse cx="-14" cy="-6" rx="15" ry="9" fill="#2A170C" />
    <ellipse cx="14" cy="-6" rx="15" ry="9" fill="#2A170C" />
    <path d="M-34 -12 Q-36 -60 -22 -88 L22 -88 Q36 -60 34 -12 Z" fill={tunic} />
    <rect x="-33" y="-42" width="66" height="8" fill="#2A170C" />
    <rect x="-6" y="-45" width="12" height="13" rx="2" fill="#E3B57A" />
    <path d="M-20 -80 L-30 -42" stroke={tunic} strokeWidth="14" strokeLinecap="round" />
    <circle cx="-30" cy="-38" r="7" fill={SKIN} />
    <circle cx="0" cy="-108" r="24" fill={SKIN} />
    {[2, 14].map(x => <ellipse key={x} cx={x} cy="-114" rx="3" ry="4" fill="#1F120A">
      <animate attributeName="ry" values="4;4;0.5;4" keyTimes="0;0.92;0.96;1" dur="4s" begin={delay} repeatCount="indefinite" />
    </ellipse>)}
    <circle cx="-6" cy="-101" r="5" fill="#F2A18A" opacity=".6" />
    <path d="M-22 -104 Q-26 -70 0 -50 Q26 -70 24 -100 Q14 -92 6 -96 Q0 -90 -8 -96 Q-14 -92 -22 -104 Z" fill="#F3E9DC" />
    <path d="M2 -97 Q11 -89 22 -97 Q12 -93 2 -97 Z" fill="#E2D4C0" />
    <circle cx="15" cy="-104" r="8" fill="#E39A7D" />
    <g>
      <animateTransform attributeName="transform" type="rotate" values="-4 0 -122;4 0 -122;-4 0 -122" dur="2.6s" begin={delay} repeatCount="indefinite" />
      <path d="M-28 -120 Q-20 -152 6 -198 Q14 -204 15 -194 Q10 -160 28 -120 Z" fill={hat} />
      <ellipse cx="0" cy="-120" rx="31" ry="7" fill={hat} opacity=".75" />
      <circle cx="10" cy="-199" r="6" fill="#F3E9DC" />
    </g>
    {arm}
  </g>;
}

function Arm({ tunic, values, keyTimes, dur, to = "40 -34", children }: { tunic: string; values: string; keyTimes?: string; dur: string; to?: string; children?: React.ReactNode }) {
  const [hx, hy] = to.split(" ").map(Number);
  return <g transform="translate(16 -80)">
    <g>
      <animateTransform attributeName="transform" type="rotate" values={values} keyTimes={keyTimes} dur={dur} repeatCount="indefinite" />
      <path d={`M0 0 L${hx} ${hy}`} stroke={tunic} strokeWidth="13" strokeLinecap="round" />
      <circle cx={hx} cy={hy} r="8" fill={SKIN} />
      {children}
    </g>
  </g>;
}

/* Lompatan perayaan di babak 4 */
function Jump({ children }: { children: React.ReactNode }) {
  return <g>
    <animateTransform attributeName="transform" type="translate" values={JUMP.values} keyTimes={JUMP.keyTimes} dur={DUR} repeatCount="indefinite" />
    {children}
  </g>;
}

/* Balon kata yang muncul sebentar */
function Bubble({ x, y, w, text, show }: { x: number; y: number; w: number; text: string; show: [number, number] }) {
  const [a, b] = show;
  return <g opacity="0" transform={`translate(${x} ${y})`}>
    <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes={`0;${a};${a + 0.015};${b};${b + 0.015};1`} dur={DUR} repeatCount="indefinite" />
    <rect x={-w / 2} y="-22" width={w} height="40" rx="20" fill="#F3E9DC" />
    <path d="M-8 16 L0 32 L8 16 Z" fill="#F3E9DC" />
    <text x="0" y="5" textAnchor="middle" fill="#2A170C" fontSize="17" fontWeight="800">{text}</text>
  </g>;
}

const BACK_BEANS = [
  { x: 120, y: 160, r: 20, d: "7s" }, { x: 300, y: 620, r: -15, d: "9s" }, { x: 520, y: 110, r: 35, d: "8s" },
  { x: 700, y: 760, r: -40, d: "10s" }, { x: 760, y: 300, r: 10, d: "7.5s" }, { x: 220, y: 420, r: 60, d: "11s" },
  { x: 560, y: 480, r: -25, d: "9.5s" },
];
const SPARKS = [[880, 260], [1010, 330], [1180, 250], [1400, 300], [1300, 420], [940, 470], [1120, 450]];
const CONFETTI = [[-70, -150], [-30, -190], [10, -170], [50, -200], [90, -140], [-110, -120]];

export default function GnomeBaristaBackdrop() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#140D09]">
    <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gn-glow" cx="80%" cy="62%" r="55%">
          <stop offset="0" stopColor="#6B4426" stopOpacity=".55" />
          <stop offset="1" stopColor="#140D09" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gn-bulb"><stop offset="0" stopColor="#FFE2A8" /><stop offset="1" stopColor="#FFE2A8" stopOpacity="0" /></radialGradient>
        <filter id="gn-blur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#gn-glow)" />

      {/* Lapisan jauh: biji kopi melayang */}
      {BACK_BEANS.map((b, i) => <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r})`}>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 -12;0 12;0 -12" dur={b.d} repeatCount="indefinite" />
          <ellipse rx="16" ry="11" fill="#4A2A17" opacity=".75" />
          <path d="M-12 0 Q-4 -6 0 0 Q4 6 12 0" fill="none" stroke="#1F120A" strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
        </g>
      </g>)}

      {/* Kamera: zoom pelan seperti adegan film */}
      <g transform="translate(1150 650)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="1;1;1.07;1.07;1.03;1" keyTimes="0;.3;.6;.75;.92;1" dur={DUR} repeatCount="indefinite" />
          <g transform="translate(-1150 -650)">

            {/* Lampu gantung + kilau saat perayaan */}
            <path d="M860 90 Q1000 170 1140 110 Q1280 170 1440 100" fill="none" stroke="#3A2A1F" strokeWidth="3" />
            {[[930, 128], [1030, 150], [1140, 110], [1240, 146], [1350, 132]].map(([x, y], i) => <g key={x}>
              <circle cx={x} cy={y + 26} r="34" fill="url(#gn-bulb)" opacity=".5">
                <animate attributeName="opacity" values=".35;.65;.35" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y + 26} r="60" fill="url(#gn-bulb)" opacity="0">
                <animate attributeName="opacity" values="0;0;.7;.2;.7;0;0" keyTimes={JUMP.keyTimes} dur={DUR} repeatCount="indefinite" />
              </circle>
              <line x1={x} y1={y} x2={x} y2={y + 14} stroke="#3A2A1F" strokeWidth="3" />
              <circle cx={x} cy={y + 26} r="11" fill="#FFD58A" />
            </g>)}

            {/* Bintang kecil berkelip */}
            {SPARKS.map(([x, y], i) => <path key={i} d={`M${x} ${y - 9} L${x + 2.5} ${y - 2.5} L${x + 9} ${y} L${x + 2.5} ${y + 2.5} L${x} ${y + 9} L${x - 2.5} ${y + 2.5} L${x - 9} ${y} L${x - 2.5} ${y - 2.5} Z`} fill="#FFE2A8" opacity="0">
              <animate attributeName="opacity" values="0;.9;0" dur={`${1.6 + (i % 3) * 0.7}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </path>)}

            {/* Meja atas */}
            <rect x="860" y="700" width="600" height="26" rx="6" fill="#3A2619" />
            <rect x="860" y="726" width="600" height="10" fill="#22160F" />

            {/* Grinder */}
            <rect x="940" y="600" width="100" height="12" rx="3" fill="#3B2414" />
            <path d="M955 600 Q990 556 1025 600 Z" fill="#9AA1A8" />
            {[[975, 588], [990, 580], [1005, 588], [985, 594], [998, 594]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="5" ry="3.5" fill="#4A2A17">
              <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur=".7s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
            </ellipse>)}
            <rect x="945" y="612" width="90" height="88" rx="8" fill="#7A4A22" stroke="#4A2A17" strokeWidth="3" />
            <rect x="960" y="660" width="60" height="26" rx="4" fill="#5A341A" />
            <circle cx="990" cy="673" r="4" fill="#E3B57A" />
            <rect x="987" y="558" width="6" height="14" fill="#2A170C" />
            <g>
              <animateTransform attributeName="transform" type="rotate" values="0 990 560;360 990 560" dur="1.4s" repeatCount="indefinite" />
              <line x1="990" y1="560" x2="1020" y2="560" stroke="#2A170C" strokeWidth="6" strokeLinecap="round" />
              <circle cx="1020" cy="560" r="7" fill="#C8924F" />
            </g>
            <circle cx="990" cy="560" r="6" fill="#2A170C" />

            {/* Biji kopi beterbangan saat perayaan */}
            {CONFETTI.map(([dx, dy], i) => <ellipse key={i} cx="990" cy="585" rx="7" ry="5" fill={i % 2 ? "#6B3E1F" : "#C8924F"} opacity="0">
              <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.77;.78;.9;.92;1" dur={DUR} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" values={`0 0;0 0;${dx} ${dy};${dx * 1.5} 120;0 0`} keyTimes="0;.77;.83;.92;1" dur={DUR} repeatCount="indefinite" />
            </ellipse>)}

            {/* Kurcaci 1: penggiling */}
            <g transform="translate(900 700)">
              <Jump><Gnome tunic="#2E5A4A" hat="#9C3B2E" arm={<Arm tunic="#2E5A4A" values="-28 0 0;12 0 0;-28 0 0" dur="1.4s" to="44 -34" />} /></Jump>
            </g>
            <Bubble x={905} y={455} w={130} text="Hup! Hup!" show={[0.04, 0.18]} />

            {/* Mesin espresso */}
            <rect x="1140" y="540" width="160" height="160" rx="16" fill="#9C5A2E" stroke="#5A341A" strokeWidth="3" />
            <rect x="1158" y="560" width="70" height="44" rx="8" fill="#2A170C" />
            <circle cx="1193" cy="582" r="14" fill="none" stroke="#E3B57A" strokeWidth="3" />
            <text x="1240" y="588" fill="#F3E9DC" fontSize="12" fontWeight="700" letterSpacing="2" opacity=".8">MAOST</text>
            <rect x="1180" y="636" width="66" height="18" rx="5" fill="#3B2414" />
            <rect x="1208" y="654" width="10" height="10" fill="#2A170C" />
            <line x1="1213" y1="664" x2="1213" y2="686" stroke="#6B3E1F" strokeWidth="4" strokeLinecap="round" opacity="0">
              <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.15;.25;.6;.7;1" dur="3s" repeatCount="indefinite" />
            </line>
            <g>
              <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.37;.38;.98;1" dur={DUR} repeatCount="indefinite" />
              <path d="M1196 684 L1230 684 L1226 700 L1200 700 Z" fill="#F3E9DC" />
            </g>
            <g>
              <animateTransform attributeName="transform" type="rotate" values="0 1290 545;30 1290 545;30 1290 545;0 1290 545;0 1290 545" keyTimes="0;.2;.6;.75;1" dur="3s" repeatCount="indefinite" />
              <line x1="1290" y1="545" x2="1286" y2="490" stroke="#2A170C" strokeWidth="7" strokeLinecap="round" />
              <circle cx="1286" cy="488" r="9" fill="#C8924F" />
            </g>
            <circle cx="1290" cy="545" r="7" fill="#2A170C" />

            {/* Kurcaci 2: di bangku, menarik tuas */}
            <rect x="1318" y="640" width="80" height="12" rx="3" fill="#5A341A" />
            <line x1="1328" y1="652" x2="1324" y2="700" stroke="#5A341A" strokeWidth="6" />
            <line x1="1388" y1="652" x2="1392" y2="700" stroke="#5A341A" strokeWidth="6" />
            <g transform="translate(1358 640) scale(-1 1)">
              <Jump><Gnome tunic="#7A3B1E" hat="#C8924F" delay="1.3s" arm={<Arm tunic="#7A3B1E" values="0 0 0;-21 0 0;-21 0 0;0 0 0;0 0 0" keyTimes="0;.2;.6;.75;1" dur="3s" to="52 -56" />} /></Jump>
            </g>
            <Bubble x={1330} y={380} w={140} text="Espresso!" show={[0.3, 0.45]} />

            {/* Lantai bawah + Kurcaci 3: kurir kopi */}
            <rect x="860" y="842" width="600" height="14" rx="5" fill="#2A1C14" />
            <g transform="translate(1500 840)">
              <animateTransform attributeName="transform" type="translate" values="1500 840;1230 840;1230 840;990 840;990 840;1520 840" keyTimes="0;.25;.38;.62;.92;1" dur={DUR} repeatCount="indefinite" />
              <g transform="scale(-1 1)">
                <animateTransform attributeName="transform" type="scale" values="-1 1;1 1" keyTimes="0;.92" calcMode="discrete" dur={DUR} repeatCount="indefinite" />
                <Jump>
                  <g>
                    <animateTransform attributeName="transform" type="rotate" values="-4;4;-4" dur=".8s" repeatCount="indefinite" />
                    <Gnome tunic="#3E4A7A" hat="#2E5A4A" delay=".6s" arm={<Arm tunic="#3E4A7A" values="0 0 0;0 0 0" dur="1s" to="34 -10">
                      <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.37;.38;.9;.91;1" dur={DUR} repeatCount="indefinite" />
                        <path d="M30 -32 L58 -32 L54 -10 L34 -10 Z" fill="#F3E9DC" />
                        <path d="M57 -28 Q68 -24 56 -15" fill="none" stroke="#F3E9DC" strokeWidth="4" />
                        <ellipse cx="44" cy="-31" rx="12" ry="3" fill="#6B3E1F" />
                        <path d="M44 -44 C30 -56 30 -72 44 -64 C58 -72 58 -56 44 -44 Z" fill="none" stroke="#F3E9DC" strokeWidth="3" opacity="0">
                          <animate attributeName="opacity" values="0;0;.9;0;0" keyTimes="0;.76;.8;.9;1" dur={DUR} repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -40;0 -40" keyTimes="0;.76;.9;1" dur={DUR} repeatCount="indefinite" />
                        </path>
                      </g>
                    </Arm>} />
                  </g>
                </Jump>
              </g>
            </g>
            <Bubble x={1000} y={590} w={160} text="Kopi siap! ☕" show={[0.77, 0.9]} />
          </g>
        </g>
      </g>

      {/* Lapisan dekat: biji kopi besar buram lewat di depan (efek kedalaman) */}
      {[{ y: 200, d: "26s", s: 1.6 }, { y: 760, d: "34s", s: 2.2 }].map((b, i) => <g key={i} filter="url(#gn-blur)" opacity=".35">
        <animateTransform attributeName="transform" type="translate" values={`1500 ${b.y};-100 ${b.y}`} dur={b.d} repeatCount="indefinite" />
        <g transform={`scale(${b.s})`}><ellipse rx="22" ry="15" fill="#6B3E1F" /></g>
      </g>)}
    </svg>
  </div>;
}
