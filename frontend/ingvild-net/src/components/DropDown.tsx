import React, { useState } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
    field: string;
    options: string[];
    onChange: (field: string, value: string) => void;
}

function DropDown({field, options, onChange }: Props) {
  const [selectedOption, setSelectedOption] = useState('0');

  const handleOptionChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    onChange(field, newValue);

    console.log(selectedOption);
  };

  return (
    <Select
        value={selectedOption}
        onChange={handleOptionChange}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
    >
        {options.map((option, index) => (
            <MenuItem key={index} value={index}>
            {option}
            </MenuItem>
        ))}
    </Select>
  );
}

export default DropDown;