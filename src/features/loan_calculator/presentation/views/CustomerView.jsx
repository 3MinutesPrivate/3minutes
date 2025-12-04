import React from "react";
// 过渡期：直接复用现有 CustomerView 组件
import LegacyCustomerView from "../../../../components/modeA/CustomerView.jsx";

function CustomerView(props) {
  return <LegacyCustomerView {...props} />;
}

export default CustomerView;
