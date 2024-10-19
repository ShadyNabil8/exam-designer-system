import React from "react";

const InputField = ({ value, fieldName, placeholder, onFieldChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-bold">{`${fieldName}:`}</span>
      <input
        className="rounded-md border p-2 focus:outline-none"
        name={fieldName}
        placeholder={placeholder}
        value={value}
        onChange={onFieldChange}
      ></input>
    </div>
  );
};

export default InputField;
