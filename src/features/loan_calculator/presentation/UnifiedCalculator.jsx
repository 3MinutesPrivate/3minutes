import React from "react";
import {
  LENSES,
  getRoleConfig,
  normalizeRole,
} from "../logic/roles.js";

import CustomerView from "./views/CustomerView.jsx";
import AgentView from "./views/AgentView.jsx";
import BankerView from "./views/BankerView.jsx";
import FabLensSwitcher from "../../../platform/layout/FabLensSwitcher.jsx";

/**
 * 透镜元数据：用于 FAB 上展示 label / 描述。
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
 * 统一贷款计算器入口，根据「当前用户角色」+「activeLens」渲染不同视图。
 *
 * Props:
 *  - currentUser: { id?, name?, email?, phone?, role? }
 *  - initialLens?: "customer" | "agent" | "banker"  // 可选
 */
function UnifiedCalculator({ currentUser, initialLens }) {
  const role = normalizeRole(currentUser?.role || "customer");
  const roleConfig = getRoleConfig(role);
  const allowedLenses = roleConfig.allowedLenses || [LENSES.CUSTOMER];

  // 计算初始 lens：如果外部传入且在白名单内则使用，否则用角色默认
  const resolvedInitialLens = React.useMemo(() => {
    if (initialLens && allowedLenses.includes(initialLens)) {
      return initialLens;
    }
    return roleConfig.defaultLens;
  }, [initialLens, allowedLenses, roleConfig.defaultLens]);

  const [activeLens, setActiveLens] = React.useState(resolvedInitialLens);

  // 当 allowedLenses 或 roleConfig 改变时，保证 activeLens 仍然合法
  React.useEffect(() => {
    if (!allowedLenses.includes(activeLens)) {
      setActiveLens(roleConfig.defaultLens);
    }
  }, [allowedLenses, activeLens, roleConfig.defaultLens]);

  const canSwitchLens = allowedLenses.length > 1;

  // 视图选择
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
      {view}

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
