import React, { ChangeEvent } from 'react';
import "../../css/recipeCreator.css"
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    index: number;
    ingredientName: string;
    amount?: number;
    measurementType?: string;
    onRemove: (id: number) => void;
    onChange: (id: number, field: string, value: string | number) => void;
  }

function IngredientField({index, ingredientName, amount, measurementType, onRemove, onChange}: Props) {

    const handleRemove = () => {
        onRemove(index);
    };

    const handleChange = (field: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        onChange(index, field, value);
    }

    return (
        <div className="NewIngredient">
            <TextField sx={{ width: { xs: '100%', sm: '50%', md: '30%' }}} onChange={(event) => handleChange("ingredient_name", event)} variant='outlined'></TextField>
            <TextField sx={{ width: { xs: '80%', sm: '40%', md: '10%' }}} onChange={(event) => handleChange("amount", event)} type='number' variant='outlined'></TextField>
            <TextField sx={{ width: { xs: '80%', sm: '40%', md: '10%' }}} onChange={(event) => handleChange("measurement_type", event)} variant='outlined'></TextField>
            <IconButton onClick={handleRemove} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </div>
    );
}

export default IngredientField;
