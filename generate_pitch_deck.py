"""
CompliScan AI — Premium Interactive SIH 2026 Pitch Deck Generator
Updated with Official SIH 2026 & Ministry of Consumer Affairs Branding,
Subtle Background Watermarks, and Persistent Interactive Navigation.
"""

import os
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

def ensure_assets():
    """Ensure subtle watermark exists with ~3.5% opacity."""
    src_sih = "public/assets/sih-transparent-bulb.png"
    out_wm = "public/assets/sih-watermark-subtle.png"
    if os.path.exists(src_sih):
        im = Image.open(src_sih).convert("RGBA")
        r, g, b, a = im.split()
        a = a.point(lambda p: int(p * 0.035))
        watermark = Image.merge("RGBA", (r, g, b, a))
        watermark.save(out_wm)

def create_deck():
    ensure_assets()

    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors (Modern SaaS Light Theme)
    C_BG_PAGE = RGBColor(248, 250, 252)        # Slate 50
    C_CARD_BG = RGBColor(255, 255, 255)        # Pure White
    C_CARD_BORDER = RGBColor(226, 232, 240)    # Slate 200
    C_TEXT_MAIN = RGBColor(15, 23, 42)         # Slate 900
    C_TEXT_MUTED = RGBColor(100, 116, 139)     # Slate 500
    C_PRIMARY = RGBColor(79, 70, 229)          # Indigo 600
    C_PRIMARY_LIGHT = RGBColor(238, 242, 255)  # Indigo 50
    C_EMERALD = RGBColor(16, 185, 129)         # Emerald 500
    C_EMERALD_LIGHT = RGBColor(236, 253, 245)  # Emerald 50
    C_AMBER = RGBColor(245, 158, 11)           # Amber 500
    C_AMBER_LIGHT = RGBColor(254, 243, 199)    # Amber 50
    C_RED = RGBColor(239, 68, 68)              # Red 500
    C_RED_LIGHT = RGBColor(254, 226, 226)      # Red 50
    C_DARK_PANEL = RGBColor(15, 23, 42)        # Slate 900

    # Official Logo Asset Paths
    IMG_SIH_LOGO = "public/assets/sih-transparent-bulb.png"
    IMG_MINISTRY_LOGO = "public/assets/ministry-emblem-transparent.png"
    IMG_COMPLISCAN_LOGO = "public/compliscan-logo.jpg"
    IMG_SHUBHAM = "public/assets/shubham-kumar.png"
    IMG_UCET = "public/assets/ucet-hazaribagh.jpg"
    IMG_WATERMARK = "public/assets/sih-watermark-subtle.png"

    # Instantiate all 11 slides
    slides = [prs.slides.add_slide(blank_layout) for _ in range(11)]

    # Helper: Base background styling with subtle watermark
    def set_slide_background(slide, with_watermark=True):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG_PAGE
        bg.line.fill.background()

        # Place subtle SIH background watermark behind content
        if with_watermark and os.path.exists(IMG_WATERMARK):
            try:
                slide.shapes.add_picture(IMG_WATERMARK, Inches(3.666), Inches(1.5), Inches(6.0), Inches(4.5))
            except Exception:
                pass
        return bg

    # Helper: Create styled card shape
    def add_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(border_width)
        else:
            card.line.fill.background()
        return card

    # Helper: Create Interactive Action Button
    def add_button(slide, left, top, width, height, text, bg_color=C_PRIMARY, text_color=RGBColor(255, 255, 255), target_slide=None, font_size=11, bold=True, border_color=None):
        btn = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        btn.fill.solid()
        btn.fill.fore_color.rgb = bg_color
        if border_color:
            btn.line.color.rgb = border_color
            btn.line.width = Pt(1)
        else:
            btn.line.fill.background()

        tf = btn.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.08)
        tf.margin_right = Inches(0.08)
        tf.margin_top = Inches(0.04)
        tf.margin_bottom = Inches(0.04)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = text
        run.font.name = 'Segoe UI'
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.color.rgb = text_color

        if target_slide is not None:
            btn.click_action.target_slide = target_slide
        return btn

    # Helper: Persistent Top Navigation Header & Bottom Footer with SIH + Ministry Branding
    def add_navigation_chrome(slide, slide_index, title_text, category_tag):
        # Top Header Bar Card
        header_bg = add_card(slide, Inches(0.5), Inches(0.25), Inches(12.333), Inches(0.72), C_CARD_BG, C_CARD_BORDER)
        
        # CompliScan Logo Icon
        if os.path.exists(IMG_COMPLISCAN_LOGO):
            try:
                slide.shapes.add_picture(IMG_COMPLISCAN_LOGO, Inches(0.65), Inches(0.32), Inches(0.55), Inches(0.55))
            except Exception:
                pass

        # App Title Text
        tb = slide.shapes.add_textbox(Inches(1.25), Inches(0.32), Inches(2.5), Inches(0.55))
        tf = tb.text_frame
        tf.word_wrap = False
        p = tf.paragraphs[0]
        r1 = p.add_run()
        r1.text = "CompliScan "
        r1.font.name = 'Segoe UI'
        r1.font.bold = True
        r1.font.size = Pt(13)
        r1.font.color.rgb = C_PRIMARY

        r2 = p.add_run()
        r2.text = "AI"
        r2.font.name = 'Segoe UI'
        r2.font.bold = True
        r2.font.size = Pt(13)
        r2.font.color.rgb = C_EMERALD

        p2 = tf.add_paragraph()
        r3 = p2.add_run()
        r3.text = f"{category_tag}"
        r3.font.name = 'Segoe UI'
        r3.font.size = Pt(8.5)
        r3.font.color.rgb = C_TEXT_MUTED

        # Persistent Interactive Navigation Links
        nav_items = [
            ("🏠 Home", slides[0]),
            ("💡 Solution", slides[2]),
            ("🔍 Live Demo", slides[3]),
            ("🏛️ Architecture", slides[4]),
            ("📊 Dashboard", slides[5]),
            ("⚖️ Enforcement", slides[7]),
            ("👥 Team", slides[9]),
        ]

        nav_x = Inches(3.6)
        btn_w = Inches(0.98)
        for label, tgt_slide in nav_items:
            is_active = (tgt_slide == slides[slide_index])
            bg = C_PRIMARY if is_active else C_PRIMARY_LIGHT
            tc = RGBColor(255, 255, 255) if is_active else C_PRIMARY
            add_button(slide, nav_x, Inches(0.36), btn_w, Inches(0.44), label, bg, tc, tgt_slide, font_size=8.5, bold=is_active)
            nav_x += Inches(1.04)

        # Top-Right: Official Ministry & SIH Branding Container
        add_card(slide, Inches(10.9), Inches(0.32), Inches(1.85), Inches(0.55), C_PRIMARY_LIGHT, C_CARD_BORDER)
        
        # Ministry Emblem
        if os.path.exists(IMG_MINISTRY_LOGO):
            try:
                slide.shapes.add_picture(IMG_MINISTRY_LOGO, Inches(10.95), Inches(0.35), Inches(0.85), Inches(0.48))
            except Exception:
                pass

        # SIH Logo
        if os.path.exists(IMG_SIH_LOGO):
            try:
                slide.shapes.add_picture(IMG_SIH_LOGO, Inches(11.85), Inches(0.35), Inches(0.85), Inches(0.48))
            except Exception:
                pass

        # Bottom Footer Bar
        add_card(slide, Inches(0.5), Inches(6.85), Inches(12.333), Inches(0.45), C_CARD_BG, C_CARD_BORDER)
        
        # Footer text with official attribution
        ftb = slide.shapes.add_textbox(Inches(0.7), Inches(6.92), Inches(8.0), Inches(0.35))
        fp = ftb.text_frame.paragraphs[0]
        fr1 = fp.add_run()
        fr1.text = "🇮🇳 Smart India Hackathon 2026 • PS ID: SIH26034 • Ministry of Consumer Affairs, Food & Public Distribution • UCET VBU"
        fr1.font.name = 'Segoe UI'
        fr1.font.size = Pt(8.5)
        fr1.font.color.rgb = C_TEXT_MUTED

        # Slide Number Indicator
        sntb = slide.shapes.add_textbox(Inches(9.2), Inches(6.92), Inches(1.5), Inches(0.35))
        snp = sntb.text_frame.paragraphs[0]
        snp.alignment = PP_ALIGN.RIGHT
        snr = snp.add_run()
        snr.text = f"Slide {slide_index + 1} of 11"
        snr.font.name = 'Segoe UI'
        snr.font.size = Pt(8.5)
        snr.font.bold = True
        snr.font.color.rgb = C_TEXT_MUTED

        # Prev / Next Action Buttons
        prev_idx = max(0, slide_index - 1)
        next_idx = min(10, slide_index + 1)
        add_button(slide, Inches(10.85), Inches(6.90), Inches(0.85), Inches(0.32), "◀ Prev", C_CARD_BG, C_TEXT_MAIN, slides[prev_idx], font_size=8.5, bold=True, border_color=C_CARD_BORDER)
        add_button(slide, Inches(11.8), Inches(6.90), Inches(0.85), Inches(0.32), "Next ▶", C_PRIMARY, RGBColor(255, 255, 255), slides[next_idx], font_size=8.5, bold=True)

    # =========================================================================
    # SLIDE 1: INTERACTIVE LANDING PAGE (COVER SLIDE)
    # =========================================================================
    s1 = slides[0]
    set_slide_background(s1, with_watermark=True)
    add_navigation_chrome(s1, 0, "Interactive Landing Page", "National AI Compliance Portal")

    # Hero Card (Left 60%)
    add_card(s1, Inches(0.5), Inches(1.15), Inches(7.6), Inches(5.5), C_CARD_BG, C_CARD_BORDER)

    # Prominent SIH 2026 & Ministry of Consumer Affairs Cover Banner
    add_card(s1, Inches(0.9), Inches(1.35), Inches(6.8), Inches(0.65), C_EMERALD_LIGHT, C_EMERALD)
    
    # Embed Ministry Logo on Cover Pill
    if os.path.exists(IMG_MINISTRY_LOGO):
        try:
            s1.shapes.add_picture(IMG_MINISTRY_LOGO, Inches(1.0), Inches(1.40), Inches(0.95), Inches(0.52))
        except Exception:
            pass

    # Embed SIH Official Logo on Cover Pill
    if os.path.exists(IMG_SIH_LOGO):
        try:
            s1.shapes.add_picture(IMG_SIH_LOGO, Inches(2.05), Inches(1.40), Inches(0.95), Inches(0.52))
        except Exception:
            pass

    tb_cover_tag = s1.shapes.add_textbox(Inches(3.1), Inches(1.42), Inches(4.5), Inches(0.5))
    tf_c = tb_cover_tag.text_frame
    p = tf_c.paragraphs[0]
    r = p.add_run()
    r.text = "SMART INDIA HACKATHON 2026\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    p2 = tf_c.add_paragraph()
    r2 = p2.add_run()
    r2.text = "Problem ID: SIH26034 • Ministry of Consumer Affairs"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(8.5)
    r2.font.bold = True
    r2.font.color.rgb = C_TEXT_MAIN

    # Main Headline
    tb_head = s1.shapes.add_textbox(Inches(0.9), Inches(2.15), Inches(6.8), Inches(1.1))
    tf_head = tb_head.text_frame
    tf_head.word_wrap = True
    p = tf_head.paragraphs[0]
    r = p.add_run()
    r.text = "Scan. Verify. Comply.\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(26)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MAIN

    r2 = p.add_run()
    r2.text = "AI-Powered Product Label Compliance & Consumer Protection"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(15)
    r2.font.bold = True
    r2.font.color.rgb = C_PRIMARY

    # Subtitle Paragraph
    tb_sub = s1.shapes.add_textbox(Inches(0.9), Inches(3.35), Inches(6.8), Inches(1.1))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    p = tf_sub.paragraphs[0]
    r = p.add_run()
    r.text = "Empowering Indian citizens and regulatory enforcement officers with sub-second OCR extraction and deterministic regulatory validation against Legal Metrology Rules 2011 and FSSAI 2020 frameworks."
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11)
    r.font.color.rgb = C_TEXT_MUTED

    # Hero Action Buttons
    add_button(s1, Inches(0.9), Inches(4.55), Inches(2.1), Inches(0.55), "🚀 Start Live Demo", C_PRIMARY, RGBColor(255, 255, 255), slides[3], font_size=11.5, bold=True)
    add_button(s1, Inches(3.15), Inches(4.55), Inches(2.1), Inches(0.55), "📖 Explore Solution", C_CARD_BG, C_PRIMARY, slides[2], font_size=11.5, bold=True, border_color=C_PRIMARY)
    add_button(s1, Inches(5.4), Inches(4.55), Inches(2.1), Inches(0.55), "🏛️ View Architecture", C_CARD_BG, C_TEXT_MAIN, slides[4], font_size=11.5, bold=True, border_color=C_CARD_BORDER)

    # Metrics Highlights Pill Row
    m_x = Inches(0.9)
    metrics_data = [
        ("22+ Rules", "Legal Metrology & FSSAI"),
        ("100%", "Deterministic Logic"),
        ("< 3 Sec", "Dual OCR Pipeline"),
    ]
    for m_val, m_lbl in metrics_data:
        add_card(s1, m_x, Inches(5.35), Inches(2.1), Inches(1.0), C_PRIMARY_LIGHT, None)
        tb_m = s1.shapes.add_textbox(m_x + Inches(0.1), Inches(5.42), Inches(1.9), Inches(0.85))
        tf_m = tb_m.text_frame
        p1 = tf_m.paragraphs[0]
        r = p1.add_run()
        r.text = m_val + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(15)
        r.font.bold = True
        r.font.color.rgb = C_PRIMARY

        p2 = tf_m.add_paragraph()
        r2 = p2.add_run()
        r2.text = m_lbl
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = C_TEXT_MUTED
        m_x += Inches(2.25)

    # Right Showcase Card (Hero Mockup Simulation)
    add_card(s1, Inches(8.3), Inches(1.15), Inches(4.533), Inches(5.5), C_DARK_PANEL, None)
    
    # Scanner HUD Mockup elements
    add_card(s1, Inches(8.6), Inches(1.45), Inches(3.933), Inches(3.3), RGBColor(30, 41, 59), RGBColor(51, 65, 85))
    
    # Viewfinder text
    tb_hud = s1.shapes.add_textbox(Inches(8.8), Inches(1.6), Inches(3.5), Inches(2.9))
    tf_hud = tb_hud.text_frame
    tf_hud.word_wrap = True
    p = tf_hud.paragraphs[0]
    r = p.add_run()
    r.text = "🎯 [AR FORENSIC INSPECTION HUD]\n\n"
    r.font.name = 'Consolas'
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    r2 = p.add_run()
    r2.text = "• Target: Packaged Food Commodity\n• OCR Bounding Boxes: 6 Detected\n• MRP & Net Qty: Isolated ✓\n• FSSAI Lic Number: Verified ✓\n• Expiry / Mfg Date: Flagged ⚠️\n\nLive Reticle Coordinates: X: 420, Y: 680"
    r2.font.name = 'Consolas'
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = RGBColor(226, 232, 240)

    # Bottom score highlight inside dark panel
    add_card(s1, Inches(8.6), Inches(4.95), Inches(3.933), Inches(1.45), RGBColor(24, 34, 53), RGBColor(51, 65, 85))
    tb_sc = s1.shapes.add_textbox(Inches(8.8), Inches(5.05), Inches(3.5), Inches(1.25))
    tf_sc = tb_sc.text_frame
    p = tf_sc.paragraphs[0]
    r = p.add_run()
    r.text = "Statutory Score: 82% (High Compliance)\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = C_AMBER

    r2 = p.add_run()
    r2.text = "Evaluation: Passed 12 of 14 mandatory labelling checks. Minor manufacturing date ambiguity flagged for inspection review."
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = RGBColor(203, 213, 225)

    # =========================================================================
    # SLIDE 2: THE PROBLEM (WHY LABEL COMPLIANCE IS BROKEN)
    # =========================================================================
    s2 = slides[1]
    set_slide_background(s2, with_watermark=True)
    add_navigation_chrome(s2, 1, "The Problem Statement", "Problem Context")

    # Section Title Card
    add_card(s2, Inches(0.5), Inches(1.15), Inches(12.333), Inches(0.85), C_RED_LIGHT, C_RED)
    tb_prob_h = s2.shapes.add_textbox(Inches(0.7), Inches(1.22), Inches(11.9), Inches(0.7))
    tf = tb_prob_h.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "⚠️ THE PROBLEM: Why Packaged Product Label Verification Fails at Scale\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = C_RED

    r2 = p.add_run()
    r2.text = "Millions of consumer commodities hit retail shelves daily with missing, deceptive, or non-compliant statutory declarations."
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(10.5)
    r2.font.color.rgb = C_TEXT_MUTED

    # 4 Problem Cards Grid (2x2)
    problems = [
        ("1. Consumer Information Asymmetry", 
         "Everyday citizens cannot decipher complex statutory codes, E-numbers, font height minimums, or mandatory declaration positions required under Legal Metrology Rules.",
         "❌ 85%+ consumers cannot detect missing declarations manually.", C_AMBER, C_AMBER_LIGHT),
        
        ("2. Enforcement Inspection Bottleneck", 
         "Manual retail inspections by enforcement officers are time-consuming and cover less than 1% of products in circulating markets.",
         "❌ Physical spot-audits cannot scale across 100M+ retail SKUs.", C_RED, C_RED_LIGHT),
        
        ("3. Complex Multi-Agency Regulations", 
         "Rules are fragmented across Legal Metrology Act 2009, FSSAI Labelling Regulations 2020, and CDSCO Cosmetic mandates with differing requirements.",
         "❌ Cross-regulatory confusion leads to rampant non-compliance.", C_PRIMARY, C_PRIMARY_LIGHT),
        
        ("4. Consumer Safety & Financial Harm", 
         "Missing allergen warnings, deceptive net quantities, altered MRPs, and fake 14-digit FSSAI numbers directly compromise public health and consumer trust.",
         "❌ Severe statutory liability under Section 36(1) of LM Act.", C_RED, C_RED_LIGHT),
    ]

    p_positions = [
        (Inches(0.5), Inches(2.15)),
        (Inches(6.8), Inches(2.15)),
        (Inches(0.5), Inches(4.35)),
        (Inches(6.8), Inches(4.35)),
    ]

    for i, (title, desc, stat, color, bg_col) in enumerate(problems):
        px, py = p_positions[i]
        add_card(s2, px, py, Inches(6.033), Inches(2.0), C_CARD_BG, C_CARD_BORDER)
        
        # Left accent stripe
        add_card(s2, px, py, Inches(0.12), Inches(2.0), color, None)

        tb_pc = s2.shapes.add_textbox(px + Inches(0.25), py + Inches(0.15), Inches(5.6), Inches(1.7))
        tf_pc = tb_pc.text_frame
        tf_pc.word_wrap = True
        
        p = tf_pc.paragraphs[0]
        r = p.add_run()
        r.text = title + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(12.5)
        r.font.bold = True
        r.font.color.rgb = color

        p2 = tf_pc.add_paragraph()
        r2 = p2.add_run()
        r2.text = desc + "\n"
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = C_TEXT_MAIN

        p3 = tf_pc.add_paragraph()
        r3 = p3.add_run()
        r3.text = stat
        r3.font.name = 'Segoe UI'
        r3.font.size = Pt(9)
        r3.font.bold = True
        r3.font.color.rgb = color

    # Bottom Callout & Next CTA
    add_button(s2, Inches(9.8), Inches(6.4), Inches(3.033), Inches(0.4), "👉 See Our Solution (CompliScan AI)", C_PRIMARY, RGBColor(255, 255, 255), slides[2], font_size=10.5, bold=True)

    # =========================================================================
    # SLIDE 3: OUR SOLUTION (COMPLISCAN AI PLATFORM OVERVIEW)
    # =========================================================================
    s3 = slides[2]
    set_slide_background(s3, with_watermark=True)
    add_navigation_chrome(s3, 2, "Our Solution", "Platform Capabilities")

    # Workflow 3-Step Banner
    add_card(s3, Inches(0.5), Inches(1.15), Inches(12.333), Inches(1.4), C_PRIMARY_LIGHT, C_PRIMARY)
    tb_wf = s3.shapes.add_textbox(Inches(0.7), Inches(1.22), Inches(11.9), Inches(1.2))
    tf = tb_wf.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "THE COMPLISCAN AI SOLUTION: 3-Step Automated Verification Pipeline\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(13.5)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    # 3 Workflow Pills inside banner
    wf_steps = [
        ("Step 1: Upload Image", "Capture packaging front, back, or nutrition panel via camera or upload.", Inches(0.8), C_CARD_BG),
        ("Step 2: AI Parsing", "Dual-Engine OCR extracts text; Groq LLM normalizes into structured JSON.", Inches(4.7), C_CARD_BG),
        ("Step 3: Rule Audit", "Deterministic Engine validates against 22+ statutory rules & outputs PDF dossier.", Inches(8.6), C_EMERALD_LIGHT),
    ]
    for st_title, st_desc, st_x, st_bg in wf_steps:
        add_card(s3, st_x, Inches(1.58), Inches(3.7), Inches(0.85), st_bg, C_CARD_BORDER)
        tb_st = s3.shapes.add_textbox(st_x + Inches(0.1), Inches(1.62), Inches(3.5), Inches(0.75))
        tf_st = tb_st.text_frame
        tf_st.word_wrap = True
        p1 = tf_st.paragraphs[0]
        r1 = p1.add_run()
        r1.text = st_title + "\n"
        r1.font.name = 'Segoe UI'
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = C_TEXT_MAIN

        p2 = tf_st.add_paragraph()
        r2 = p2.add_run()
        r2.text = st_desc
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = C_TEXT_MUTED

    # 6 Feature Pillars Grid
    pillars = [
        ("🔍 Dual-Engine OCR", "Combines Tesseract & Gemini Vision for Hindi and English label character extraction.", C_PRIMARY),
        ("🤖 AI Structuring Assistant", "Structures unorganized OCR tokens into normalized JSON key-value pairs without hallucinations.", C_PRIMARY),
        ("⚖️ Deterministic Law Engine", "100% rule-based deterministic evaluation against Legal Metrology & FSSAI statutory regulations.", C_EMERALD),
        ("📊 0–100% Compliance Score", "Clear quantitative metric indicating legal packaging compliance and consumer safety risk.", C_EMERALD),
        ("🚨 Section 36 Penalty Estimator", "Automated financial liability calculation for manufacturer non-compliance under LM Act 2009.", C_AMBER),
        ("📑 1-Click Complaint Dispatch", "Automated formal complaint generation and forwarding to National Consumer Helpline 1915.", C_AMBER),
    ]

    pill_x_coords = [Inches(0.5), Inches(4.65), Inches(8.8)]
    pill_y_coords = [Inches(2.75), Inches(4.75)]

    for idx, (p_title, p_desc, p_col) in enumerate(pillars):
        px = pill_x_coords[idx % 3]
        py = pill_y_coords[idx // 3]
        add_card(s3, px, py, Inches(4.033), Inches(1.85), C_CARD_BG, C_CARD_BORDER)
        
        tb_p = s3.shapes.add_textbox(px + Inches(0.2), py + Inches(0.15), Inches(3.633), Inches(1.55))
        tf_p = tb_p.text_frame
        tf_p.word_wrap = True
        p = tf_p.paragraphs[0]
        r = p.add_run()
        r.text = p_title + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = p_col

        p2 = tf_p.add_paragraph()
        r2 = p2.add_run()
        r2.text = p_desc
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(9)
        r2.font.color.rgb = C_TEXT_MUTED

    # CTA Button
    add_button(s3, Inches(9.8), Inches(6.35), Inches(3.033), Inches(0.4), "▶ Try Live Scan Simulation", C_EMERALD, RGBColor(255, 255, 255), slides[3], font_size=10.5, bold=True)

    # =========================================================================
    # SLIDE 4: LIVE SCAN SIMULATION
    # =========================================================================
    s4 = slides[3]
    set_slide_background(s4, with_watermark=True)
    add_navigation_chrome(s4, 3, "Live Scan Simulation", "Scanning Interface")

    # Left Panel: Product Package Preview with Holographic Reticle
    add_card(s4, Inches(0.5), Inches(1.15), Inches(5.0), Inches(5.5), C_CARD_BG, C_CARD_BORDER)
    
    tb_sp = s4.shapes.add_textbox(Inches(0.7), Inches(1.25), Inches(4.6), Inches(0.4))
    p = tb_sp.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "📸 Uploaded Label: Packaged Wheat Flour (5kg)"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MAIN

    # Simulated Product Box Container
    add_card(s4, Inches(0.8), Inches(1.75), Inches(4.4), Inches(4.0), RGBColor(241, 245, 249), RGBColor(203, 213, 225))
    
    # Bounding Box Overlays
    add_card(s4, Inches(1.0), Inches(2.0), Inches(3.2), Inches(0.7), RGBColor(236, 253, 245), C_EMERALD, border_width=1.5)
    tb_b1 = s4.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(3.1), Inches(0.6))
    p = tb_b1.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "🏷️ BRAND: Annapurna Pure Atta (Rule 6(1)(a) PASS)"
    r.font.name = 'Consolas'
    r.font.size = Pt(8)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    add_card(s4, Inches(1.0), Inches(2.85), Inches(2.0), Inches(0.6), RGBColor(236, 253, 245), C_EMERALD, border_width=1.5)
    tb_b2 = s4.shapes.add_textbox(Inches(1.05), Inches(2.9), Inches(1.9), Inches(0.5))
    p = tb_b2.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "⚖️ Net Qty: 5 kg\n(Rule 6(1)(b) PASS)"
    r.font.name = 'Consolas'
    r.font.size = Pt(7.5)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    add_card(s4, Inches(3.1), Inches(2.85), Inches(1.9), Inches(0.6), RGBColor(236, 253, 245), C_EMERALD, border_width=1.5)
    tb_b3 = s4.shapes.add_textbox(Inches(3.15), Inches(2.9), Inches(1.8), Inches(0.5))
    p = tb_b3.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "💵 MRP: Rs. 240.00\n(Rule 6(1)(e) PASS)"
    r.font.name = 'Consolas'
    r.font.size = Pt(7.5)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    add_card(s4, Inches(1.0), Inches(3.6), Inches(3.9), Inches(0.65), RGBColor(254, 226, 226), C_RED, border_width=1.5)
    tb_b4 = s4.shapes.add_textbox(Inches(1.05), Inches(3.65), Inches(3.8), Inches(0.55))
    p = tb_b4.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "⚠️ MFG DATE: 'BEST BEFORE 4 MONTHS' (No Date Specified)\nRule 6(1)(d) VIOLATION DETECTED"
    r.font.name = 'Consolas'
    r.font.size = Pt(7.5)
    r.font.bold = True
    r.font.color.rgb = C_RED

    add_card(s4, Inches(1.0), Inches(4.4), Inches(3.9), Inches(0.65), RGBColor(254, 243, 199), C_AMBER, border_width=1.5)
    tb_b5 = s4.shapes.add_textbox(Inches(1.05), Inches(4.45), Inches(3.8), Inches(0.55))
    p = tb_b5.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "🔍 FSSAI LIC: 10019082000142 (14 Digits Detected)\nChecksum Check: Valid format • Needs DB sync"
    r.font.name = 'Consolas'
    r.font.size = Pt(7.5)
    r.font.bold = True
    r.font.color.rgb = C_AMBER

    add_button(s4, Inches(0.8), Inches(5.9), Inches(4.4), Inches(0.55), "🔍 Holographic AR Reticle Active (X: 380, Y: 520)", C_DARK_PANEL, RGBColor(255, 255, 255), None, font_size=9)

    # Right Panel: Stages
    add_card(s4, Inches(5.7), Inches(1.15), Inches(7.133), Inches(5.5), C_CARD_BG, C_CARD_BORDER)

    add_card(s4, Inches(5.9), Inches(1.35), Inches(6.733), Inches(1.65), RGBColor(248, 250, 252), C_CARD_BORDER)
    tb_st1 = s4.shapes.add_textbox(Inches(6.05), Inches(1.42), Inches(6.4), Inches(1.5))
    tf_st1 = tb_st1.text_frame
    tf_st1.word_wrap = True
    p = tf_st1.paragraphs[0]
    r = p.add_run()
    r.text = "STAGE 1: Dual-Engine OCR Raw Extraction (Gemini + Tesseract)\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    r2 = p.add_run()
    r2.text = "RAW TOKENS: [ANNAPURNA PURE ATTA] [NET QTY 5kg] [MRP Rs 240.00 INCL OF ALL TAXES] [PKD 08/26] [BEST BEFORE 4 MONTHS FROM PACKAGING] [FSSAI LIC NO 10019082000142] [MKT BY HIND CONSUMER PVT LTD MUMBAI 400001]"
    r2.font.name = 'Consolas'
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = C_TEXT_MUTED

    add_card(s4, Inches(5.9), Inches(3.15), Inches(6.733), Inches(1.95), RGBColor(15, 23, 42), None)
    tb_st2 = s4.shapes.add_textbox(Inches(6.05), Inches(3.22), Inches(6.4), Inches(1.8))
    tf_st2 = tb_st2.text_frame
    tf_st2.word_wrap = True
    p = tf_st2.paragraphs[0]
    r = p.add_run()
    r.text = "STAGE 2: Groq Structured JSON Normalization (No Legal Hallucinations)\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    r2 = p.add_run()
    r2.text = '{\n  "productName": "Annapurna Pure Atta",\n  "category": "Food",\n  "netQuantity": "5 kg",\n  "mrp": "Rs. 240.00",\n  "mfgDate": null, // Flagged: Missing specific calendar date\n  "fssaiNumber": "10019082000142"\n}'
    r2.font.name = 'Consolas'
    r2.font.size = Pt(8)
    r2.font.color.rgb = RGBColor(226, 232, 240)

    add_button(s4, Inches(5.9), Inches(5.35), Inches(6.733), Inches(0.6), "⚖️ Analyze Compliance (Run Deterministic Rule Engine) ➔", C_PRIMARY, RGBColor(255, 255, 255), slides[4], font_size=11.5, bold=True)

    # =========================================================================
    # SLIDE 5: AI + DETERMINISTIC RULE ENGINE ARCHITECTURE
    # =========================================================================
    s5 = slides[4]
    set_slide_background(s5, with_watermark=True)
    add_navigation_chrome(s5, 4, "System Architecture", "AI vs Law Separation")

    add_card(s5, Inches(0.5), Inches(1.15), Inches(12.333), Inches(0.75), C_EMERALD_LIGHT, C_EMERALD)
    tb_arch_b = s5.shapes.add_textbox(Inches(0.7), Inches(1.22), Inches(11.9), Inches(0.6))
    tf = tb_arch_b.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "CORE ARCHITECTURAL PRINCIPLE: AI Extracts Text • Manually Defined Rule Engine Decides Legality\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(12.5)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    r2 = p.add_run()
    r2.text = "Groq is strictly an NLP extraction accelerator. Final legal compliance is computed 100% deterministically against official Gazette rules."
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = C_TEXT_MUTED

    flow_steps = [
        ("1. Input Image", "Packaging capture / upload", C_PRIMARY_LIGHT, C_PRIMARY),
        ("2. Dual OCR", "Tesseract & Gemini Vision", C_PRIMARY_LIGHT, C_PRIMARY),
        ("3. Groq JSON", "Normalizes key-value schema", C_AMBER_LIGHT, C_AMBER),
        ("4. Category Engine", "Maps Food / Oil / Cosmetics", C_AMBER_LIGHT, C_AMBER),
        ("5. Rule Database", "Legal Metrology & FSSAI Acts", C_EMERALD_LIGHT, C_EMERALD),
        ("6. Deterministic Audit", "100% Law-encoded checks", C_EMERALD_LIGHT, C_EMERALD),
        ("7. Official Report", "Score & Section 36 Dossier", C_PRIMARY_LIGHT, C_PRIMARY),
    ]

    fx = Inches(0.5)
    fw = Inches(1.58)
    for title, desc, bg, col in flow_steps:
        add_card(s5, fx, Inches(2.1), fw, Inches(1.5), bg, col)
        tb_f = s5.shapes.add_textbox(fx + Inches(0.08), Inches(2.2), fw - Inches(0.16), Inches(1.3))
        tf_f = tb_f.text_frame
        tf_f.word_wrap = True
        p = tf_f.paragraphs[0]
        r = p.add_run()
        r.text = title + "\n\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = col

        p2 = tf_f.add_paragraph()
        r2 = p2.add_run()
        r2.text = desc
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8)
        r2.font.color.rgb = C_TEXT_MAIN
        fx += Inches(1.79)

    add_card(s5, Inches(0.5), Inches(3.85), Inches(5.95), Inches(2.4), C_CARD_BG, C_CARD_BORDER)
    tb_ai = s5.shapes.add_textbox(Inches(0.7), Inches(3.95), Inches(5.5), Inches(2.2))
    tf_ai = tb_ai.text_frame
    tf_ai.word_wrap = True
    p = tf_ai.paragraphs[0]
    r = p.add_run()
    r.text = "🤖 AI Extraction Layer (OCR.Space + Groq Llama-3)\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    p2 = tf_ai.add_paragraph()
    r2 = p2.add_run()
    r2.text = "• OCR.Space / Gemini Vision: Handles multi-font image text extraction in Hindi & English.\n• Groq Fast Inference: Parses noisy OCR lines into standard JSON fields without inventing facts.\n• Failover Resilience: Deterministic regex fallback if Groq API hits rate limit (429-immunity)."
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(9)
    r2.font.color.rgb = C_TEXT_MAIN

    add_card(s5, Inches(6.85), Inches(3.85), Inches(5.95), Inches(2.4), C_CARD_BG, C_CARD_BORDER)
    tb_law = s5.shapes.add_textbox(Inches(7.05), Inches(3.95), Inches(5.5), Inches(2.2))
    tf_law = tb_law.text_frame
    tf_law.word_wrap = True
    p = tf_law.paragraphs[0]
    r = p.add_run()
    r.text = "⚖️ Deterministic Legal Rule Engine (Official Standards)\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    p2 = tf_law.add_paragraph()
    r2 = p2.add_run()
    r2.text = "• Legal Metrology (Packaged Commodities) Rules 2011 (Rule 6(1) a-g declarations).\n• FSSAI Labelling & Display Regulations 2020 (Veg/Non-veg logo, 14-digit license, nutrients).\n• 100% Objective Scoring: Rules evaluate through strict Boolean and regex formulas.\n• Zero Legal Hallucinations: No AI guesswork in statutory penalization."
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(9)
    r2.font.color.rgb = C_TEXT_MAIN

    add_button(s5, Inches(9.8), Inches(6.4), Inches(3.033), Inches(0.4), "📊 View Compliance Dashboard", C_PRIMARY, RGBColor(255, 255, 255), slides[5], font_size=10, bold=True)

    # =========================================================================
    # SLIDE 6: COMPLIANCE DASHBOARD
    # =========================================================================
    s6 = slides[5]
    set_slide_background(s6, with_watermark=True)
    add_navigation_chrome(s6, 5, "Compliance Dashboard", "Audit Results")

    add_card(s6, Inches(0.5), Inches(1.15), Inches(4.2), Inches(5.5), C_CARD_BG, C_CARD_BORDER)
    
    add_card(s6, Inches(0.8), Inches(1.35), Inches(3.6), Inches(1.6), C_AMBER_LIGHT, C_AMBER)
    tb_sc_box = s6.shapes.add_textbox(Inches(0.9), Inches(1.45), Inches(3.4), Inches(1.4))
    tf = tb_sc_box.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "82%\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(34)
    r.font.bold = True
    r.font.color.rgb = C_AMBER

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    r2 = p2.add_run()
    r2.text = "POTENTIAL NON-COMPLIANCE"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(10.5)
    r2.font.bold = True
    r2.font.color.rgb = C_AMBER

    summary_items = [
        ("12", "Passed", C_EMERALD, C_EMERALD_LIGHT),
        ("2", "Violations", C_RED, C_RED_LIGHT),
        ("1", "Needs Review", C_AMBER, C_AMBER_LIGHT),
        ("0", "Not Applicable", C_TEXT_MUTED, C_BG_PAGE),
    ]
    sx_coords = [Inches(0.8), Inches(2.65)]
    sy_coords = [Inches(3.15), Inches(4.15)]
    for idx, (cnt, lbl, col, bg) in enumerate(summary_items):
        sx = sx_coords[idx % 2]
        sy = sy_coords[idx // 2]
        add_card(s6, sx, sy, Inches(1.75), Inches(0.85), bg, col)
        tb_sm = s6.shapes.add_textbox(sx + Inches(0.1), sy + Inches(0.08), Inches(1.55), Inches(0.7))
        tf_sm = tb_sm.text_frame
        p = tf_sm.paragraphs[0]
        r = p.add_run()
        r.text = cnt + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(15)
        r.font.bold = True
        r.font.color.rgb = col

        p2 = tf_sm.add_paragraph()
        r2 = p2.add_run()
        r2.text = lbl
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8)
        r2.font.color.rgb = C_TEXT_MAIN

    add_card(s6, Inches(0.8), Inches(5.15), Inches(3.6), Inches(1.3), C_RED_LIGHT, C_RED)
    tb_liab = s6.shapes.add_textbox(Inches(0.9), Inches(5.2), Inches(3.4), Inches(1.2))
    tf_liab = tb_liab.text_frame
    tf_liab.word_wrap = True
    p = tf_liab.paragraphs[0]
    r = p.add_run()
    r.text = "⚖️ Section 36(1) LM Act Liability:\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = C_RED

    r2 = p.add_run()
    r2.text = "Missing manufacturing date renders commodity liable for First Offence Notice (₹25,000 compounding penalty)."
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = C_TEXT_MAIN

    add_card(s6, Inches(4.9), Inches(1.15), Inches(7.933), Inches(5.5), C_CARD_BG, C_CARD_BORDER)
    
    add_card(s6, Inches(5.1), Inches(1.3), Inches(7.533), Inches(0.4), C_BG_PAGE, C_CARD_BORDER)
    tb_th = s6.shapes.add_textbox(Inches(5.2), Inches(1.35), Inches(7.3), Inches(0.35))
    p = tb_th.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "RULE ID        MANDATORY STATUTORY DECLARATION         OBSERVED VALUE              STATUS"
    r.font.name = 'Consolas'
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MAIN

    checks = [
        ("LM-001", "Name & Description of Commodity", "Annapurna Pure Wheat Atta", "✓ PASS", C_EMERALD_LIGHT, C_EMERALD),
        ("LM-002", "Net Quantity & Units Declaration", "5 kg (Metric Units Compliant)", "✓ PASS", C_EMERALD_LIGHT, C_EMERALD),
        ("LM-003", "Maximum Retail Price (MRP incl. taxes)", "Rs. 240.00 (Inclusive of all taxes)", "✓ PASS", C_EMERALD_LIGHT, C_EMERALD),
        ("LM-004", "Manufacturer & Packer Address", "Hind Consumer Pvt Ltd, Mumbai", "✓ PASS", C_EMERALD_LIGHT, C_EMERALD),
        ("LM-005", "Month & Year of Manufacture", "Missing specific calendar date", "✕ FAIL", C_RED_LIGHT, C_RED),
        ("FSSAI-01", "14-Digit FSSAI License Number", "10019082000142 (Format valid)", "✓ PASS", C_EMERALD_LIGHT, C_EMERALD),
        ("FSSAI-02", "Vegetarian / Non-Vegetarian Logo", "Green square with green dot found", "✓ PASS", C_EMERALD_LIGHT, C_EMERALD),
    ]

    cy = Inches(1.8)
    for rid, rname, robs, rstat, bg, col in checks:
        add_card(s6, Inches(5.1), cy, Inches(7.533), Inches(0.55), bg, C_CARD_BORDER)
        tb_r = s6.shapes.add_textbox(Inches(5.2), cy + Inches(0.08), Inches(7.3), Inches(0.42))
        tf_r = tb_r.text_frame
        p = tf_r.paragraphs[0]
        
        r1 = p.add_run()
        r1.text = f"{rid:<12} {rname:<38} {robs:<30} "
        r1.font.name = 'Segoe UI'
        r1.font.size = Pt(9)
        r1.font.color.rgb = C_TEXT_MAIN

        r2 = p.add_run()
        r2.text = rstat
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(9.5)
        r2.font.bold = True
        r2.font.color.rgb = col
        cy += Inches(0.62)

    add_button(s6, Inches(9.8), Inches(6.35), Inches(3.033), Inches(0.4), "📑 View Violation & Complaint Report", C_PRIMARY, RGBColor(255, 255, 255), slides[6], font_size=10, bold=True)

    # =========================================================================
    # SLIDE 7: VIOLATION + COMPLAINT REPORT
    # =========================================================================
    s7 = slides[6]
    set_slide_background(s7, with_watermark=True)
    add_navigation_chrome(s7, 6, "Violation & Complaint Dossier", "Enforcement Report")

    add_card(s7, Inches(0.5), Inches(1.15), Inches(6.0), Inches(5.5), C_CARD_BG, C_CARD_BORDER)
    
    add_card(s7, Inches(0.7), Inches(1.35), Inches(5.6), Inches(1.2), C_PRIMARY_LIGHT, C_PRIMARY)
    
    if os.path.exists(IMG_MINISTRY_LOGO):
        try:
            s7.shapes.add_picture(IMG_MINISTRY_LOGO, Inches(0.8), Inches(1.4), Inches(0.85), Inches(0.48))
        except Exception:
            pass

    tb_rep_h = s7.shapes.add_textbox(Inches(1.7), Inches(1.4), Inches(4.5), Inches(1.1))
    tf = tb_rep_h.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "🏛️ MINISTRY OF CONSUMER AFFAIRS\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    r2 = p.add_run()
    r2.text = "STATUTORY LABELLING INSPECTION DOSSIER\n"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(11)
    r2.font.bold = True
    r2.font.color.rgb = C_TEXT_MAIN

    r3 = p.add_run()
    r3.text = "Dossier ID: #SIH26-CMP-84920 • Verified by CompliScan AI"
    r3.font.name = 'Segoe UI'
    r3.font.size = Pt(8)
    r3.font.color.rgb = C_TEXT_MUTED

    tb_rep_body = s7.shapes.add_textbox(Inches(0.7), Inches(2.7), Inches(5.6), Inches(3.7))
    tf_rb = tb_rep_body.text_frame
    tf_rb.word_wrap = True
    p = tf_rb.paragraphs[0]
    r = p.add_run()
    r.text = "PRODUCT AUDIT SUMMARY:\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MAIN

    r2 = p.add_run()
    r2.text = "• Product: Annapurna Pure Wheat Atta (5 kg)\n• Category: Food Commodities (Legal Metrology Group 1)\n• Overall Compliance Score: 82% (Potential Non-Compliance)\n\n"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = C_TEXT_MUTED

    r3 = p.add_run()
    r3.text = "IDENTIFIED STATUTORY VIOLATION:\n"
    r3.font.name = 'Segoe UI'
    r3.font.size = Pt(10.5)
    r3.font.bold = True
    r3.font.color.rgb = C_RED

    r4 = p.add_run()
    r4.text = "• Violation: Missing Manufacturing Date on Principal Display Panel.\n• Legal Citation: Rule 6(1)(d) of Legal Metrology (PC) Rules 2011.\n• Liability: Section 36(1) of Legal Metrology Act 2009 (₹25,000 Notice).\n• Recommended Action: Issue Statutory Show-Cause Notice to Manufacturer."
    r4.font.name = 'Segoe UI'
    r4.font.size = Pt(9.5)
    r4.font.color.rgb = C_TEXT_MAIN

    add_card(s7, Inches(6.8), Inches(1.15), Inches(6.033), Inches(5.5), C_CARD_BG, C_CARD_BORDER)

    tb_flow_h = s7.shapes.add_textbox(Inches(7.0), Inches(1.35), Inches(5.6), Inches(0.6))
    p = tb_flow_h.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "🚨 1-Click Regulatory Enforcement Dispatch Workflow"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(12.5)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    c_steps = [
        ("1. Evidence Auto-Packaging", "Original packaging image, OCR bounding boxes, and timestamped audit logs are hashed for court admissibility.", C_PRIMARY_LIGHT),
        ("2. Multi-Agency Forwarding", "Direct API integration forwards dossier to National Consumer Helpline (1915), INGRAM, and State Metrology Controllers.", C_EMERALD_LIGHT),
        ("3. Show-Cause Auto-Drafting", "Generates ready-to-sign Legal Notice citing Section 36(1) for enforcement officer dispatch.", C_AMBER_LIGHT),
    ]

    cs_y = Inches(2.05)
    for st_title, st_desc, bg in c_steps:
        add_card(s7, Inches(7.0), cs_y, Inches(5.6), Inches(1.15), bg, C_CARD_BORDER)
        tb_cs = s7.shapes.add_textbox(Inches(7.15), cs_y + Inches(0.1), Inches(5.3), Inches(0.95))
        tf_cs = tb_cs.text_frame
        tf_cs.word_wrap = True
        p = tf_cs.paragraphs[0]
        r = p.add_run()
        r.text = st_title + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = C_TEXT_MAIN

        p2 = tf_cs.add_paragraph()
        r2 = p2.add_run()
        r2.text = st_desc
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = C_TEXT_MUTED
        cs_y += Inches(1.3)

    add_button(s7, Inches(7.0), Inches(5.95), Inches(5.6), Inches(0.55), "🚀 Submit Complaint to Enforcement Portal", C_RED, RGBColor(255, 255, 255), slides[7], font_size=11.5, bold=True)

    # =========================================================================
    # SLIDE 8: ENFORCEMENT OFFICIAL DASHBOARD
    # =========================================================================
    s8 = slides[7]
    set_slide_background(s8, with_watermark=True)
    add_navigation_chrome(s8, 7, "Enforcement Official Dashboard", "Ministry Admin Command")

    m_cards = [
        ("1,248", "Total Audits Filed", "+14% MoM", C_PRIMARY, C_PRIMARY_LIGHT),
        ("241", "Critical Violations", "Seizure Alerts", C_RED, C_RED_LIGHT),
        ("89", "Notices Dispatched", "Sec 36 LM Act", C_AMBER, C_AMBER_LIGHT),
        ("78.4%", "National Avg Compliance", "Target >90%", C_EMERALD, C_EMERALD_LIGHT),
    ]

    mx = Inches(0.5)
    for val, lbl, sub, col, bg in m_cards:
        add_card(s8, mx, Inches(1.15), Inches(2.88), Inches(1.15), bg, col)
        tb_m = s8.shapes.add_textbox(mx + Inches(0.15), Inches(1.2), Inches(2.6), Inches(1.0))
        tf_m = tb_m.text_frame
        p = tf_m.paragraphs[0]
        r = p.add_run()
        r.text = val + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(19)
        r.font.bold = True
        r.font.color.rgb = col

        p2 = tf_m.add_paragraph()
        r2 = p2.add_run()
        r2.text = f"{lbl} ({sub})"
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8.5)
        r2.font.bold = True
        r2.font.color.rgb = C_TEXT_MAIN
        mx += Inches(3.15)

    add_card(s8, Inches(0.5), Inches(2.45), Inches(5.95), Inches(4.2), C_CARD_BG, C_CARD_BORDER)
    tb_cb_h = s8.shapes.add_textbox(Inches(0.7), Inches(2.55), Inches(5.5), Inches(0.5))
    p = tb_cb_h.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "📊 Category-wise Violation Distribution (Live Telemetry)"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MAIN

    cat_bars = [
        ("Packaged Food & Snacks", "42% Violations", Inches(4.5), C_RED),
        ("Edible Oils & Fats", "28% Violations", Inches(3.1), C_AMBER),
        ("Cosmetics & Personal Care", "18% Violations", Inches(2.0), C_PRIMARY),
        ("Household Cleaning Agents", "12% Violations", Inches(1.4), C_EMERALD),
    ]
    by = Inches(3.15)
    for cname, cstat, b_w, b_col in cat_bars:
        tb_c = s8.shapes.add_textbox(Inches(0.7), by, Inches(5.5), Inches(0.35))
        p = tb_c.text_frame.paragraphs[0]
        r = p.add_run()
        r.text = f"{cname} — {cstat}"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_TEXT_MAIN

        add_card(s8, Inches(0.7), by + Inches(0.32), Inches(5.5), Inches(0.2), C_BG_PAGE, None)
        add_card(s8, Inches(0.7), by + Inches(0.32), b_w, Inches(0.2), b_col, None)
        by += Inches(0.75)

    add_card(s8, Inches(6.85), Inches(2.45), Inches(5.95), Inches(4.2), C_CARD_BG, C_CARD_BORDER)
    tb_reg_h = s8.shapes.add_textbox(Inches(7.05), Inches(2.55), Inches(5.5), Inches(0.5))
    p = tb_reg_h.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "📑 Live Enforcement Registry (Recent Notices)"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MAIN

    reg_rows = [
        ("#CMP-8492", "Annapurna Atta", "Missing Mfg Date", "High (Notice)", C_RED),
        ("#CMP-8488", "Kisan Sunflower Oil", "No Net Wt @ 30°C", "High (Notice)", C_RED),
        ("#CMP-8479", "Glow Herbal Cream", "Missing CDSCO Lic", "Review", C_AMBER),
        ("#CMP-8462", "Fresh Choco Cookies", "Compliant Label", "Pass", C_EMERALD),
    ]
    ry = Inches(3.15)
    for cid, cprod, cissue, cstatus, col in reg_rows:
        add_card(s8, Inches(7.05), ry, Inches(5.55), Inches(0.65), C_BG_PAGE, C_CARD_BORDER)
        tb_r = s8.shapes.add_textbox(Inches(7.15), ry + Inches(0.08), Inches(5.35), Inches(0.5))
        tf_r = tb_r.text_frame
        p = tf_r.paragraphs[0]
        r1 = p.add_run()
        r1.text = f"{cid} | {cprod}\n"
        r1.font.name = 'Segoe UI'
        r1.font.size = Pt(9)
        r1.font.bold = True
        r1.font.color.rgb = C_TEXT_MAIN

        r2 = p.add_run()
        r2.text = f"Issue: {cissue}  •  Action: "
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8)
        r2.font.color.rgb = C_TEXT_MUTED

        r3 = p.add_run()
        r3.text = cstatus
        r3.font.name = 'Segoe UI'
        r3.font.size = Pt(8)
        r3.font.bold = True
        r3.font.color.rgb = col
        ry += Inches(0.78)

    add_button(s8, Inches(9.8), Inches(6.35), Inches(3.033), Inches(0.4), "🚀 Impact & Future Roadmap ➔", C_PRIMARY, RGBColor(255, 255, 255), slides[8], font_size=10.5, bold=True)

    # =========================================================================
    # SLIDE 9: IMPACT + FUTURE SCOPE
    # =========================================================================
    s9 = slides[8]
    set_slide_background(s9, with_watermark=True)
    add_navigation_chrome(s9, 8, "Impact & Future Roadmap", "Scalability & Roadmap")

    add_card(s9, Inches(0.5), Inches(1.15), Inches(5.95), Inches(5.5), C_CARD_BG, C_CARD_BORDER)
    
    add_card(s9, Inches(0.8), Inches(1.35), Inches(5.35), Inches(0.5), C_EMERALD_LIGHT, C_EMERALD)
    tb_imp_h = s9.shapes.add_textbox(Inches(0.9), Inches(1.4), Inches(5.1), Inches(0.4))
    p = tb_imp_h.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "✅ CURRENT MVP IMPACT (Delivered for SIH 2026)"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    impact_points = [
        ("⚡ Sub-Second Label Audits", "Reduces packaging inspection time from 20 minutes to under 3 seconds using dual OCR engines."),
        ("🛡️ Zero-Hallucination Legal Integrity", "Deterministic rule engine guarantees objective legal compliance without AI guesswork."),
        ("📑 Instant Evidentiary Dossiers", "Generates court-admissible PDF inspection certificates with Section 36 penalty estimations."),
        ("🎙️ Multilingual Accessibility", "Real-time Hindi & English voice audio readout for non-English literate consumers."),
    ]
    iy = Inches(2.05)
    for ititle, idesc in impact_points:
        add_card(s9, Inches(0.8), iy, Inches(5.35), Inches(0.95), C_BG_PAGE, C_CARD_BORDER)
        tb_i = s9.shapes.add_textbox(Inches(0.9), iy + Inches(0.08), Inches(5.15), Inches(0.8))
        tf_i = tb_i.text_frame
        tf_i.word_wrap = True
        p = tf_i.paragraphs[0]
        r = p.add_run()
        r.text = ititle + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = C_TEXT_MAIN

        p2 = tf_i.add_paragraph()
        r2 = p2.add_run()
        r2.text = idesc
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = C_TEXT_MUTED
        iy += Inches(1.08)

    add_card(s9, Inches(6.85), Inches(1.15), Inches(5.95), Inches(5.5), C_CARD_BG, C_CARD_BORDER)
    
    add_card(s9, Inches(7.15), Inches(1.35), Inches(5.35), Inches(0.5), C_PRIMARY_LIGHT, C_PRIMARY)
    tb_fut_h = s9.shapes.add_textbox(Inches(7.25), Inches(1.4), Inches(5.1), Inches(0.4))
    p = tb_fut_h.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "🔮 FUTURE SCOPE & NATIONAL SCALING ROADMAP"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    future_points = [
        ("📱 Native Mobile App & Barcode Scanner", "Direct camera integration with GS1 DataBar and 14-digit FSSAI FoSCoS live database sync."),
        ("🌐 22 Regional Indian Languages OCR", "Expanding label parsing support to Tamil, Bengali, Telugu, Marathi, and Gujarati."),
        ("🏛️ Automated Gazette Rule Synchronizer", "Web-scraper that auto-updates regulatory rule DB whenever Ministry issues new Gazette notifications."),
        ("📶 Edge AI Offline Inspector", "Enabling offline label inspection for field enforcement officers in remote rural markets."),
    ]
    fy = Inches(2.05)
    for ftitle, fdesc in future_points:
        add_card(s9, Inches(7.15), fy, Inches(5.35), Inches(0.95), C_BG_PAGE, C_CARD_BORDER)
        tb_f = s9.shapes.add_textbox(Inches(7.25), fy + Inches(0.08), Inches(5.15), Inches(0.8))
        tf_f = tb_f.text_frame
        tf_f.word_wrap = True
        p = tf_f.paragraphs[0]
        r = p.add_run()
        r.text = ftitle + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = C_PRIMARY

        p2 = tf_f.add_paragraph()
        r2 = p2.add_run()
        r2.text = fdesc
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = C_TEXT_MUTED
        fy += Inches(1.08)

    add_button(s9, Inches(9.8), Inches(6.35), Inches(3.033), Inches(0.4), "👥 Meet the Development Team ➔", C_PRIMARY, RGBColor(255, 255, 255), slides[9], font_size=10.5, bold=True)

    # =========================================================================
    # SLIDE 10: TEAM / DEVELOPMENT (WITH EMBEDDED LOGOS & PHOTO)
    # =========================================================================
    s10 = slides[9]
    set_slide_background(s10, with_watermark=True)
    add_navigation_chrome(s10, 9, "Team & Development", "UCET Hazaribagh")

    # Team Institution Banner
    add_card(s10, Inches(0.5), Inches(1.15), Inches(12.333), Inches(0.75), C_PRIMARY_LIGHT, C_PRIMARY)
    
    # Embed UCET Logo on banner
    if os.path.exists(IMG_UCET):
        try:
            s10.shapes.add_picture(IMG_UCET, Inches(0.7), Inches(1.2), Inches(1.2), Inches(0.6))
        except Exception:
            pass

    tb_inst = s10.shapes.add_textbox(Inches(2.05), Inches(1.20), Inches(8.5), Inches(0.6))
    tf = tb_inst.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "🏛️ University College of Engineering & Technology (UCET), VBU, Hazaribagh\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    r2 = p.add_run()
    r2.text = "Smart India Hackathon 2026 • Problem Statement ID: SIH26034 • Ministry of Consumer Affairs, Food & Public Distribution"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(9)
    r2.font.color.rgb = C_TEXT_MUTED

    # Embed SIH Logo on right of banner
    if os.path.exists(IMG_SIH_LOGO):
        try:
            s10.shapes.add_picture(IMG_SIH_LOGO, Inches(11.45), Inches(1.2), Inches(1.1), Inches(0.6))
        except Exception:
            pass

    team_members = [
        ("Shubham Kumar", "Team Lead & Full-Stack / AI Architect", "B.Tech Information Technology", "Session: 2024–27 (D2D)", "Lead Developer", C_PRIMARY, True, IMG_SHUBHAM),
        ("Team Member 2", "AI / ML & Computer Vision Specialist", "B.Tech Engineering", "Session: 2024–27", "OCR & NLP Pipeline", C_TEXT_MUTED, False, None),
        ("Team Member 3", "Backend & Regulatory Rules Lead", "B.Tech Engineering", "Session: 2024–27", "Rule Engine & DB", C_TEXT_MUTED, False, None),
        ("Team Member 4", "Frontend & UI/UX Specialist", "B.Tech Engineering", "Session: 2024–27", "React & 3D Web UI", C_TEXT_MUTED, False, None),
        ("Team Member 5", "Legal Research & Verification Analyst", "B.Tech Engineering", "Session: 2024–27", "Statutory Compliance", C_TEXT_MUTED, False, None),
        ("Team Member 6", "QA, Testing & Cloud DevOps", "B.Tech Engineering", "Session: 2024–27", "Testing & Security", C_TEXT_MUTED, False, None),
    ]

    t_x_coords = [Inches(0.5), Inches(4.65), Inches(8.8)]
    t_y_coords = [Inches(2.05), Inches(4.35)]

    for idx, (m_name, m_role, m_deg, m_sess, m_badge, m_col, is_lead, img_path) in enumerate(team_members):
        tx = t_x_coords[idx % 3]
        ty = t_y_coords[idx // 3]
        
        card_bg = C_CARD_BG if not is_lead else RGBColor(255, 255, 255)
        card_border = C_PRIMARY if is_lead else C_CARD_BORDER
        add_card(s10, tx, ty, Inches(4.033), Inches(2.1), card_bg, card_border, border_width=1.5 if is_lead else 1)
        
        # Avatar slot: Real photo for Shubham Kumar if present, else initials circle
        if img_path and os.path.exists(img_path):
            try:
                s10.shapes.add_picture(img_path, tx + Inches(0.2), ty + Inches(0.2), Inches(0.9), Inches(1.05))
            except Exception:
                add_card(s10, tx + Inches(0.2), ty + Inches(0.2), Inches(0.9), Inches(0.9), C_PRIMARY_LIGHT, card_border)
        else:
            avatar_bg = C_PRIMARY_LIGHT if is_lead else C_BG_PAGE
            add_card(s10, tx + Inches(0.2), ty + Inches(0.2), Inches(0.9), Inches(0.9), avatar_bg, card_border)
            tb_av = s10.shapes.add_textbox(tx + Inches(0.2), ty + Inches(0.35), Inches(0.9), Inches(0.6))
            p = tb_av.text_frame.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            r = p.add_run()
            r.text = f"M{idx+1}"
            r.font.name = 'Segoe UI'
            r.font.size = Pt(14)
            r.font.bold = True
            r.font.color.rgb = m_col

        # Member Details
        tb_md = s10.shapes.add_textbox(tx + Inches(1.2), ty + Inches(0.15), Inches(2.7), Inches(1.8))
        tf_md = tb_md.text_frame
        tf_md.word_wrap = True
        
        p = tf_md.paragraphs[0]
        r = p.add_run()
        r.text = m_name + "\n"
        r.font.name = 'Segoe UI'
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = C_TEXT_MAIN

        p2 = tf_md.add_paragraph()
        r2 = p2.add_run()
        r2.text = m_role + "\n"
        r2.font.name = 'Segoe UI'
        r2.font.size = Pt(8.5)
        r2.font.bold = True
        r2.font.color.rgb = m_col

        p3 = tf_md.add_paragraph()
        r3 = p3.add_run()
        r3.text = f"{m_deg}\n{m_sess}"
        r3.font.name = 'Segoe UI'
        r3.font.size = Pt(8)
        r3.font.color.rgb = C_TEXT_MUTED

    add_button(s10, Inches(9.8), Inches(6.45), Inches(3.033), Inches(0.35), "🎯 Summary & Product Hub ➔", C_PRIMARY, RGBColor(255, 255, 255), slides[10], font_size=10, bold=True)

    # =========================================================================
    # SLIDE 11: FINAL SLIDE / THANK YOU & PRODUCT CTA
    # =========================================================================
    s11 = slides[10]
    set_slide_background(s11, with_watermark=True)
    add_navigation_chrome(s11, 10, "Summary & Interactive Hub", "Thank You")

    # Central Hero Thank You Card
    add_card(s11, Inches(1.5), Inches(1.25), Inches(10.333), Inches(5.3), C_CARD_BG, C_CARD_BORDER)

    # Authority Tag Banner with Ministry & SIH Logos
    add_card(s11, Inches(3.166), Inches(1.5), Inches(7.0), Inches(0.55), C_EMERALD_LIGHT, C_EMERALD)
    
    # Embed Ministry Logo
    if os.path.exists(IMG_MINISTRY_LOGO):
        try:
            s11.shapes.add_picture(IMG_MINISTRY_LOGO, Inches(3.25), Inches(1.54), Inches(0.85), Inches(0.46))
        except Exception:
            pass

    # Embed SIH Logo
    if os.path.exists(IMG_SIH_LOGO):
        try:
            s11.shapes.add_picture(IMG_SIH_LOGO, Inches(4.18), Inches(1.54), Inches(0.85), Inches(0.46))
        except Exception:
            pass

    tb_ty_pill = s11.shapes.add_textbox(Inches(5.1), Inches(1.55), Inches(4.9), Inches(0.45))
    p = tb_ty_pill.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "SMART INDIA HACKATHON 2026 • FINAL PRESENTATION\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = C_EMERALD

    p2 = tb_ty_pill.text_frame.add_paragraph()
    r2 = p2.add_run()
    r2.text = "Problem Statement: SIH26034 • Ministry of Consumer Affairs"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(8)
    r2.font.color.rgb = C_TEXT_MUTED

    # Big Title
    tb_ty_title = s11.shapes.add_textbox(Inches(2.0), Inches(2.2), Inches(9.333), Inches(1.2))
    tf_ty = tb_ty_title.text_frame
    tf_ty.word_wrap = True
    p = tf_ty.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "CompliScan AI\n"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(32)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MAIN

    r2 = p.add_run()
    r2.text = "Making Product Label Compliance Smarter, Faster & Consumer-First"
    r2.font.name = 'Segoe UI'
    r2.font.size = Pt(15)
    r2.font.bold = True
    r2.font.color.rgb = C_PRIMARY

    # Core Value Tagline
    tb_tag = s11.shapes.add_textbox(Inches(2.0), Inches(3.45), Inches(9.333), Inches(0.7))
    tf_tag = tb_tag.text_frame
    tf_tag.word_wrap = True
    p = tf_tag.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "Empowering 1.4B Indian Citizens • Accelerating Regulatory Enforcement • Eradicating Packaging Fraud"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = C_TEXT_MUTED

    # Interactive Quick-Jump Hub Buttons Row
    hub_buttons = [
        ("🏠 Back to Home", slides[0], C_CARD_BG, C_PRIMARY, C_PRIMARY),
        ("🔍 Live Scanner Demo", slides[3], C_PRIMARY, RGBColor(255, 255, 255), None),
        ("🏛️ Technical Architecture", slides[4], C_CARD_BG, C_TEXT_MAIN, C_CARD_BORDER),
        ("📊 Compliance Dashboard", slides[5], C_EMERALD, RGBColor(255, 255, 255), None),
        ("⚖️ Enforcement Portal", slides[7], C_CARD_BG, C_RED, C_RED),
    ]

    hx = Inches(1.9)
    hw = Inches(1.8)
    for label, tgt_slide, bg, tc, bc in hub_buttons:
        add_button(s11, hx, Inches(4.35), hw, Inches(0.6), label, bg, tc, tgt_slide, font_size=9.5, bold=True, border_color=bc)
        hx += Inches(1.95)

    # University Footer
    tb_ufoot = s11.shapes.add_textbox(Inches(2.0), Inches(5.25), Inches(9.333), Inches(0.6))
    tf_uf = tb_ufoot.text_frame
    p = tf_uf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "University College of Engineering & Technology (UCET), VBU, Hazaribagh • Problem ID: SIH26034\nThank You Judges & Mentors for your valuable time!"
    r.font.name = 'Segoe UI'
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = C_PRIMARY

    # Save presentation
    output_filename = "CompliScan_AI_SIH2026_PitchDeck.pptx"
    prs.save(output_filename)
    print(f"Presentation successfully saved to {output_filename}")

if __name__ == "__main__":
    create_deck()
