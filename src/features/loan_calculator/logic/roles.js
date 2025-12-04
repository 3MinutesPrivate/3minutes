// Role & Lens definitions for 3Minutes Loan Calculator
// 纯逻辑模块，无 React 依赖，可被 platform/auth、layout、feature 等多处复用。

/**
 * 应用级角色
 * - CUSTOMER: 终端购房者
 * - AGENT   : 房产代理
 * - BANKER  : 银行职员 / 信贷官
 * - BOSS    : 超级用户（拥有全部权限）
 */
export const ROLES = {
  CUSTOMER: "customer",
  AGENT: "agent",
  BANKER: "banker",
  BOSS: "boss",
};

/**
 * 贷款计算器的三种视角透镜（UI 视图）
 */
export const LENSES = {
  CUSTOMER: "customer",
  AGENT: "agent",
  BANKER: "banker",
};

/**
 * 对每种角色定义：
 * - defaultLens   : 默认打开的视角
 * - allowedLenses : 可切换到的视角列表
 *
 * 规则：
 *  - Customer 只能看 Customer 视角，不能切换
 *  - Agent    默认 Agent，可切 Customer
 *  - Banker   默认 Banker，可切 Banker/Agent/Customer
 *  - Boss     等同 Banker，但语义为“老板”
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
 * 归一化 role 字符串到 ROLES 常量；未知值一律当作 customer。
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
 * 获取某个角色的配置（defaultLens + allowedLenses）
 */
export function getRoleConfig(role) {
  const normalised = normalizeRole(role);
  return ROLE_LENS_MAP[normalised] || ROLE_LENS_MAP[ROLES.CUSTOMER];
}

/**
 * 获取某个角色的默认视角
 */
export function getDefaultLensForRole(role) {
  return getRoleConfig(role).defaultLens;
}

/**
 * 获取某个角色允许的视角列表
 */
export function getAllowedLensesForRole(role) {
  return getRoleConfig(role).allowedLenses;
}

/**
 * 判断某个 lens 对该角色是否可用
 */
export function isLensAllowedForRole(role, lens) {
  const lenses = getAllowedLensesForRole(role);
  return lenses.includes(lens);
}
