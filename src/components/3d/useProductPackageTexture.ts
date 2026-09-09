import { useMemo } from 'react';
import * as THREE from 'three';

export type ProductType = 'food' | 'cosmetics' | 'oil';

export function useProductPackageTexture(type: ProductType = 'food') {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (type === 'food') {
      // -------------------------------------------------------------
      // 1. FOOD: ROYAL MASALA CRUNCH (Vibrant Indian Spice & Gold Foil)
      // -------------------------------------------------------------
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
      bgGrad.addColorStop(0, '#3f0d12');    // Deep ruby crimson
      bgGrad.addColorStop(0.2, '#7c1d24');  // Rich royal red
      bgGrad.addColorStop(0.55, '#991b1b'); // Bright spice red
      bgGrad.addColorStop(0.85, '#450a0a'); // Deep roasted base
      bgGrad.addColorStop(1, '#1c0406');    // Bottom sealed crimp
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1440);

      // Gold shimmer micro-foil pattern
      ctx.fillStyle = 'rgba(251, 191, 36, 0.05)';
      for (let i = 0; i < 1440; i += 7) {
        ctx.fillRect(0, i, 1024, 2);
      }

      // Top crimp heat-seal
      const sealGrad = ctx.createLinearGradient(0, 0, 0, 95);
      sealGrad.addColorStop(0, '#1c0406');
      sealGrad.addColorStop(0.5, '#450a0a');
      sealGrad.addColorStop(1, '#7c1d24');
      ctx.fillStyle = sealGrad;
      ctx.fillRect(0, 0, 1024, 95);

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 3;
      for (let x = 12; x < 1024; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 10);
        ctx.lineTo(x, 85);
        ctx.stroke();
      }

      // Bottom crimp heat-seal
      ctx.fillStyle = sealGrad;
      ctx.fillRect(0, 1355, 1024, 85);
      for (let x = 12; x < 1024; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 1365);
        ctx.lineTo(x, 1435);
        ctx.stroke();
      }

      // Metallic Gold Foil Ribbon Band
      const goldRibbon = ctx.createLinearGradient(0, 125, 1024, 125);
      goldRibbon.addColorStop(0, '#b45309');
      goldRibbon.addColorStop(0.5, '#fde047');
      goldRibbon.addColorStop(1, '#b45309');
      ctx.fillStyle = goldRibbon;
      ctx.fillRect(0, 125, 1024, 14);

      // FSSAI Green Veg Logo in Top Right
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 6;
      ctx.strokeRect(840, 160, 90, 90);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(885, 205, 26, 0, Math.PI * 2);
      ctx.fill();

      // Brand Category Tag
      ctx.fillStyle = '#fde68a';
      ctx.font = '700 28px sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText('HERITAGE SPICE FOODS', 80, 185);

      // Main Brand Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 84px sans-serif';
      ctx.fillText('ROYAL MASALA', 80, 280);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 84px sans-serif';
      ctx.fillText('CRUNCH', 620, 280);

      // Subtitle
      ctx.fillStyle = '#fecaca';
      ctx.font = '500 32px sans-serif';
      ctx.fillText('Roasted Multigrain Herb Crisp Snacking Pouch', 80, 335);

      // Center Graphic Badge
      const badgeGrad = ctx.createRadialGradient(512, 545, 30, 512, 545, 260);
      badgeGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      badgeGrad.addColorStop(0.65, 'rgba(180, 83, 9, 0.15)');
      badgeGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = badgeGrad;
      ctx.fillRect(100, 370, 824, 350);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(512, 545, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100% ROASTED GRAIN', 512, 530);
      ctx.font = '600 26px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('ZERO TRANS-FAT • NO PRESERVATIVES', 512, 575);

      // Regulatory Compliance Card (Legal Metrology & FSSAI)
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(28, 4, 6, 0.85)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(65, 770, 894, 475, 20);
      ctx.fill();
      ctx.stroke();

      // Card Title
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 26px sans-serif';
      ctx.fillText('MANDATORY DECLARATIONS (LM RULES 2011 & FSSAI 2020)', 95, 815);

      // Row 1: Net Qty & MRP
      ctx.fillStyle = '#fca5a5';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('NET QUANTITY', 95, 868);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px sans-serif';
      ctx.fillText('200 g', 95, 910);

      ctx.fillStyle = '#fca5a5';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('MAX RETAIL PRICE (MRP)', 450, 868);
      ctx.fillStyle = '#34d399';
      ctx.font = '800 36px sans-serif';
      ctx.fillText('₹ 99.00', 450, 910);
      ctx.font = '500 20px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('(Incl. of all taxes)', 585, 910);

      ctx.font = '600 22px sans-serif';
      ctx.fillStyle = '#fecdd3';
      ctx.fillText('Unit Sale Price: ₹ 0.495 / g', 450, 948);

      // Row 2: Batch & Dates
      ctx.fillStyle = '#fca5a5';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('BATCH NUMBER', 95, 1010);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px monospace';
      ctx.fillText('RMC-2026-X09', 95, 1048);

      ctx.fillStyle = '#fca5a5';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('MFG & BEST BEFORE', 450, 1010);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 26px sans-serif';
      ctx.fillText('MFG: SEP 2026 • BEST BEFORE 9 MONTHS', 450, 1048);

      // Row 3: Manufacturer
      ctx.fillStyle = '#fca5a5';
      ctx.font = '500 21px sans-serif';
      ctx.fillText('MFD BY: Royal Foods India Ltd., Industrial Park, Mumbai 400072, India', 95, 1110);
      ctx.fillText('Consumer Care: care@royalcrunch.in | Toll-Free: 1800-11-2026', 95, 1148);

      // FSSAI & Barcode
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px sans-serif';
      ctx.fillText('fssai Lic. No. 10026022001489', 95, 1205);

    } else if (type === 'cosmetics') {
      // -------------------------------------------------------------
      // 2. COSMETICS: AURA BOTANICS RADIANCE SERUM (Luxury Emerald & Rose-Gold)
      // -------------------------------------------------------------
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
      bgGrad.addColorStop(0, '#022c22');    // Deep emerald 950
      bgGrad.addColorStop(0.2, '#064e3b');  // Emerald 900
      bgGrad.addColorStop(0.55, '#047857'); // Vibrant rich emerald
      bgGrad.addColorStop(0.85, '#064e3b');
      bgGrad.addColorStop(1, '#022c22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1440);

      // Rose-gold hairline aesthetic
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.15)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 1440; i += 12) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1024, i);
        ctx.stroke();
      }

      // Top Rose-Gold Accent
      const roseGold = ctx.createLinearGradient(0, 120, 1024, 120);
      roseGold.addColorStop(0, '#f472b6');
      roseGold.addColorStop(0.5, '#fde047');
      roseGold.addColorStop(1, '#f472b6');
      ctx.fillStyle = roseGold;
      ctx.fillRect(0, 120, 1024, 10);

      // Brand Category Tag
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 26px sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('AYURVEDIC DERMO-CARE', 80, 185);

      // Main Brand Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 86px sans-serif';
      ctx.fillText('AURA BOTANICS', 80, 280);

      // Subtitle
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '500 32px sans-serif';
      ctx.fillText('Kumkumadi & Vitamin-C Radiance Elixir Serum', 80, 335);

      // Center Graphic Badge
      const badgeGrad = ctx.createRadialGradient(512, 545, 30, 512, 545, 260);
      badgeGrad.addColorStop(0, 'rgba(52, 211, 153, 0.4)');
      badgeGrad.addColorStop(0.7, 'rgba(4, 120, 87, 0.1)');
      badgeGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = badgeGrad;
      ctx.fillRect(100, 370, 824, 350);

      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(512, 545, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100% HERBAL EXTRACT', 512, 530);
      ctx.font = '600 24px sans-serif';
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText('DERMATOLOGICALLY TESTED • CRUELTY FREE', 512, 575);

      // Regulatory Compliance Card (Cosmetics Rules 2020 & CDSCO)
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(2, 44, 34, 0.88)';
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(65, 770, 894, 475, 20);
      ctx.fill();
      ctx.stroke();

      // Card Title
      ctx.fillStyle = '#f472b6';
      ctx.font = '800 26px sans-serif';
      ctx.fillText('STATUTORY DECLARATIONS (COSMETICS RULES 2020 & CDSCO)', 95, 815);

      // Row 1: Net Volume & MRP
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('NET VOLUME', 95, 868);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px sans-serif';
      ctx.fillText('100 ml', 95, 910);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('MAX RETAIL PRICE (MRP)', 450, 868);
      ctx.fillStyle = '#34d399';
      ctx.font = '800 36px sans-serif';
      ctx.fillText('₹ 499.00', 450, 910);
      ctx.font = '500 20px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('(Incl. of all taxes)', 610, 910);

      ctx.font = '600 22px sans-serif';
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText('Unit Sale Price: ₹ 4.99 / ml', 450, 948);

      // Row 2: Batch & Dates
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('BATCH NUMBER', 95, 1010);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px monospace';
      ctx.fillText('AB-SERUM-2026-9', 95, 1048);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('MFG DATE & EXPIRY', 450, 1010);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 26px sans-serif';
      ctx.fillText('MFG: AUG 2026 • USE BEFORE 24 MONTHS', 450, 1048);

      // Row 3: Manufacturer
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '500 21px sans-serif';
      ctx.fillText('MFD BY: Aura Botanics Laboratories, Green Valley Estate, Baddi 173205, HP', 95, 1110);
      ctx.fillText('Consumer Care: support@aurabotanics.com | Toll-Free: 1800-44-2026', 95, 1148);

      // CDSCO Lic No
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px sans-serif';
      ctx.fillText('Mfg. Lic. No.: COS/HP/2026/089 (CDSCO Compliant)', 95, 1205);

    } else {
      // -------------------------------------------------------------
      // 3. EDIBLE OIL: GOLDEN HARVEST KACHI GHANI (Warm Brass & Amber Gold)
      // -------------------------------------------------------------
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
      bgGrad.addColorStop(0, '#451a03');    // Deep amber brown
      bgGrad.addColorStop(0.2, '#78350f');  // Rich mustard amber
      bgGrad.addColorStop(0.55, '#b45309'); // Glowing gold amber
      bgGrad.addColorStop(0.85, '#78350f');
      bgGrad.addColorStop(1, '#291002');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1440);

      // Shimmering brass highlights
      ctx.fillStyle = 'rgba(254, 240, 138, 0.06)';
      for (let i = 0; i < 1440; i += 8) {
        ctx.fillRect(0, i, 1024, 3);
      }

      // Metallic Top Band
      const brassBand = ctx.createLinearGradient(0, 120, 1024, 120);
      brassBand.addColorStop(0, '#d97706');
      brassBand.addColorStop(0.5, '#fef08a');
      brassBand.addColorStop(1, '#d97706');
      ctx.fillStyle = brassBand;
      ctx.fillRect(0, 120, 1024, 12);

      // FSSAI Green Veg Logo in Top Right
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 6;
      ctx.strokeRect(840, 160, 90, 90);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(885, 205, 26, 0, Math.PI * 2);
      ctx.fill();

      // Brand Category Tag
      ctx.fillStyle = '#fde68a';
      ctx.font = '700 28px sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText('100% PURE VIRGIN COLD-PRESSED', 80, 185);

      // Main Brand Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 84px sans-serif';
      ctx.fillText('GOLDEN HARVEST', 80, 280);

      // Subtitle
      ctx.fillStyle = '#fed7aa';
      ctx.font = '500 32px sans-serif';
      ctx.fillText('Kachi Ghani Pure Mustard Oil (Agmark Grade-1)', 80, 335);

      // Center Graphic Badge
      const badgeGrad = ctx.createRadialGradient(512, 545, 30, 512, 545, 260);
      badgeGrad.addColorStop(0, 'rgba(251, 191, 36, 0.5)');
      badgeGrad.addColorStop(0.7, 'rgba(180, 83, 9, 0.15)');
      badgeGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = badgeGrad;
      ctx.fillRect(100, 370, 824, 350);

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(512, 545, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AGMARK GRADE 1', 512, 530);
      ctx.font = '600 24px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('NATURAL OMEGA-3 • ZERO ADULTERATION', 512, 575);

      // Regulatory Compliance Card (LM Dual Mass-Volume Amendment & FSSAI)
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(41, 16, 2, 0.88)';
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(65, 770, 894, 475, 20);
      ctx.fill();
      ctx.stroke();

      // Card Title
      ctx.fillStyle = '#fde047';
      ctx.font = '800 24px sans-serif';
      ctx.fillText('MANDATORY DUAL DECLARATION (LEGAL METROLOGY AMENDMENT)', 95, 815);

      // Row 1: Dual Net Volume + Mass & MRP
      ctx.fillStyle = '#fed7aa';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('NET QUANTITY (VOLUME + MASS EQUIV)', 95, 868);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px sans-serif';
      ctx.fillText('1 Litre (910 g Mass)', 95, 910);

      ctx.fillStyle = '#fed7aa';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('MAX RETAIL PRICE (MRP)', 450, 868);
      ctx.fillStyle = '#34d399';
      ctx.font = '800 36px sans-serif';
      ctx.fillText('₹ 175.00', 450, 910);
      ctx.font = '500 20px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('(Incl. of all taxes)', 605, 910);

      ctx.font = '600 22px sans-serif';
      ctx.fillStyle = '#fde68a';
      ctx.fillText('Unit Sale Price: ₹ 0.175 / ml', 450, 948);

      // Row 2: Batch & Dates
      ctx.fillStyle = '#fed7aa';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('BATCH NUMBER', 95, 1010);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px monospace';
      ctx.fillText('GH-OIL-2026-M04', 95, 1048);

      ctx.fillStyle = '#fed7aa';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('MFG & BEST BEFORE', 450, 1010);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 26px sans-serif';
      ctx.fillText('MFG: AUG 2026 • BEST BEFORE 12 MONTHS', 450, 1048);

      // Row 3: Manufacturer
      ctx.fillStyle = '#fed7aa';
      ctx.font = '500 21px sans-serif';
      ctx.fillText('MFD & PACKED BY: Golden Harvest Agro Oils Ltd., GT Road, Kanpur 208001, UP', 95, 1110);
      ctx.fillText('Consumer Care: oils@goldenharvest.in | Toll-Free: 1800-88-2026', 95, 1148);

      // FSSAI Lic
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px sans-serif';
      ctx.fillText('fssai Lic. No. 10819003000452 | Agmark: CA-0988', 95, 1205);
    }

    // Common Barcode & Certified Stamp for all packages
    // High-res Barcode
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(720, 1175, 210, 60);
    ctx.fillStyle = '#000000';
    const barPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2];
    let barX = 730;
    for (let b = 0; b < barPattern.length; b++) {
      const w = barPattern[b];
      if (b % 2 === 0) {
        ctx.fillRect(barX, 1180, w * 2.2, 44);
      }
      barX += w * 2.2 + 2;
      if (barX > 915) break;
    }
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('8 901234 567890', 825, 1232);

    // Certified Compliant Watermark stamp
    ctx.save();
    ctx.translate(850, 1000);
    ctx.rotate(-0.15);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.9)';
    ctx.lineWidth = 4;
    ctx.strokeRect(-110, -35, 220, 70);
    ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
    ctx.font = '800 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COMPLIANT', 0, -5);
    ctx.font = '600 15px sans-serif';
    ctx.fillText('SIH 2026 VERIFIED', 0, 20);
    ctx.restore();

    // Create Three Texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [type]);
}
