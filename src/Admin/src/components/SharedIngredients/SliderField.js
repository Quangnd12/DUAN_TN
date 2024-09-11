// src/components/SharedIngredients/SliderField.jsx

import React, { forwardRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const SliderField = forwardRef(({ label, min, max, value, onChange }, ref) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Slider
      ref={ref}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full"
    />
    <p className="text-sm text-gray-500 mt-1">{value}</p>
  </div>
));

export default SliderField;
