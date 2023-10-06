import React from 'react';
import "../../css/recipeCreator.css"
import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    id: number;
    info: string;
    onRemove: (id: number) => void;
    onChange: (id: number, info: string) => void;
  }

function NewStep({id, info, onRemove, onChange}: Props) {

    const handleRemove = () => {
        onRemove(id);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(id, event.target.value);
    }

    return (
        <div className="NewStep">
            <TextField sx={{ width: { xs: '70%', sm: '60%', md: '50%' }}} onChange={handleChange} id="outlined-basic" label="Neste steg..." variant="outlined" />
            <IconButton onClick={handleRemove} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </div>
    );
}

export default NewStep;
