/**
 * Multilingual Voice & Audio Speech Synthesis Service
 * Provides dynamic Hindi, English, and Hinglish statutory compliance voice briefs
 * with word-level boundary tracking for real-time live captions.
 */

export type VoiceLanguage = 'hi' | 'en' | 'hinglish';

export interface VoiceScriptData {
  text: string;
  language: VoiceLanguage;
  durationEstimateSec: number;
  bulletPoints: string[];
}

/**
 * Generate natural, professional statutory audit scripts in Hindi, English, or Hinglish
 */
export function generateVoiceScript(scanData: any, language: VoiceLanguage): VoiceScriptData {
  const productName = scanData?.productName || 'इस उत्पाद';
  const brand = scanData?.productBrand || scanData?.brand || '';
  const score = Math.round(scanData?.score ?? 80);
  const summary = scanData?.summary || { passed: 0, issues: 0, review: 0 };
  const nutAudit = scanData?.nutritionAudit;
  const checks = scanData?.checks || [];

  // Extract key nutrient insights
  let sodiumText = '';
  let sugarText = '';
  let hfssStatus = '';

  if (nutAudit && Array.isArray(nutAudit.nutrients)) {
    const sod = nutAudit.nutrients.find((n: any) => n.key === 'sodium');
    const sug = nutAudit.nutrients.find((n: any) => n.key === 'added_sugars' || n.key === 'total_sugars');
    if (sod && sod.observedValue && sod.observedValue !== 'Not detected') {
      sodiumText = sod.observedValue;
    }
    if (sug && sug.observedValue && sug.observedValue !== 'Not detected') {
      sugarText = sug.observedValue;
    }
    hfssStatus = nutAudit.hfssStatus || '';
  }

  // Find failed rules for actionable highlights
  const failedChecks = checks.filter((c: any) => c.status === 'failed' || c.status === 'FAIL');

  if (language === 'hi') {
    // -------------------------------------------------------------
    // PURE HINDI VOICE SCRIPT (Formal & Highly Clear for Govt/Public)
    // -------------------------------------------------------------
    const bullets: string[] = [];
    let script = 'नमस्कार! कॉम्प्ली-स्कैन ए-आई में आपका स्वागत है। ';
    script += 'उत्पाद ' + (brand ? brand + ' ' : '') + productName + ' की कानूनी लेबल जांच पूरी हो चुकी है। ';
    script += 'इस उत्पाद का कुल अनुपालन स्कोर ' + score + ' प्रतिशत है। ';

    bullets.push('अनुपालन स्कोर: ' + score + '% (' + (score >= 80 ? 'सुरक्षित एवं अनुपालन' : score >= 50 ? 'मध्यम जोखिम' : 'उच्च गैर-अनुपालन') + ')');

    if (summary.passed > 0) {
      bullets.push(summary.passed + ' अनिवार्य वैधानिक नियम पास हुए हैं।');
    }

    if (sodiumText || sugarText) {
      let nutPhrase = 'पोषण संबंधी विश्लेषण में ';
      if (sugarText) nutPhrase += 'शर्करा की मात्रा ' + sugarText + ' ';
      if (sodiumText) nutPhrase += 'तथा सोडियम लवण की मात्रा ' + sodiumText + ' दर्ज की गई है। ';
      script += nutPhrase;
      bullets.push('पोषण डेटा: ' + (sugarText ? 'शुगर: ' + sugarText : '') + (sodiumText ? ' | सोडियम: ' + sodiumText : ''));
    }

    if (hfssStatus === 'HIGH_HFSS_ALERT') {
      script += 'सावधान! यह उत्पाद भारतीय खाद्य सुरक्षा मानक प्राधिकरण के उच्च वसा, शर्करा और लवण मानकों के अनुसार जोखिम श्रेणी में आता है। ';
      bullets.push('चेतावनी: अत्यधिक शुगर या सोडियम होने के कारण HFSS श्रेणी में दर्ज।');
    }

    if (failedChecks.length > 0) {
      const failedNames = failedChecks.slice(0, 2).map((c: any) => c.field || c.requirement).join(' तथा ');
      script += 'लेबल पर ' + failedChecks.length + ' अनिवार्य नियमों का उल्लंघन पाया गया है, जिनमें ' + failedNames + ' शामिल हैं। ';
      bullets.push('उल्लंघन: ' + failedNames + ' में विसंगति।');
    } else {
      script += 'लेबल पर अधिकांश अनिवार्य घोषणाएं वैध एवं स्पष्ट पाई गई हैं। ';
    }

    if (score >= 80) {
      script += 'निष्कर्षतः यह उत्पाद दैनिक उपभोग तथा भारतीय पैकेज्ड कमोडिटीज नियमों के अनुरूप प्रतीत होता है। धन्यवाद।';
    } else {
      script += 'कृपया उपभोग अथवा विपणन से पूर्व विस्तृत रिपोर्ट की जांच अवश्य करें। धन्यवाद।';
    }

    return {
      text: script,
      language: 'hi',
      durationEstimateSec: Math.ceil(script.split(' ').length / 2.5),
      bulletPoints: bullets,
    };
  } else if (language === 'hinglish') {
    // -------------------------------------------------------------
    // CONVERSATIONAL HINGLISH SCRIPT (Friendly, Consumer-Facing)
    // -------------------------------------------------------------
    const bullets: string[] = [];
    let script = 'Hello! CompliScan AI analysis ke mutabik, ';
    script += (brand ? brand + ' ' : '') + productName + ' ka compliance score ' + score + '% aaya hai. ';

    bullets.push('Compliance Score: ' + score + '% (' + (score >= 80 ? 'Mostly Compliant' : 'Needs Inspection') + ')');

    if (sugarText || sodiumText) {
      script += 'Is package par ' + (sugarText ? 'Added Sugar ' + sugarText : '') + (sodiumText ? ' aur Sodium ' + sodiumText : '') + ' detect hua hai. ';
      bullets.push('Nutritional Values: ' + (sugarText ? 'Sugar: ' + sugarText : '') + (sodiumText ? ' | Sodium: ' + sodiumText : ''));
    }

    if (hfssStatus === 'HIGH_HFSS_ALERT') {
      script += 'Alert: Isme FSSAI safe threshold se zyada HFSS levels hain. ';
      bullets.push('HFSS Alert: Exceeds safe daily limits.');
    }

    if (failedChecks.length > 0) {
      script += 'Label par ' + failedChecks.length + ' rules mein problem paayi gayi hai. ';
      bullets.push(failedChecks.length + ' compliance violation(s) flagged.');
    } else {
      script += 'Sabhi statutory declarations clearly printed hain. ';
      bullets.push('All statutory declarations verified.');
    }

    script += 'Aap detailed report download karke poori analysis dekh sakte hain. Thank you!';

    return {
      text: script,
      language: 'hinglish',
      durationEstimateSec: Math.ceil(script.split(' ').length / 2.8),
      bulletPoints: bullets,
    };
  } else {
    // -------------------------------------------------------------
    // INDIAN ENGLISH STATUTORY AUDIT SCRIPT (Authoritative & Crisp)
    // -------------------------------------------------------------
    const bullets: string[] = [];
    let script = 'Welcome to CompliScan AI statutory compliance brief. ';
    script += 'The regulatory inspection for ' + (brand ? brand + ' ' : '') + productName + ' is complete, with an overall compliance score of ' + score + ' percent. ';

    bullets.push('Overall Compliance Score: ' + score + '% (' + (scanData?.overallStatus || 'Audited') + ')');

    if (summary.passed > 0) {
      bullets.push(summary.passed + ' statutory requirements verified compliant.');
    }

    if (sugarText || sodiumText) {
      script += 'According to the FSSAI nutritional evaluation, observed levels show ' + (sugarText ? 'Sugar at ' + sugarText : '') + (sodiumText ? ' and Sodium at ' + sodiumText : '') + '. ';
      bullets.push('Nutrient Levels: ' + (sugarText ? 'Sugar: ' + sugarText : '') + (sodiumText ? ' | Sodium: ' + sodiumText : ''));
    }

    if (hfssStatus === 'HIGH_HFSS_ALERT') {
      script += 'Caution: This product exceeds recommended statutory limits for High Fat, Sugar, or Salt content. ';
      bullets.push('Statutory Warning: HFSS Threshold Exceeded.');
    }

    if (failedChecks.length > 0) {
      const topIssue = failedChecks[0]?.field || 'Statutory declaration';
      script += 'Our rule engine flagged ' + failedChecks.length + ' compliance defect' + (failedChecks.length > 1 ? 's' : '') + ', primarily regarding ' + topIssue + '. ';
      bullets.push('Identified Defects: ' + failedChecks.map((f: any) => f.field || f.ruleId).join(', '));
    } else {
      script += 'All mandatory label declarations conform to Legal Metrology and Food Safety standards. ';
    }

    script += 'You may download the certified PDF compliance dossier for formal records. Thank you.';

    return {
      text: script,
      language: 'en',
      durationEstimateSec: Math.ceil(script.split(' ').length / 2.7),
      bulletPoints: bullets,
    };
  }
}

/**
 * Speech Synthesis Controller
 */
class SpeechController {
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.isInitialized = true;
  }

  public getAvailableVoices() {
    if (!this.isInitialized) this.initVoices();
    return this.voices;
  }

  private selectVoice(lang: VoiceLanguage): SpeechSynthesisVoice | null {
    if (!this.isInitialized) this.initVoices();
    const voices = this.voices;
    if (voices.length === 0) return null;

    if (lang === 'hi') {
      const hiVoice = voices.find(
        (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी')
      );
      if (hiVoice) return hiVoice;

      const indianVoice = voices.find((v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
      if (indianVoice) return indianVoice;
    }

    if (lang === 'hinglish' || lang === 'en') {
      const indianVoice = voices.find(
        (v) =>
          v.lang === 'en-IN' ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('heera') ||
          v.name.toLowerCase().includes('ravi')
      );
      if (indianVoice) return indianVoice;

      const genericEn = voices.find((v) => v.lang.startsWith('en'));
      if (genericEn) return genericEn;
    }

    return voices[0] || null;
  }

  public speak(
    text: string,
    lang: VoiceLanguage,
    rate: number = 1.0,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onPause?: () => void;
      onResume?: () => void;
      onBoundary?: (charIndex: number, word: string) => void;
      onError?: (err: any) => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      callbacks?.onError?.(new Error('Speech Synthesis is not supported in this browser environment.'));
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = this.selectVoice(lang);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    }

    utterance.rate = Math.max(0.7, Math.min(1.5, rate));
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onpause = () => callbacks?.onPause?.();
    utterance.onresume = () => callbacks?.onResume?.();
    utterance.onerror = (e) => callbacks?.onError?.(e);

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.slice(event.charIndex, event.charIndex + (event.charLength || 10));
        callbacks?.onBoundary?.(event.charIndex, word);
      }
    };

    this.utterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.utterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }

  public isPaused(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.paused;
  }
}

export const speechController = new SpeechController();
