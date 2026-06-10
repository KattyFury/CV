# HANDOFF — CV / Portfolio (0xhieu.xyz)

**Date:** 2026-06-05  
**Repo:** https://github.com/KattyFury/CV  
**Live:** Cloudflare Pages (auto-deploy từ main branch)  
**Local:** `node server.js` → http://localhost:8080

---

## Stack

- Static HTML (`index.html`) — toàn bộ site trong 1 file
- Node.js `server.js` — dev server port 8080, SPA fallback
- Google Sheets CSV — data source (read-only từ website)
- Google Apps Script — sync ATH + current price mỗi ngày lúc 2h
- Puppeteer `export-pdf.js` — xuất toàn trang thành PDF

---

## Data Flow

```
Google Sheet (DATA tab)
  → Apps Script syncAll() [daily 2am]
      → CoinGecko /coins/markets → ghi ATH (col L) + current price (col N)
  → Website fetch CSV → parse → render
```

### Sheet columns (DATA tab)

> Cập nhật 2026-06-10: sheet đã đổi thứ tự cột, `index.html` đã sửa theo mapping mới này.

| Col | Index | Field |
|-----|-------|-------|
| A | 0 | tgeDate (DD/MM/YYYY) |
| B | 1 | ticker |
| C | 2 | CoinGecko ID |
| D | 3 | type (Layer-1, Layer-2...) |
| E | 4 | fundraising ($M) |
| F | 5 | vcAlloc (%) |
| G | 6 | totalSupply |
| H | 7 | priceTGE |
| J | 9 | ATH (dùng cho ×ATH, ×ATM filter) |
| N | 13 | currentPrice (sync bởi Apps Script) |

---

## Valuation Section — Logic

### ×TGE / ×ATH / ×ATM

```
vcPricePerToken = (fundraising * 1e6) / (vcAlloc / 100) / totalSupply
×TGE = priceTGE / vcPricePerToken
×ATH = ath / vcPricePerToken       ← ATH intraday listing day bị filter → hiển thị —
×ATM = currentPrice / vcPricePerToken
```

**ATH intraday filter:** Nếu `ath_date` cùng ngày `tgeDate` (< 24h) → `×ATH = —`  
Lý do: CoinGecko lấy absolute high kể cả râu nến listing day, không phản ánh thực tế.

### Size suffix (vcFDV)

```
vcFDV = fundraising / (vcAlloc / 100)
< $100M  → $
< $200M  → $$
< $500M  → $$$
≥ $500M  → $$$$
```

### Recent TGE Multiples

- Split theo $300M FDV threshold: Low FDV / High FDV
- Window: **6 token gần nhất** mỗi bucket
- Hiển thị median

### Market Condition

- `shortMed` = median của 4 ×TGE gần nhất
- 5 levels: Dead (<1×) / Weak (1-2×) / Normal (2-4×) / Good (4-7×) / Uptrend (>7×)

---

## Apps Script (Google Sheet)

**Function:** `syncAll()`  
**Trigger:** Daily 2am (setup bằng `setupDailyTrigger()`)

Chỉ sync 2 cột:
- Col L: ATH (`c.ath`)
- Col N: current price (`c.current_price`)

Cột J (beforeATH) **bỏ trống** — đã thử CoinGecko (401), Binance (451 geo-block), OKX (ít data), CryptoCompare (cần key, SSL issue), Gate.io (user từ chối), CoinDesk API (ít data). Chưa có giải pháp free hoạt động tốt.

---

## WTE Cards (Airdrop tab)

- Logo: lấy từ `unavatar.io/twitter/{handle}` — extract handle từ cột Twitter
- Rank badge (S/A/B) nằm góc phải card, đứng sau Type
- Colors: S=#FF5A36, A=#FFA111, B=#FFD447

---

## Best Roles to Grind — Spec (chưa implement)

Tab Airdrop → sub-tab "Best Roles to Grind". User cung cấp danh sách project có role grinding, hệ thống tự tính rating.

### Rating system

| Tiêu chí | Stars | Logic |
|----------|-------|-------|
| Fundraising | 1–3★ | mốc cụ thể cần xác định từ data (xem bên dưới) |
| Layer-1 / Layer-2 | +1★ | chain type ưu tiên |
| Stable chain (Tempo, Arc...) | +2★ | established chain, ít rủi ro hơn |
| VC quality | +1★ | **TODO** — cần bộ VC list trước khi làm |

**Final rating:** tổng stars → S (cao) / A / B

### Fundraising thresholds (chưa xác định)
Cần phân tích phân phối fundraising của ~71 token trong DATA sheet để tìm breakpoint tự nhiên cho 1★ / 2★ / 3★.

### Data source
Dự kiến: thêm tab mới trong Google Sheet (tương tự Work to Earn). User nhập: project name, twitter handle, chain type, fundraising (lấy từ DATA nếu có). Website fetch CSV → tính rating → render cards.

### VC bonus (TODO)
Cần có bộ data: danh sách VC tier-1/tier-2 → nếu project có VC trong list → +1★. Làm sau khi có data.

---

## Pending / Known Issues

1. **beforeATH (cột J)** — chưa có giải pháp. Cân nhắc:
   - CryptoCompare free key (đăng ký free, ~100k calls/tháng) — user gặp SSL issue khi đăng ký
   - Nhập tay cho ~15-20 token lớn
   - Bybit API (chưa thử)

2. **×ATH filter** — hiện filter ATH cùng ngày TGE. Nhưng một số token ATH trong 1-3 ngày đầu cũng có thể là pump ảo. Cân nhắc mở rộng window filter.

3. **CoinGecko API key** — đang dùng Demo key `CG-Z7aWtTW1pcctWZeu9eebaDTw` (trong `.env.txt`). Key này từng bị commit lên GitHub (đã fix với `.gitignore`). Nên regenerate nếu cần bảo mật.

---

## Files quan trọng

```
index.html          — toàn bộ website (HTML + CSS + JS)
server.js           — dev server
export-pdf.js       — xuất PDF bằng Puppeteer
.env.txt            — API keys (gitignored)
.gitignore          — bao gồm .env, node_modules, .claude/
```

---

## Lệnh thường dùng

```bash
node server.js          # chạy local
node export-pdf.js      # xuất cv.pdf (cần server đang chạy)
git add index.html && git commit -m "..." && git push
```
