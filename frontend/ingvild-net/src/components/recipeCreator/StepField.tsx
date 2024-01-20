import React from 'react';
import "../../css/recipeCreator.css"
import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    index: number;
    type: number;
    info: string;
    onRemove: (id: number) => void;
    onChange: (id: number, field: string, value: string|number) => void;
  }

function StepField({index, type, info, onRemove, onChange}: Props) {

    const handleRemove = () => {
        onRemove(index);
    };

    const handleChange = (field: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        onChange(index, field, value);
    }

    return (
        <div className="NewStep">
            <TextField sx={{ width: { xs: '70%', sm: '60%', md: '50%' }}} onChange={(event) => handleChange("info", event)} id="outlined-basic" label="Neste steg..." variant="outlined" />
            <IconButton onClick={handleRemove} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </div>
    );
}

export default StepField;
