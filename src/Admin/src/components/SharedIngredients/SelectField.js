// src/components/SharedIngredients/SelectField.js

import React, { forwardRef } from "react";
import Select from "react-select";

const SelectField = forwardRef(({ label, id, name, options, value, onChange, isMulti = false }, ref) => (
  <div className="z-50">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <Select
      ref={ref}
      id={id}
      name={name}
      options={options}
      value={value}
      onChange={onChange}
      isMulti={isMulti}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  </div>
));

export default SelectField;
