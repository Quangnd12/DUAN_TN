import React, { forwardRef } from "react";

const TextareaField = forwardRef(({ label, id, name, value, onChange, required = false }, ref) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <textarea
      ref={ref}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required={required}
      rows={4} 
    />
  </div>
));

export default TextareaField;
