export const BRAND = {
  name: '3Minutes',
  tagline: 'Mortgage Intelligence in 3 Minutes.'
};

export const COLORS = {
  primary: '#0F172A',
  secondary: '#10B981',
  accent: '#DC2626'
};

export const CONTACT = {
  address: 'Level 20, Coworking Hub, Kuala Lumpur, Malaysia',
  phone: '+603-1234 5678',
  email: 'support@3minutes.com'
};

export const LEGAL = {
  pdpaNotice: 'Data collected is for assessment purposes only. We adhere to PDPA standards.',
  disclaimer:
    'All calculations are for reference only and subject to final bank approval. 3Minutes is a fintech tool, not a bank.'
};

export const VOCABULARY = {
  guaranteedApproval: 'High Approval Probability',
  fullLoan: 'Max Margin Financing'
};

export const MODES = {
  CUSTOMER: 'customer',
  AGENT: 'agent',
  BANKER: 'banker'
};

export const USER_STORAGE_KEY = '3m_user';
export const DEFAULTS_STORAGE_KEY = '3m_defaults';
export const HANDBOOK_STORAGE_KEY = '3m_handbook';
export const BENEFITS_STORAGE_KEY = '3m_flexi_benefits';

export const HIVE_MIND_ENDPOINT =
  typeof import.meta !== 'undefined'
    ? import.meta.env.VITE_HIVEMIND_URL || '/api/hivemind'
    : '/api/hivemind';

export const DSR_BANDS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  RED: 'RED'
};

export const DATE_FORMAT = 'YYYY-MM-DD';
