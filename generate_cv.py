# -*- coding: utf-8 -*-
"""
0xhieu CV generator — clean 2-column layout
Left sidebar: photo + contact + available for
Right main:   tagline + experience
"""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os, textwrap

OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "0xhieu_CV.pdf")
PFP    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "PFP.png")

# ── Page & grid ───────────────────────────────────────
W, H   = A4                     # 595.27 x 841.89 pt
PAD    = 14*mm
SIDE_W = 62*mm                  # left sidebar width
MAIN_X = SIDE_W + PAD * 2      # main column x start
MAIN_W = W - MAIN_X - PAD      # main column width

# ── Colors ────────────────────────────────────────────
ACCENT  = (1.0,  0.631, 0.067)   # #FFA111
DARK    = (0.102, 0.102, 0.102)  # #1a1a1a
MUTED   = (0.53,  0.53,  0.53)
WHITE   = (1.0,   1.0,   1.0)
SIDEBAR = (0.97,  0.97,  0.97)   # very light grey
DIVIDER = (0.88,  0.88,  0.88)

def rgb(c): return c

# ── Canvas helpers ────────────────────────────────────
class CV:
    def __init__(self):
        self.c   = canvas.Canvas(OUTPUT, pagesize=A4)
        self.c.setTitle("0xhieu – Hieu Nguyen | CV")
        self.c.setAuthor("Hieu Nguyen")

    # ── drawing primitives ─────────────────────────────
    def color(self, col):
        self.c.setFillColorRGB(*col)
    def stroke_color(self, col):
        self.c.setStrokeColorRGB(*col)

    def rect(self, x, y, w, h, fill, stroke=None, radius=0):
        self.c.setFillColorRGB(*fill)
        if stroke:
            self.c.setStrokeColorRGB(*stroke)
        if radius:
            self.c.roundRect(x, y, w, h, radius,
                             fill=1, stroke=1 if stroke else 0)
        else:
            self.c.rect(x, y, w, h,
                        fill=1, stroke=1 if stroke else 0)

    def text(self, x, y, s, font="Helvetica", size=10,
             color=DARK, align="left", max_w=None, link=None):
        self.c.setFont(font, size)
        self.c.setFillColorRGB(*color)
        if max_w and len(s) * size * 0.5 > max_w:
            # word-wrap manually
            chars_per_line = max(1, int(max_w / (size * 0.52)))
            lines = textwrap.wrap(s, chars_per_line)
        else:
            lines = [s]

        line_h = size * 1.35
        for i, line in enumerate(lines):
            yy = y - i * line_h
            if align == "center":
                self.c.drawCentredString(x, yy, line)
            elif align == "right":
                self.c.drawRightString(x, yy, line)
            else:
                self.c.drawString(x, yy, line)

        # Add link annotation on first line only
        if link:
            tw = self.c.stringWidth(lines[0], font, size)
            self.c.linkURL(link, (x, y - size, x + tw, y + 2), relative=0)

        return y - len(lines) * line_h  # return new y

    def circle_image(self, cx, cy, r, path):
        """Draw circular clipped image centred at (cx,cy) with radius r"""
        if not os.path.exists(path):
            # fallback circle with initials
            self.rect(cx - r, cy - r, r*2, r*2, ACCENT, radius=r)
            self.c.setFont("Helvetica-Bold", r * 0.7)
            self.c.setFillColorRGB(*WHITE)
            self.c.drawCentredString(cx, cy - r*0.25, "0x")
            return
        p = self.c.beginPath()
        p.circle(cx, cy, r)
        self.c.saveState()
        self.c.clipPath(p, stroke=0, fill=0)
        self.c.drawImage(ImageReader(path),
                         cx - r, cy - r, r*2, r*2, mask='auto')
        self.c.restoreState()

    def hline(self, x, y, w, color=DIVIDER, thickness=0.5):
        self.c.setStrokeColorRGB(*color)
        self.c.setLineWidth(thickness)
        self.c.line(x, y, x + w, y)

    def bullet_text(self, x, y, text_str, size=9.5, color=DARK,
                    max_w=None, indent=8, link=None):
        """Draw bullet + wrapped text, return new y"""
        self.c.setFillColorRGB(*ACCENT)
        self.c.setFont("Helvetica", size)
        self.c.drawString(x, y, "•")
        bx = x + indent
        bw = (max_w or 200) - indent

        self.c.setFillColorRGB(*color)
        # wrap
        avg_char = size * 0.52
        cpl = max(1, int(bw / avg_char))
        lines = textwrap.wrap(text_str, cpl) or [""]
        lh = size * 1.4
        for i, ln in enumerate(lines):
            yy = y - i * lh
            self.c.setFont("Helvetica", size)
            self.c.setFillColorRGB(*color)
            self.c.drawString(bx, yy, ln)
        if link:
            tw = self.c.stringWidth(lines[0], "Helvetica", size)
            self.c.linkURL(link, (bx, y - size, bx + tw, y + 2), relative=0)
        return y - len(lines) * lh

    def save(self):
        self.c.save()
        print(f"Saved: {OUTPUT}")

# ── Build ─────────────────────────────────────────────
cv = CV()
c  = cv.c

# ════════════════════════════════════════════════════
# SIDEBAR background
# ════════════════════════════════════════════════════
cv.rect(0, 0, SIDE_W, H, SIDEBAR)

# Accent bar top
cv.rect(0, H - 6*mm, SIDE_W, 6*mm, ACCENT)

# ── Profile photo ──────────────────────────────────
PHOTO_CY = H - 6*mm - 26*mm
cv.circle_image(SIDE_W / 2, PHOTO_CY, 18*mm, PFP)

# ── Name block ─────────────────────────────────────
y = PHOTO_CY - 21*mm
cv.text(SIDE_W/2, y, "0xhieu", "Helvetica-Bold", 15, ACCENT, align="center")
y -= 6*mm
cv.text(SIDE_W/2, y, "Hieu Nguyen", "Helvetica-Bold", 11, DARK, align="center")
y -= 5*mm
cv.text(SIDE_W/2, y, "Hanoi, Vietnam", "Helvetica", 8.5, MUTED, align="center")

# ── Divider ────────────────────────────────────────
y -= 5*mm
cv.hline(PAD, y, SIDE_W - PAD*2)

# ── Contact ────────────────────────────────────────
y -= 5*mm
cv.text(PAD, y, "CONTACT", "Helvetica-Bold", 7.5, MUTED)
y -= 5*mm

contacts = [
    ("𝕏  @nguyen0xhieu",      "https://x.com/nguyen0xhieu"),
    ("✈  t.me/nguyen0xhieu",  "https://t.me/nguyen0xhieu"),
    ("✉  kattyfury1403@gmail.com", "mailto:kattyfury1403@gmail.com"),
    ("👥  Community",          "https://t.me/airdrop_1wallet"),
    ("🌐  0xhieu.xyz",         "https://0xhieu.xyz"),
]
for label, url in contacts:
    cv.text(PAD, y, label, "Helvetica", 8.5, ACCENT, link=url)
    y -= 5.2*mm

# ── Divider ────────────────────────────────────────
y -= 2*mm
cv.hline(PAD, y, SIDE_W - PAD*2)
y -= 5*mm

# ── Available for ──────────────────────────────────
cv.text(PAD, y, "AVAILABLE FOR", "Helvetica-Bold", 7.5, MUTED)
y -= 5*mm
for item in ["Ambassador", "Community Building", "& Moderation", "Content Collaborations"]:
    cv.text(PAD, y, item, "Helvetica", 8.5, DARK, max_w=SIDE_W - PAD)
    y -= 4.8*mm

# ── Divider ────────────────────────────────────────
y -= 2*mm
cv.hline(PAD, y, SIDE_W - PAD*2)
y -= 5*mm

# ── Skills / niche ─────────────────────────────────
cv.text(PAD, y, "NICHE", "Helvetica-Bold", 7.5, MUTED)
y -= 5*mm
for skill in ["Crypto Research", "Airdrop Farming", "Content Creation",
              "Community Building", "Graphic Design"]:
    # pill tag
    tw = c.stringWidth(skill, "Helvetica", 8) + 8
    cv.rect(PAD, y - 3, tw, 11, ACCENT)
    cv.text(PAD + 4, y, skill, "Helvetica", 8, WHITE)
    y -= 6*mm

# ════════════════════════════════════════════════════
# MAIN COLUMN
# ════════════════════════════════════════════════════
mx = MAIN_X   # left edge of main col
mw = MAIN_W   # usable width

# ── Accent bar top ─────────────────────────────────
cv.rect(SIDE_W, H - 6*mm, W - SIDE_W, 6*mm, DARK)

# ── Hero tagline ───────────────────────────────────
y = H - 6*mm - 8*mm
cv.text(mx, y, "Former crypto researcher, now creating", "Helvetica-Bold", 13, DARK, max_w=mw)
y -= 7*mm
cv.text(mx, y, "content and building community.", "Helvetica-Bold", 13, DARK)
y -= 6*mm
cv.text(mx, y,
        "Highlight promising crypto projects, explain how they work & why they matter,",
        "Helvetica", 9, MUTED, max_w=mw)
y -= 5*mm
cv.text(mx, y, "keep everything simple & easy to understand.", "Helvetica", 9, MUTED)

# ── Section: Experience ────────────────────────────
y -= 8*mm
cv.text(mx, y, "EXPERIENCE", "Helvetica-Bold", 8, MUTED)
cv.hline(mx, y - 2*mm, mw, DIVIDER)
y -= 8*mm

experience = [
    ("2026", "Community Builder", [
        ("Built a 450+ member Telegram community in Q1/2026", "https://t.me/airdrop_1wallet"),
    ]),
    ("2025", "Content Creator & Contributor", [
        ("Built 6,000+ audience on X in 1 year — airdrop niche", None),
        ("Ambassador of $RECALL, top Yapper of $NEWT $RECALL $MIRA $RLS $SENT $ZAMA", None),
        ("OG contributor: $SOMI $RECALL $RLS $ZAMA — drives attention & onboards users", None),
    ]),
    ("2023 – 2024", "Investment Researcher at VHG", [
        ("Analyzed market structure & early-stage projects, supporting spot investment decisions", None),
    ]),
    ("2022", "Crypto Markets", [
        ("Trained under 10+ year crypto OG, ranked among top futures traders on Binance", None),
    ]),
    ("Pre-2022", "Graphic Designer", [
        ("Visual content for HangFashion & Vietnamour", None),
        ("Portfolio: behance.net/kattyfury", "https://www.behance.net/kattyfury"),
    ]),
]

YEAR_W = 22*mm
ENTRY_X = mx + YEAR_W + 3*mm
ENTRY_W = mw - YEAR_W - 3*mm

for year, role, bullets in experience:
    # Year
    cv.text(mx, y, year, "Helvetica", 9, ACCENT)
    # Role
    cv.text(ENTRY_X, y, role, "Helvetica-Bold", 10.5, DARK, max_w=ENTRY_W)
    y -= 5.5*mm
    for bullet_text, link in bullets:
        y = cv.bullet_text(ENTRY_X, y, bullet_text,
                           size=9, max_w=ENTRY_W, indent=9, link=link)
        y -= 1.5*mm
    y -= 4*mm

# ── Footer strip ───────────────────────────────────
cv.rect(0, 0, W, 8*mm, DARK)
footer_items = [
    ("0xhieu.xyz",            "https://0xhieu.xyz"),
    ("x.com/nguyen0xhieu",    "https://x.com/nguyen0xhieu"),
    ("t.me/airdrop_1wallet",  "https://t.me/airdrop_1wallet"),
]
fx = PAD
for label, url in footer_items:
    cv.text(fx, 3*mm, label, "Helvetica", 8, WHITE, link=url)
    fx += W / len(footer_items)

cv.save()
