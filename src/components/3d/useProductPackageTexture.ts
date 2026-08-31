import React, { useMemo } from 'react';
import * as THREE from 'three';

export function useProductPackageTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background gradient: Elegant premium Indian snack pouch (deep royal indigo to warm spice gold/amber gradient header)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
    bgGrad.addColorStop(0, '#1e1b4b');     // deep indigo-950
    bgGrad.addColorStop(0.18, '#312e81');  // indigo-900
    bgGrad.addColorStop(0.55, '#4338ca');  // rich royal indigo
    bgGrad.addColorStop(0.85, '#1e1b4b');  // deep bottom
    bgGrad.addColorStop(1, '#0f172a');     // slate-900 sealed edge
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1440);

    // Subtle metallic pouch texture lines / micro-foil sheen
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 1440; i += 6) {
      ctx.fillRect(0, i, 1024, 2);
    }

    // Top Heat-Seal crimp ridges
    const sealGrad = ctx.createLinearGradient(0, 0, 0, 90);
    sealGrad.addColorStop(0, '#0f172a');
    sealGrad.addColorStop(0.5, '#334155');
    sealGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = sealGrad;
    ctx.fillRect(0, 0, 1024, 90);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    for (let x = 10; x < 1024; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, 80);
      ctx.stroke();
    }

    // Bottom Heat-Seal crimp ridges
    const bSealGrad = ctx.createLinearGradient(0, 1360, 0, 1440);
    bSealGrad.addColorStop(0, '#1e1b4b');
    bSealGrad.addColorStop(0.5, '#334155');
    bSealGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bSealGrad;
    ctx.fillRect(0, 1360, 1024, 80);

    for (let x = 10; x < 1024; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 1370);
      ctx.lineTo(x, 1430);
      ctx.stroke();
    }

    // Modern Gold Accent Band
    const goldGrad = ctx.createLinearGradient(0, 120, 1024, 120);
    goldGrad.addColorStop(0, '#d97706');
    goldGrad.addColorStop(0.5, '#fbbf24');
    goldGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 120, 1024, 12);

    // Green Veg Symbol (FSSAI mandatory compliant icon)
    // Box
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 6;
    ctx.strokeRect(840, 160, 90, 90);
    // Green Filled Circle
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(885, 205, 25, 0, Math.PI * 2);
    ctx.fill();

    // Brand Tag / Category Header
    ctx.fillStyle = '#a5b4fc';
    ctx.font = '600 32px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('NATURAL ARTISANAL FOODS', 80, 180);

    // Product Title (Large & Premium)
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 86px sans-serif';
    ctx.fillText('CompliScan', 80, 280);

    ctx.fillStyle = '#f59e0b'; // Warm Amber/Gold
    ctx.font = '800 86px sans-serif';
    ctx.fillText('Sample', 560, 280);

    // Product Subtitle
    ctx.fillStyle = '#e0e7ff';
    ctx.font = '500 34px sans-serif';
    ctx.fillText('Roasted Multigrain Herb Crisp Snacking Pouch', 80, 340);

    // Decorative illustration zone: Floating crisp / ingredient badge
    const badgeGrad = ctx.createRadialGradient(512, 560, 40, 512, 560, 280);
    badgeGrad.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
    badgeGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.1)');
    badgeGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = badgeGrad;
    ctx.fillRect(100, 380, 824, 380);

    // Central circular food graphic / quality seal
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(512, 560, 150, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '700 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100% WHOLE GRAIN', 512, 545);
    ctx.font = '500 28px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('TRANS-FAT FREE • ZERO CHOLESTEROL', 512, 595);

    // Regulatory Compliance Information Grid (Indian Packaged Commodities Standards)
    ctx.textAlign = 'left';
    
    // Background card for regulatory details
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(70, 790, 884, 460, 20);
    ctx.fill();
    ctx.stroke();

    // Compliance Grid Header
    ctx.fillStyle = '#818cf8';
    ctx.font = '700 26px sans-serif';
    ctx.fillText('MANDATORY DECLARATIONS (LM & FSSAI COMPLIANT)', 105, 835);

    // Grid row 1: Net Qty & MRP
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('NET QUANTITY', 105, 890);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 34px sans-serif';
    ctx.fillText('150 g', 105, 930);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('MAX RETAIL PRICE (MRP)', 460, 890);
    ctx.fillStyle = '#34d399'; // Emerald
    ctx.font = '700 34px sans-serif';
    ctx.fillText('₹ 75.00', 460, 930);
    ctx.font = '400 20px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('(Incl. of all taxes)', 590, 930);

    // Unit Sale Price
    ctx.font = '500 22px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Unit Sale Price: ₹ 0.50 / g', 460, 965);

    // Grid row 2: Dates & Batch
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('BATCH NO.', 105, 1030);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px monospace';
    ctx.fillText('CS-2026-B08', 105, 1065);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('MFG DATE & BEST BEFORE', 460, 1030);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 26px sans-serif';
    ctx.fillText('MFG: AUG 2026  •  EXP: MAY 2027', 460, 1065);

    // Grid row 3: Manufacturer & Customer Care
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('MFD & MKTD BY: CompliScan Consumer Foods Pvt. Ltd., MIDC Industrial Area, Pune 411018, India', 105, 1130);
    ctx.fillText('Consumer Care Cell: care@compliscan.ai | Toll Free: 1800-2026-COMPLI', 105, 1170);

    // FSSAI License & Barcode Section
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '700 24px sans-serif';
    ctx.fillText('fssai  Lic. No. 10026022001489', 105, 1220);

    // High resolution mock EAN-13 barcode
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(720, 1180, 200, 60);
    ctx.fillStyle = '#000000';
    const barPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2];
    let barX = 730;
    for (let b = 0; b < barPattern.length; b++) {
      const w = barPattern[b];
      if (b % 2 === 0) {
        ctx.fillRect(barX, 1185, w * 2.2, 45);
      }
      barX += w * 2.2 + 2;
      if (barX > 910) break;
    }
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('8 901234 567890', 820, 1238);

    // Certified Compliant Watermark stamp in corner
    ctx.save();
    ctx.translate(850, 1000);
    ctx.rotate(-0.15);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
    ctx.lineWidth = 4;
    ctx.strokeRect(-110, -35, 220, 70);
    ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
    ctx.font = '800 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COMPLIANT', 0, -5);
    ctx.font = '600 16px sans-serif';
    ctx.fillText('SIH 2026 VERIFIED', 0, 20);
    ctx.restore();

    // Create Three Texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);
}
