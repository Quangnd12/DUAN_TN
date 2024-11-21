// src/components/SharedIngredients/DatePickerField.js

import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = forwardRef(({ label, selected, onChange, id,disabled,minDate }, ref) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <DatePicker
      ref={ref}
      selected={selected}
      onChange={onChange}
      minDate={new Date()} 
      dateFormat="yyyy-MM-dd"
      className="w-96 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      id={id}
      name={id}
      customInput={<input autoComplete="off" />} 
      disabled={disabled}
    />
  </div>
));

export default DatePickerField;
