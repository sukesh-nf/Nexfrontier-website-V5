/**
 * NexFrontier v4 Asset Register
 * Internal record of inherited image assets and their status.
 * Per Blueprint section 96: do not infer which file is canonical from filename alone.
 *
 * Status key:
 *   CANONICAL  - approved final version, designated for v4 use
 *   LEGACY     - inherited from v3, usable but not designated canonical
 *   UNCERTAIN  - multiple plausible versions exist, flagged for confirmation
 */

export interface AssetEntry {
  filename: string;
  subject: string;
  status: 'CANONICAL' | 'LEGACY' | 'UNCERTAIN';
  desktopSuitability: 'good' | 'fair' | 'poor' | 'unknown';
  mobileSuitability: 'good' | 'fair' | 'poor' | 'unknown';
  notes: string;
}

export const assetRegister: AssetEntry[] = [
  {
    filename: 'NF_Logo_Black_BG.png',
    subject: 'NexFrontier logo on dark background',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Primary logo for dark-themed site. Used in header and footer.',
  },
  {
    filename: 'NF_Logo_White_BG.png',
    subject: 'NexFrontier logo on light background',
    status: 'LEGACY',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Available if a light surface is introduced. Not currently needed.',
  },
  {
    filename: 'Adaptive_Value_website_Aug26.png',
    subject: 'Adaptive Value diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-confirmed approved AV visual. The uploaded Adaptive_Value_website_Aug26 copy.png is visually identical; existing filename retained for /enterprise-value/adaptive-value.',
  },
  {
    filename: 'Adaptive_Value_website_Aug26 copy.png',
    subject: 'Adaptive Value diagram (uploaded duplicate)',
    status: 'UNCERTAIN',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder upload received on 2026-08-26. Visually identical to the retained approved Adaptive_Value_website_Aug26.png asset.',
  },
  {
    filename: 'VAlue_Translation_Fwork_website_Aug26.png',
    subject: 'Approved Value Translation Framework diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-approved Value Translation Framework visual uploaded on 2026-08-26. Use only as supplied; placement not assigned yet.',
  },
  {
    filename: 'ChatGPT_Image_Aug_25,_2026,_12_22_29_AM.png',
    subject: 'Enterprise Value diagram showing Quiet Loss and Adaptive Value',
    status: 'UNCERTAIN',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Previous provisional EV visual retained for comparison only. Superseded by founder-approved upload.'
  },
  {
    filename: 'Enterprise_Value_Website_Aug26.png',
    subject: 'Approved Enterprise Value diagram showing Quiet Loss and Adaptive Value',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Founder-approved Enterprise Value visual uploaded on 2026-08-26. Used on /enterprise-value.'
  },
  {
    filename: 'ChatGPT_Image_Aug_23,_2026,_01_35_18_PM.png',
    subject: 'AI-Mediated Choice Triangle (AMCT) diagram',
    status: 'UNCERTAIN',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Previous provisional AMCT visual retained for comparison only. Superseded by founder-approved upload.'
  },
  {
    filename: 'AMCT_Website_Aug26.png',
    subject: 'Approved AI-Mediated Choice Triangle diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Founder-approved AMCT visual uploaded on 2026-08-26. Used on /intelligence/amct.'
  },
  {
    filename: 'ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy.png',
    subject: 'AI-Mediated Choice Triangle (AMCT) diagram (copy)',
    status: 'UNCERTAIN',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Duplicate of AMCT visual. Which is the final approved version? Flagged for confirmation.',
  },
  {
    filename: 'ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy 2.png',
    subject: 'AI-Mediated Choice Triangle (AMCT) diagram (copy 2)',
    status: 'UNCERTAIN',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Duplicate of AMCT visual. Which is the final approved version? Flagged for confirmation.',
  },
  {
    filename: 'ChatGPT_Image_Aug_25,_2026,_12_09_28_AM.png',
    subject: 'Quiet Loss diagram',
    status: 'UNCERTAIN',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Previous provisional QL visual retained for comparison only. Superseded by founder-approved upload.'
  },
  {
    filename: 'Quiet_Loss_Website_Aug26.png',
    subject: 'Approved Quiet Loss diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Founder-approved Quiet Loss visual uploaded on 2026-08-26. Used on /enterprise-value/quiet-loss.'
  },
  {
    filename: 'sukesh-pic.png',
    subject: 'Sukesh Sukumaran headshot',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Primary team photo for Sukesh. Used on About and team profile.',
  },
  {
    filename: 'sukesh-pic copy.png',
    subject: 'Sukesh Sukumaran headshot (copy)',
    status: 'LEGACY',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Duplicate. Use the non-copy version as canonical.',
  },
  {
    filename: 'nela_pic.jpeg',
    subject: 'Nela Muttettuwegama headshot',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Primary team photo for Nela.',
  },
  {
    filename: 'nela_pic copy.jpeg',
    subject: 'Nela Muttettuwegama headshot (copy)',
    status: 'LEGACY',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Duplicate. Use the non-copy version as canonical.',
  },
  {
    filename: 'chris_pic.png',
    subject: 'Chris Stanley headshot',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Primary team photo for Chris.',
  },
  {
    filename: 'chris_pic copy.png',
    subject: 'Chris Stanley headshot (copy)',
    status: 'LEGACY',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Duplicate. Use the non-copy version as canonical.',
  },
  {
    filename: 'MD_MDEC.png',
    subject: 'Malaysia Digital badge awarded by MDEC',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'good',
    notes: 'Recognition badge. Used in footer.',
  },
  {
    filename: 'The_Brain_website_Aug26.png',
    subject: 'Approved The Brain strategic intelligence framework diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-approved The Brain visual uploaded on 2026-08-26. Used on /intelligence/the-brain.',
  },
  {
    filename: 'Intent_Thread_website_Aug26.png',
    subject: 'Approved Intent Threads strategic framework diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-approved Intent Threads visual uploaded on 2026-08-26. Used on /intelligence/intent-threads.',
  },
  {
    filename: 'ORBIT_website_Aug26.png',
    subject: 'Approved ORBIT customer capability journey diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-approved ORBIT visual uploaded on 2026-08-26. Used on /intelligence/orbit.',
  },
  {
    filename: 'Enterprise_Capability_website_Aug26.png',
    subject: 'Approved Enterprise Capability cycle diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-approved Enterprise Capability visual uploaded on 2026-08-26. Used on /intelligence/enterprise-capability.',
  },
  {
    filename: 'Human_In_The_Lead_website_Aug26.png',
    subject: 'Approved Human in the Lead accountability diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-approved Human in the Lead visual uploaded on 2026-08-26. Used on /intelligence/human-in-the-lead.',
  },
  {
    filename: 'FC_to_PB_Pathway_website_Aug26.png',
    subject: 'Approved Foundation Customer to Paid Beta Proof Pathway diagram',
    status: 'CANONICAL',
    desktopSuitability: 'good',
    mobileSuitability: 'fair',
    notes: 'Founder-approved Foundation Customer pathway visual uploaded on 2026-08-26. Used on /foundation-customers.',
  },
  {
    filename: 'NexFrontier_Visual_1.jpg',
    subject: 'NexFrontier visual asset',
    status: 'UNCERTAIN',
    desktopSuitability: 'unknown',
    mobileSuitability: 'unknown',
    notes: 'Purpose unclear. Flagged for identification.',
  },
  {
    filename: 'Screenshot_2026-08-22_at_8.41.47_AM.png',
    subject: 'Unknown screenshot',
    status: 'UNCERTAIN',
    desktopSuitability: 'unknown',
    mobileSuitability: 'unknown',
    notes: 'Purpose unclear. Flagged for identification or removal.',
  },
  {
    filename: 'Screenshot_2026-08-23_at_1.27.42_AM.png',
    subject: 'Unknown screenshot',
    status: 'UNCERTAIN',
    desktopSuitability: 'unknown',
    mobileSuitability: 'unknown',
    notes: 'Purpose unclear. Flagged for identification or removal.',
  },
  {
    filename: 'Screenshot_2026-08-23_at_9.14.37_PM.png',
    subject: 'Unknown screenshot',
    status: 'UNCERTAIN',
    desktopSuitability: 'unknown',
    mobileSuitability: 'unknown',
    notes: 'Purpose unclear. Flagged for identification or removal.',
  },
  {
    filename: 'Screenshot_2026-08-24_at_1.56.02_AM.png',
    subject: 'Unknown screenshot',
    status: 'UNCERTAIN',
    desktopSuitability: 'unknown',
    mobileSuitability: 'unknown',
    notes: 'Purpose unclear. Flagged for identification or removal.',
  },
];

/**
 * Assets designated as canonical for the EV / QL / AV visual family.
 * Per Blueprint section 34: use approved final versions only. Do not redraw or alter.
 */
/**
 * Provisional visuals displayed on site pending founder confirmation.
 * These are NOT approved canonical assets. The founder will upload approved
 * versions one at a time. Do not treat these as final.
 */
export const canonicalVisuals = {
  enterpriseValue: '/assets/images/Enterprise_Value_Website_Aug26.png',
  quietLoss: '/assets/images/Quiet_Loss_Website_Aug26.png',
  adaptiveValue: '/assets/images/Adaptive_Value_website_Aug26.png',
  amct: '/assets/images/AMCT_Website_Aug26.png',
  brain: '/assets/images/The_Brain_website_Aug26.png',
  valueTranslationFramework: '/assets/images/VAlue_Translation_Fwork_website_Aug26.png',
  intentThreads: '/assets/images/Intent_Thread_website_Aug26.png',
  orbit: '/assets/images/ORBIT_website_Aug26.png',
  enterpriseCapability: '/assets/images/Enterprise_Capability_website_Aug26.png',
  humanInTheLead: '/assets/images/Human_In_The_Lead_website_Aug26.png',
  foundationCustomerPathway: '/assets/images/FC_to_PB_Pathway_website_Aug26.png',
} as const;

/**
 * Assets awaiting human confirmation before use.
 */
export const uncertainAssets = assetRegister.filter((a) => a.status === 'UNCERTAIN');
