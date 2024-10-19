import React from "react";

const Dropdown = ({ selectedOption, setSelectedOption, children }) => {
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div>
      <label htmlFor="course" className="mb-2 block font-bold">
        Select a course:
      </label>
      <select
        id="course"
        value={selectedOption}
        onChange={handleSelectChange}
        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
      >
        <option value="">-- Please choose an option --</option>
        {children}
      </select>
    </div>
  );
};

export default Dropdown;
