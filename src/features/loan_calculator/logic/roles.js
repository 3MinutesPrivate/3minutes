// Role & Lens definitions for 3Minutes Loan Calculator
// This module is pure logic (no React). It can be safely shared across
// platform/auth, platform/layout and feature presentation layers.

/**
 * Application-level roles
 * - CUSTOMER: end-buyer
 * - AGENT: property agent
 * - BANKER: banker / senior credit officer
 * - BOSS: superuser / owner (can see everything)
 */
export const ROLES = {
  CUSTOMER: "customer",
  AGENT: "agent",
  BANKER: "banker",
  BOSS: "boss",
};

/**
 * Visual lenses for the calculator.
 * These map 1:1 to the three business perspectives.
 */
export const LENSES = {
  CUSTOMER: "customer",
  AGENT: "agent",
  BANKER: "banker",
};

/**
 * For each role, define:
 * - defaultLens: which view they land on by default
 * - allowedLenses: which lenses they can actively switch to
 *
 * Rules:
 *  - Customer: only Customer lens, no switching controls.
 *  - Agent   : default Agent, can see Agent + Customer lenses.
 *  - Banker  : default Banker, can see all three lenses.
 *  - Boss    : behaves like Banker but semantically "superuser".
 */
export const ROLE_LENS_MAP = {
  [ROLES.CUSTOMER]: {
    defaultLens: LENSES.CUSTOMER,
    allowedLenses: [LENSES.CUSTOMER],
  },
  [ROLES.AGENT]: {
    defaultLens: LENSES.AGENT,
    allowedLenses: [LENSES.AGENT, LENSES.CUSTOMER],
  },
  [ROLES.BANKER]: {
    defaultLens: LENSES.BANKER,
    allowedLenses: [LENSES.BANKER, LENSES.AGENT, LENSES.CUSTOMER],
  },
  [ROLES.BOSS]: {
    defaultLens: LENSES.BANKER,
    allowedLenses: [LENSES.BANKER, LENSES.AGENT, LENSES.CUSTOMER],
  },
};

/**
 * Normalise incoming role string to a known ROLES constant.
 * Falls back to CUSTOMER if unknown.
 *
 * @param {string} rawRole
 * @returns {string} normalised role id
 */
export function normalizeRole(rawRole) {
  const value = (rawRole || "").toLowerCase();
  switch (value) {
    case ROLES.AGENT:
      return ROLES.AGENT;
    case ROLES.BANKER:
      return ROLES.BANKER;
    case ROLES.BOSS:
      return ROLES.BOSS;
    case ROLES.CUSTOMER:
    default:
      return ROLES.CUSTOMER;
  }
}

/**
 * Get role configuration (defaultLens + allowedLenses).
 * If role is unknown, returns CUSTOMER config.
 *
 * @param {string} role
 * @returns {{ defaultLens: string, allowedLenses: string[] }}
 */
export function getRoleConfig(role) {
  const normalised = normalizeRole(role);
  return ROLE_LENS_MAP[normalised] || ROLE_LENS_MAP[ROLES.CUSTOMER];
}

/**
 * Get default lens for a given role.
 *
 * @param {string} role
 * @returns {string} lens id
 */
export function getDefaultLensForRole(role) {
  return getRoleConfig(role).defaultLens;
}

/**
 * List of allowed lenses for a given role.
 *
 * @param {string} role
 * @returns {string[]} array of lens ids
 */
export function getAllowedLensesForRole(role) {
  return getRoleConfig(role).allowedLenses;
}

/**
 * Check whether a lens is allowed for this role.
 *
 * @param {string} role
 * @param {string} lens
 * @returns {boolean}
 */
export function isLensAllowedForRole(role, lens) {
  const lenses = getAllowedLensesForRole(role);
  return lenses.includes(lens);
}
