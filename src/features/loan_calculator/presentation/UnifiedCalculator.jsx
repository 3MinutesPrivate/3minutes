import React from "react";
import {
  LENSES,
  getRoleConfig,
  normalizeRole,
} from "../logic/roles.js";

import CustomerView from "./views/CustomerView.jsx";
import AgentView from "./views/AgentView.jsx";
import BankerView from "./views/BankerView.jsx";

// FAB 按钮组件（稍后会在 platform/layout/FabLensSwitcher.jsx 中实现）
import FabLensSwitcher from "../../../platform/layout/FabLensSwitcher.jsx";

/**
 * 透镜元数据：用于 FAB 上显示的标签 & 说明文案。
 * 如需改文案，只改这里即可。
 */
const LENS_META = {
  [LENSES.CUSTOMER]: {
    id: LENSES.CUSTOMER,
    label: "Customer",
    description: "Customer view – education & visualisation.",
  },
  [LENSES.AGENT]: {
    id: LENSES.AGENT,
    label: "Agent",
    description: "Agent view – snap quote, DSR and battle tools.",
  },
  [LENSES.BANKER]: {
    id: LENSES.BANKER,
    label: "Banker",
    description: "Banker view – income recognition & risk cockpit.",
  },
};

/**
 * UnifiedCalculator
 *
 * 统一的贷款计算器容器，根据「角色」+「当前透镜」决定渲染哪个视图。
 *
 * Props:
 *  - currentUser: {
 *      id?: string;
 *      name?: string;
 *      email?: string;
 *      phone?: string;
 *      role?: "customer" | "agent" | "banker" | "boss";
 *    }
 *  - initialLens?: "customer" | "agent" | "banker" （可选，覆盖默认 lens）
 */
function UnifiedCalculator({ currentUser, initialLens }) {
  const role = normalizeRole(currentUser?.role || "customer");
  const roleConfig = getRoleConfig(role);

  // allowedLenses: 针对当前角色的白名单
  const allowedLenses = roleConfig.allowedLenses || [LENSES.CUSTOMER];

  // 初始透镜：优先使用外部传入的 initialLens（若在白名单内），否则用角色默认。
  const resolvedInitialLens = React.useMemo(() => {
    if (initialLens && allowedLenses.includes(initialLens)) {
      return initialLens;
    }
    return roleConfig.defaultLens;
  }, [initialLens, allowedLenses, roleConfig.defaultLens]);

  const [activeLens, setActiveLens] = React.useState(resolvedInitialLens);

  // 当角色变化或 allowedLenses 变化时，确保 activeLens 仍然合法
  React.useEffect(() => {
    if (!allowedLenses.includes(activeLens)) {
      setActiveLens(roleConfig.defaultLens);
    }
  }, [allowedLenses, activeLens, roleConfig.defaultLens]);

  // 仅当该角色有超过 1 个 lens 时才显示 FAB
  const canSwitchLens = allowedLenses.length > 1;

  // 当前透镜对应的视图组件
  let view = null;
  switch (activeLens) {
    case LENSES.AGENT:
      view = <AgentView currentUser={currentUser} />;
      break;
    case LENSES.BANKER:
      view = <BankerView currentUser={currentUser} />;
      break;
    case LENSES.CUSTOMER:
    default:
      view = <CustomerView currentUser={currentUser} />;
      break;
  }

  // 把 allowedLenses 转换为 FAB 可用的选项：[{id,label,description}, ...]
  const lensOptions = React.useMemo(
    () =>
      allowedLenses.map((id) => {
        const meta = LENS_META[id] || { id, label: id, description: "" };
        return meta;
      }),
    [allowedLenses]
  );

  return (
    <div className="relative">
      {/* 主视图区域（Customer / Agent / Banker） */}
      {view}

      {/* 仅 Agent / Banker / Boss 等高权限角色显示 FAB */}
      {canSwitchLens && (
        <FabLensSwitcher
          activeLens={activeLens}
          options={lensOptions}
          onChange={setActiveLens}
        />
      )}
    </div>
  );
}

export default UnifiedCalculator;
