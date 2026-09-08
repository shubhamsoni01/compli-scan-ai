// Utility to generate high-definition realistic sample label images on the fly as File objects
export function createSampleLabelFile(
  title: string,
  category: string,
  fssaiOrLic: string,
  mrp: string,
  netQty: string,
  isVeg: boolean
): File {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Background gradient for packaged container
    const bgGradient = ctx.createLinearGradient(0, 0, 800, 1000);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 1000);

    // Decorative Header banner
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, 800, 90);

    ctx.fillStyle = '#022c22';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL PACKAGED PRODUCT SPECIFICATION', 400, 58);

    // Brand & Product Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title.toUpperCase(), 400, 180);

    // Category Badge
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText(`CATEGORY: ${category.toUpperCase()}`, 400, 225);

    // Content Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 260, 700, 680);

    // Mandatory Declarations List
    ctx.textAlign = 'left';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('STATUTORY LABELLING DECLARATIONS:', 80, 310);

    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = '#e2e8f0';

    const items = [
      `1. Net Quantity: ${netQty}`,
      `2. Maximum Retail Price (MRP): ${mrp}`,
      `3. License / Registration No: ${fssaiOrLic}`,
      `4. Date of Manufacture: 01/2026`,
      `5. Best Before / Expiry: 12 Months from Mfg`,
      `6. Batch / Lot Number: CS-2026-X89`,
      `7. Country of Origin: India`,
      `8. Customer Care: support@compliscan.ai (1800-11-4000)`,
    ];

    items.forEach((item, index) => {
      ctx.fillText(item, 80, 370 + index * 48);
    });

    // Veg / Non-Veg Symbol
    if (category === 'Food' || category === 'Edible Oil') {
      const boxX = 640;
      const boxY = 780;
      const boxSize = 60;

      ctx.strokeStyle = isVeg ? '#22c55e' : '#b91c1c';
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX, boxY, boxSize, boxSize);

      ctx.fillStyle = isVeg ? '#22c55e' : '#b91c1c';
      ctx.beginPath();
      ctx.arc(boxX + boxSize / 2, boxY + boxSize / 2, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = isVeg ? '#86efac' : '#fca5a5';
      ctx.textAlign = 'center';
      ctx.fillText(isVeg ? '100% VEG' : 'NON-VEG', boxX + boxSize / 2, boxY + boxSize + 22);
    }

    // Official Verification Seal watermark
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.font = 'bold 50px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(400, 600);
    ctx.rotate(-Math.PI / 8);
    ctx.fillText('COMPLIANCE AUDIT SPECIMEN', 0, 0);
    ctx.restore();
  }

  // Convert canvas to Data URL and into File
  const dataUrl = canvas.toDataURL('image/png');
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: 'image/png' });
  return new File([blob], `${title.replace(/\s+/g, '_').toLowerCase()}_label.png`, { type: 'image/png' });
}
