// src/components/SharedIngredients/SliderField.jsx

import React, { forwardRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const RangeSliderField = forwardRef(({ label, min, max, value, onChange,onAfterChange }, ref) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Slider
      ref={ref}
      range
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      onAfterChange={onAfterChange}
      className="w-full"
    />
    <div className="flex justify-between text-sm text-gray-500 mt-1">
      <span>{value[0]}</span>
      <span>{value[1]}</span>
    </div>
  </div>
));

export default RangeSliderField;
