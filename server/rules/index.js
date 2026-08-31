import { legalMetrologyRules } from './legalMetrologyRules.js';
import { foodRules } from './foodRules.js';
import { edibleOilRules } from './edibleOilRules.js';
import { cosmeticsRules } from './cosmeticsRules.js';
import { householdRules } from './householdRules.js';

export const allRules = [
  ...legalMetrologyRules,
  ...foodRules,
  ...edibleOilRules,
  ...cosmeticsRules,
  ...householdRules,
];

export {
  legalMetrologyRules,
  foodRules,
  edibleOilRules,
  cosmeticsRules,
  householdRules,
};
