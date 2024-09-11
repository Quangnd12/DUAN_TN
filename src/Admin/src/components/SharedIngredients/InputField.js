// src/components/SharedIngredients/InputField.js

import React, { forwardRef } from "react";

const InputField = forwardRef(({ label, id, name, value, onChange, required = false }, ref) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      ref={ref}
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required={required}
    />
  </div>
));

export default InputField;
