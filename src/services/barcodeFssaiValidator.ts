/**
 * CompliScan AI - FSSAI 14-Digit License & EAN-13 / GS1 Barcode Fraud & Checksum Validator
 * Deterministically verifies:
 * 1. 14-Digit FSSAI License Structure, State Prefix, Year Code, License Tier (Central vs State)
 * 2. EAN-13 / UPC-A GS1 Modulo-10 Check Digit & Country Origin (890 GS1 India)
 */

export interface FSSAIValidationResult {
  fssaiNumber: string;
  isValid: boolean;
  licenseTier: 'Central License' | 'State License' | 'Petty Food Registration' | 'Unknown / Invalid';
  stateName: string;
  stateCode: string;
  issuedYear: string;
  serialNumber: string;
  trustScore: number; // 0 to 100
  status: 'VERIFIED' | 'SUSPICIOUS' | 'INVALID' | 'NOT_DETECTED';
  details: string[];
}

export interface BarcodeValidationResult {
  barcodeNumber: string;
  format: 'EAN-13' | 'UPC-A' | 'EAN-8' | 'OTHER' | 'NOT_DETECTED';
  isValid: boolean;
  checkDigitMatches: boolean;
  isIndiaGS1: boolean;
  countryOfOrigin: string;
  computedCheckDigit: number | null;
  actualCheckDigit: number | null;
  trustScore: number; // 0 to 100
  status: 'VERIFIED' | 'COUNTERFEIT_ALERT' | 'INVALID_FORMAT' | 'NOT_DETECTED';
  details: string[];
}

// Indian State Codes mapping under FSSAI FosCos
const FSSAI_STATE_MAP: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi (NCT)',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman & Diu',
  '26': 'Dadra & Nagar Haveli',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Ladakh',
  '38': 'Central Jurisdiction / Armed Forces',
  '00': 'Central Multi-State / Export Unit',
};

/**
 * Validates a 14-digit FSSAI License Number structure
 */
export function validateFssaiLicense(rawInput: string | null | undefined): FSSAIValidationResult {
  if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
    return {
      fssaiNumber: '',
      isValid: false,
      licenseTier: 'Unknown / Invalid',
      stateName: 'Not Available',
      stateCode: '',
      issuedYear: '',
      serialNumber: '',
      trustScore: 0,
      status: 'NOT_DETECTED',
      details: ['No FSSAI License Number provided or detected on package.'],
    };
  }

  // Extract all digits
  const cleanDigits = rawInput.replace(/\D/g, '');

  if (cleanDigits.length !== 14) {
    return {
      fssaiNumber: cleanDigits || rawInput,
      isValid: false,
      licenseTier: 'Unknown / Invalid',
      stateName: 'Unknown',
      stateCode: '',
      issuedYear: '',
      serialNumber: '',
      trustScore: 20,
      status: 'INVALID',
      details: [
        `Invalid length: FSSAI License must be exactly 14 digits (found ${cleanDigits.length} digits: "${cleanDigits}").`,
        'Possible OCR misread or non-compliant manufacturer declaration.',
      ],
    };
  }

  const firstDigit = cleanDigits[0];
  const stateCode = cleanDigits.slice(1, 3);
  const yearCode = cleanDigits.slice(3, 5);
  const categoryCode = cleanDigits.slice(5, 8);
  const serialNumber = cleanDigits.slice(8, 14);

  const details: string[] = [];
  let trustScore = 100;
  let status: FSSAIValidationResult['status'] = 'VERIFIED';

  // 1. License Tier
  let licenseTier: FSSAIValidationResult['licenseTier'] = 'State License';
  if (firstDigit === '1') {
    licenseTier = 'Central License';
    details.push('Tier 1: Central FSSAI License (Large manufacturer, multi-state or import facility).');
  } else if (firstDigit === '2') {
    licenseTier = 'State License';
    details.push('Tier 2: State FSSAI License (Medium enterprise / state-level manufacturing facility).');
  } else if (firstDigit === '3' || firstDigit === '4') {
    licenseTier = 'Petty Food Registration';
    details.push('Tier 3: FSSAI Petty Food Business Registration.');
  } else {
    licenseTier = 'Unknown / Invalid';
    trustScore -= 35;
    details.push(`Suspicious 1st digit (${firstDigit}): Expected 1 (Central), 2 (State), or 3 (Registration).`);
  }

  // 2. State Code Check
  const stateName = FSSAI_STATE_MAP[stateCode] || 'Unknown / Unregistered State Code';
  if (FSSAI_STATE_MAP[stateCode]) {
    details.push(`State Prefix (${stateCode}): Jurisdiction verified under ${stateName}.`);
  } else {
    trustScore -= 30;
    details.push(`Invalid State Prefix (${stateCode}): Does not match any valid Indian State / UT code (01-38).`);
  }

  // 3. Year Code Check
  const yearNum = parseInt(yearCode, 10);
  const currentYearLastTwo = new Date().getFullYear() % 100; // e.g. 26 for 2026
  if (yearNum >= 6 && yearNum <= currentYearLastTwo + 1) {
    const fullYear = `20${yearCode}`;
    details.push(`Issuance Cycle (${yearCode}): Enrolled / Issued in approximately ${fullYear}.`);
  } else {
    trustScore -= 25;
    details.push(`Suspicious Year Code (${yearCode}): Out of plausible issuance date range.`);
  }

  // 4. Serial Sequence Check (Check if not dummy all zeros or repeats like 111111)
  if (/^(\d)\1+$/.test(serialNumber) || serialNumber === '000000') {
    trustScore -= 40;
    details.push(`Suspicious Serial (${serialNumber}): Dummy or placeholder serial pattern detected.`);
  } else {
    details.push(`Unique Facility Serial: ${serialNumber} (Category code: ${categoryCode}).`);
  }

  if (trustScore < 50) {
    status = 'SUSPICIOUS';
  } else if (trustScore < 70) {
    status = 'INVALID';
  } else {
    status = 'VERIFIED';
  }

  return {
    fssaiNumber: cleanDigits,
    isValid: trustScore >= 60,
    licenseTier,
    stateName,
    stateCode,
    issuedYear: `20${yearCode}`,
    serialNumber,
    trustScore: Math.max(0, Math.min(100, trustScore)),
    status,
    details,
  };
}

/**
 * Calculates GS1 Modulo-10 Check Digit for Barcodes
 */
export function calculateGS1CheckDigit(digitsWithoutCheck: string): number {
  let sum = 0;
  const len = digitsWithoutCheck.length;
  // Weight alternating from right to left: 3, 1, 3, 1...
  let weight = 3;
  for (let i = len - 1; i >= 0; i--) {
    const d = parseInt(digitsWithoutCheck[i], 10) || 0;
    sum += d * weight;
    weight = weight === 3 ? 1 : 3;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Detects country prefix for GS1 Barcodes
 */
function getCountryByPrefix(prefix: string): { country: string; isIndiaGS1: boolean } {
  const p3 = prefix.slice(0, 3);
  if (p3 === '890') {
    return { country: 'India 🇮🇳 (GS1 India Registered)', isIndiaGS1: true };
  }
  const n3 = parseInt(p3, 10);
  if (n3 >= 0 && n3 <= 19) return { country: 'United States & Canada 🇺🇸', isIndiaGS1: false };
  if (n3 >= 300 && n3 <= 379) return { country: 'France 🇫🇷', isIndiaGS1: false };
  if (n3 >= 400 && n3 <= 440) return { country: 'Germany 🇩🇪', isIndiaGS1: false };
  if (n3 >= 450 && n3 <= 459) return { country: 'Japan 🇯🇵', isIndiaGS1: false };
  if (n3 >= 490 && n3 <= 499) return { country: 'Japan 🇯🇵', isIndiaGS1: false };
  if (n3 >= 500 && n3 <= 509) return { country: 'United Kingdom 🇬🇧', isIndiaGS1: false };
  if (n3 >= 690 && n3 <= 699) return { country: 'China 🇨🇳', isIndiaGS1: false };
  if (n3 >= 800 && n3 <= 839) return { country: 'Italy 🇮🇹', isIndiaGS1: false };
  if (n3 >= 840 && n3 <= 849) return { country: 'Spain 🇪🇸', isIndiaGS1: false };
  if (n3 >= 880) return { country: 'South Korea 🇰🇷', isIndiaGS1: false };
  if (n3 >= 888) return { country: 'Singapore 🇸🇬', isIndiaGS1: false };
  if (n3 >= 930 && n3 <= 939) return { country: 'Australia 🇦🇺', isIndiaGS1: false };

  return { country: 'International GS1 Standard', isIndiaGS1: false };
}

/**
 * Validates EAN-13 / UPC Barcode integrity & Checksum
 */
export function validateBarcode(rawInput: string | null | undefined): BarcodeValidationResult {
  if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
    return {
      barcodeNumber: '',
      format: 'NOT_DETECTED',
      isValid: false,
      checkDigitMatches: false,
      isIndiaGS1: false,
      countryOfOrigin: 'Not Detected',
      computedCheckDigit: null,
      actualCheckDigit: null,
      trustScore: 0,
      status: 'NOT_DETECTED',
      details: ['No barcode / EAN number was detected on the packaging.'],
    };
  }

  const cleanDigits = rawInput.replace(/\D/g, '');
  const len = cleanDigits.length;

  if (len !== 13 && len !== 12 && len !== 8) {
    return {
      barcodeNumber: cleanDigits || rawInput,
      format: 'OTHER',
      isValid: false,
      checkDigitMatches: false,
      isIndiaGS1: false,
      countryOfOrigin: 'Unknown',
      computedCheckDigit: null,
      actualCheckDigit: null,
      trustScore: 25,
      status: 'INVALID_FORMAT',
      details: [
        `Non-standard barcode length (${len} digits). Standard Indian retail packages use EAN-13 (13 digits).`,
      ],
    };
  }

  const format: BarcodeValidationResult['format'] = len === 13 ? 'EAN-13' : len === 12 ? 'UPC-A' : 'EAN-8';
  const digitsWithoutCheck = cleanDigits.slice(0, -1);
  const actualCheckDigit = parseInt(cleanDigits[cleanDigits.length - 1], 10);
  const computedCheckDigit = calculateGS1CheckDigit(digitsWithoutCheck);

  const checkDigitMatches = actualCheckDigit === computedCheckDigit;
  const { country, isIndiaGS1 } = getCountryByPrefix(cleanDigits);

  const details: string[] = [];
  let trustScore = 100;

  if (checkDigitMatches) {
    details.push(`✅ GS1 Checksum Verified: Modulo-10 check digit matches (${actualCheckDigit}).`);
  } else {
    trustScore -= 50;
    details.push(
      `❌ Checksum Mismatch: Last digit is ${actualCheckDigit}, but calculated GS1 check digit is ${computedCheckDigit}. High probability of counterfeit or incorrect barcode printing.`
    );
  }

  if (isIndiaGS1) {
    details.push(`🇮🇳 Prefix 890 Verified: Registered under GS1 India for domestic retail circulation.`);
  } else {
    details.push(`🌍 Registered Jurisdiction: ${country}.`);
  }

  let status: BarcodeValidationResult['status'] = 'VERIFIED';
  if (!checkDigitMatches) {
    status = 'COUNTERFEIT_ALERT';
  } else {
    status = 'VERIFIED';
  }

  return {
    barcodeNumber: cleanDigits,
    format,
    isValid: checkDigitMatches,
    checkDigitMatches,
    isIndiaGS1,
    countryOfOrigin: country,
    computedCheckDigit,
    actualCheckDigit,
    trustScore: Math.max(0, Math.min(100, trustScore)),
    status,
    details,
  };
}
