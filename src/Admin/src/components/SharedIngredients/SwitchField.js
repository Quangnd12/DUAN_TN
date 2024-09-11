// src/components/SharedIngredients/SwitchField.js

import React, { forwardRef } from "react";
import Switch from "react-switch";

const SwitchField = forwardRef(({ label, checked, onChange }, ref) => (
  <div className="mb-4">
    <label className="flex items-center">
      <span className="text-sm font-medium text-gray-700 mr-3">{label}</span>
      <Switch
        ref={ref}
        checked={checked}
        onChange={onChange}
        onColor="#4F46E5"
        offColor="#E5E7EB"
        checkedIcon={false}
        uncheckedIcon={false}
        handleDiameter={22}
        height={28}
        width={50}
      />
    </label>
  </div>
));

export default SwitchField;
