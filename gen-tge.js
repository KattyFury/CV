const fs = require('fs');

const data = [
  { ticker:'OP',      tgeDate:'2022-05-30', fundraising:178500000, vcAlloc:17.00, totalSupply:4294967295,   priceTGE:1.23     },
  { ticker:'HOOK',    tgeDate:'2022-12-01', fundraising:6000000,   vcAlloc:12.00, totalSupply:500000000,    priceTGE:2.47     },
  { ticker:'ARB',     tgeDate:'2023-03-23', fundraising:123700000, vcAlloc:17.53, totalSupply:10000000000,  priceTGE:1.32     },
  { ticker:'SUI',     tgeDate:'2023-05-01', fundraising:236000000, vcAlloc:14.10, totalSupply:10000000000,  priceTGE:1.40     },
  { ticker:'ARKM',    tgeDate:'2023-07-18', fundraising:14500000,  vcAlloc:17.50, totalSupply:1000000000,   priceTGE:0.66     },
  { ticker:'WLD',     tgeDate:'2023-07-24', fundraising:240000000, vcAlloc:13.50, totalSupply:10000000000,  priceTGE:2.16     },
  { ticker:'SEI',     tgeDate:'2023-08-15', fundraising:85000000,  vcAlloc:20.00, totalSupply:10000000000,  priceTGE:0.18     },
  { ticker:'CYBER',   tgeDate:'2023-08-15', fundraising:25000000,  vcAlloc:25.10, totalSupply:100000000,    priceTGE:4.69     },
  { ticker:'TIA',     tgeDate:'2023-10-31', fundraising:56500000,  vcAlloc:35.60, totalSupply:1000000000,   priceTGE:2.28     },
  { ticker:'ACE',     tgeDate:'2023-12-18', fundraising:6600000,   vcAlloc:22.50, totalSupply:147000000,    priceTGE:13.88    },
  { ticker:'MANTA',   tgeDate:'2024-01-18', fundraising:30600000,  vcAlloc:24.11, totalSupply:1000000000,   priceTGE:2.17     },
  { ticker:'ALT',     tgeDate:'2024-01-25', fundraising:37000000,  vcAlloc:18.50, totalSupply:10000000000,  priceTGE:0.32     },
  { ticker:'STRK',    tgeDate:'2024-02-20', fundraising:282500000, vcAlloc:18.17, totalSupply:10000000000,  priceTGE:1.97     },
  { ticker:'ENA',     tgeDate:'2024-04-02', fundraising:20500000,  vcAlloc:25.00, totalSupply:15000000000,  priceTGE:0.78     },
  { ticker:'SAGA',    tgeDate:'2024-04-09', fundraising:13500000,  vcAlloc:20.00, totalSupply:1000000000,   priceTGE:6.56     },
  { ticker:'EIGEN',   tgeDate:'2024-10-01', fundraising:235000000, vcAlloc:28.25, totalSupply:1670000000,   priceTGE:4.00     },
  { ticker:'MOVE',    tgeDate:'2024-12-09', fundraising:41400000,  vcAlloc:22.50, totalSupply:10000000000,  priceTGE:0.73     },
  { ticker:'VANA',    tgeDate:'2024-12-16', fundraising:25000000,  vcAlloc:14.20, totalSupply:120000000,    priceTGE:34.40    },
  { ticker:'BIO',     tgeDate:'2025-01-03', fundraising:37000000,  vcAlloc:13.60, totalSupply:3320000000,   priceTGE:0.82     },
  { ticker:'STO',     tgeDate:'2025-04-03', fundraising:32000000,  vcAlloc:21.50, totalSupply:1000000000,   priceTGE:0.07     },
  { ticker:'BABY',    tgeDate:'2025-04-10', fundraising:96000000,  vcAlloc:30.50, totalSupply:10000000000,  priceTGE:0.09     },
  { ticker:'HYPER',   tgeDate:'2025-04-22', fundraising:18500000,  vcAlloc:10.90, totalSupply:1000000000,   priceTGE:0.27     },
  { ticker:'INIT',    tgeDate:'2025-04-24', fundraising:24000000,  vcAlloc:15.25, totalSupply:1000000000,   priceTGE:0.76     },
  { ticker:'SIGN',    tgeDate:'2025-04-28', fundraising:54150000,  vcAlloc:20.00, totalSupply:10000000000,  priceTGE:0.08     },
  { ticker:'MYX',     tgeDate:'2025-05-06', fundraising:10000000,  vcAlloc:20.00, totalSupply:1000000000,   priceTGE:0.10     },
  { ticker:'SXT',     tgeDate:'2025-05-08', fundraising:50000000,  vcAlloc:25.90, totalSupply:5000000000,   priceTGE:0.15     },
  { ticker:'NEWT',    tgeDate:'2025-05-08', fundraising:90000000,  vcAlloc:16.50, totalSupply:1000000000,   priceTGE:0.54     },
  { ticker:'H',       tgeDate:'2025-06-25', fundraising:50000000,  vcAlloc:10.00, totalSupply:10000000000,  priceTGE:0.04     },
  { ticker:'SAHARA',  tgeDate:'2025-06-26', fundraising:43000000,  vcAlloc:20.00, totalSupply:10000000000,  priceTGE:0.01     },
  { ticker:'ERA',     tgeDate:'2025-07-17', fundraising:24000000,  vcAlloc:32.00, totalSupply:1000000000,   priceTGE:1.71     },
  { ticker:'BTR',     tgeDate:'2025-08-27', fundraising:25000000,  vcAlloc:19.30, totalSupply:1000000000,   priceTGE:0.08     },
  { ticker:'XAN',     tgeDate:'2025-09-23', fundraising:60250000,  vcAlloc:31.00, totalSupply:10000000000,  priceTGE:0.24     },
  { ticker:'PLASMA',  tgeDate:'2025-09-25', fundraising:24000000,  vcAlloc:25.00, totalSupply:10000000000,  priceTGE:1.28     },
  { ticker:'RECALL',  tgeDate:'2025-10-15', fundraising:39500000,  vcAlloc:29.00, totalSupply:1000000000,   priceTGE:0.47     },
  { ticker:'ALLO',    tgeDate:'2025-11-11', fundraising:32500000,  vcAlloc:31.00, totalSupply:1000000000,   priceTGE:0.46     },
  { ticker:'MON',     tgeDate:'2025-11-24', fundraising:225000000, vcAlloc:20.00, totalSupply:100000000000, priceTGE:0.03     },
  { ticker:'STABLE',  tgeDate:'2025-12-08', fundraising:28000000,  vcAlloc:25.00, totalSupply:100000000000, priceTGE:0.02     },
  { ticker:'ZKP',     tgeDate:'2025-12-19', fundraising:15000000,  vcAlloc:22.50, totalSupply:1000000000,   priceTGE:0.21     },
  { ticker:'SENT',    tgeDate:'2026-01-22', fundraising:85000000,  vcAlloc:12.45, totalSupply:34359738368,  priceTGE:0.03     },
  { ticker:'ZAMA',    tgeDate:'2026-02-02', fundraising:130000000, vcAlloc:20.00, totalSupply:11000000000,  priceTGE:0.04     },
  { ticker:'ESP',     tgeDate:'2026-02-12', fundraising:60000000,  vcAlloc:14.32, totalSupply:3590000000,   priceTGE:0.07     },
  { ticker:'ROBO',    tgeDate:'2026-02-27', fundraising:20000000,  vcAlloc:24.30, totalSupply:10000000000,  priceTGE:0.04     },
  { ticker:'OPN',     tgeDate:'2026-03-05', fundraising:25000000,  vcAlloc:23.00, totalSupply:1000000000,   priceTGE:0.37     },
  { ticker:'UP',      tgeDate:'2026-03-13', fundraising:13330000,  vcAlloc:22.00, totalSupply:1000000000,   priceTGE:0.06     },
  { ticker:'PRL',     tgeDate:'2026-03-25', fundraising:17500000,  vcAlloc:27.66, totalSupply:1000000000,   priceTGE:0.16     },
  { ticker:'BASED',   tgeDate:'2026-03-30', fundraising:11500000,  vcAlloc:20.36, totalSupply:1000000000,   priceTGE:0.12     },
  { ticker:'OPG',     tgeDate:'2026-04-21', fundraising:9500000,   vcAlloc:9.50,  totalSupply:1000000000,   priceTGE:0.38     },
  { ticker:'BLEND',   tgeDate:'2026-04-24', fundraising:8000000,   vcAlloc:22.50, totalSupply:1000000000,   priceTGE:0.12     },
  { ticker:'PROS',    tgeDate:'2026-04-28', fundraising:52000000,  vcAlloc:20.00, totalSupply:1000000000,   priceTGE:0.92     },
  { ticker:'AIGENSYN',tgeDate:'2026-04-29', fundraising:50600000,  vcAlloc:29.60, totalSupply:10000000000,  priceTGE:0.052144 },
  { ticker:'MEGA',    tgeDate:'2026-04-30', fundraising:20000000,  vcAlloc:14.70, totalSupply:10000000000,  priceTGE:0.1666   },
];

function supplyFmt(n) {
  if (n >= 1e12) return (n/1e12).toFixed(2)+'T';
  if (n >= 1e9)  return (n/1e9).toFixed(2)+'B';
  if (n >= 1e6)  return (n/1e6).toFixed(2)+'M';
  return n.toString();
}
function getRegime(x) {
  if (x > 15) return 'Very Strong';
  if (x > 8)  return 'Strong';
  if (x > 4)  return 'Neutral';
  if (x > 2)  return 'Weak';
  return 'Very Weak';
}
const kMap = { 'Very Strong':0.18, 'Strong':0.23, 'Neutral':0.30, 'Weak':0.45, 'Very Weak':0.65 };

const rows = data.map((e, i) => {
  const vcEntryFDV = e.fundraising / (e.vcAlloc / 100);
  const tgeFDV     = e.priceTGE * e.totalSupply;
  const x          = tgeFDV / vcEntryFDV;
  const reg        = getRegime(x);
  const k          = kMap[reg];
  const penalty    = 1 + k * Math.log10(Math.max(1, tgeFDV / 1e8));
  const cliff      = tgeFDV > 1e9 ? 1 + 0.25 * Math.log10(tgeFDV / 1e9) : 1;
  const fdvCat     = vcEntryFDV < 300e6 ? 'Low FDV' : 'High FDV';
  const isSpike    = x > 20 ? 'YES' : 'no';

  return {
    no: i + 1,
    ticker: e.ticker,
    tge_date: e.tgeDate,

    // ── RAW INPUTS ──────────────────────────────────────────────────
    fundraising_usd: e.fundraising,
    fundraising_M: +(e.fundraising/1e6).toFixed(2),
    vc_alloc_pct: e.vcAlloc,
    total_supply: e.totalSupply,
    total_supply_fmt: supplyFmt(e.totalSupply),
    price_at_tge_usd: e.priceTGE,

    // ── DERIVED — CALCULATIONS ──────────────────────────────────────
    // VC Entry FDV = fundraising / (vcAlloc / 100)
    // Meaning: valuation at which VCs bought in. If raise=$30M at 6% alloc → VCs valued project at $500M
    vc_entry_fdv_usd: Math.round(vcEntryFDV),
    vc_entry_fdv_M: +(vcEntryFDV/1e6).toFixed(2),

    // TGE FDV = priceTGE × totalSupply
    // Meaning: fully diluted market cap on TGE day (what market was willing to pay)
    tge_fdv_usd: Math.round(tgeFDV),
    tge_fdv_M: +(tgeFDV/1e6).toFixed(2),

    // Multiple = TGE FDV / VC Entry FDV
    // Meaning: how many x return the project gave VCs at TGE. e.g. 5x = TGE was 5× above VC price
    multiple_x: +x.toFixed(4),

    // ── CLASSIFICATIONS ─────────────────────────────────────────────
    // FDV Category: Low = vcEntryFDV < $300M, High = vcEntryFDV >= $300M
    // Used to split the "Recent TGE medians" into two groups (smaller vs larger projects behave differently)
    fdv_category: fdvCat,

    // Market Regime: based on this project's own multiple
    // >15x=Very Strong / >8x=Strong / >4x=Neutral / >2x=Weak / else=Very Weak
    market_regime: reg,

    // Is Spike: multiple > 20x means this was a pump-and-dump TGE
    // Spikes are EXCLUDED from market condition signal (they don't reflect real market)
    is_spike_gt20x: isSpike,

    // ── MODEL D PENALTY FACTORS ─────────────────────────────────────
    // k coefficient: penalty strength depends on regime
    // Very Strong=0.18 / Strong=0.23 / Neutral=0.30 / Weak=0.45 / Very Weak=0.65
    // Logic: in weak markets, a big FDV is penalized more harshly
    k_penalty_coeff: k,

    // FDV Penalty Factor = 1 + k × log10(tgeFDV / $100M)
    // Logic: larger TGE FDV = higher penalty on expected multiple (fewer buyers can absorb it)
    fdv_penalty_factor: +penalty.toFixed(4),

    // Liquidity Cliff = 1 + 0.25 × log10(tgeFDV / $1B), only if tgeFDV > $1B
    // Logic: projects launching above $1B FDV face exponentially thinner liquidity
    liquidity_cliff: +cliff.toFixed(4),

    // Combined penalty = fdv_penalty_factor × liquidity_cliff
    // This is what MODEL D divides the compressed multiple by to get final multiple
    combined_penalty: +(penalty * cliff).toFixed(4),
  };
});

// JSON
fs.writeFileSync('C:/Users/p/Desktop/tge-data.json', JSON.stringify(rows, null, 2));

// CSV
const keys = Object.keys(rows[0]);
const escape = v => { const s = String(v); return s.includes(',') ? '"'+s+'"' : s; };
const csv = [keys.join(','), ...rows.map(r => keys.map(k => escape(r[k])).join(','))].join('\n');
fs.writeFileSync('C:/Users/p/Desktop/tge-data.csv', csv);

console.log('Written:', rows.length, 'projects,', keys.length, 'columns');
console.log('Files: C:/Users/p/Desktop/tge-data.json');
console.log('       C:/Users/p/Desktop/tge-data.csv');
