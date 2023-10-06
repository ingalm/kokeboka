import React, { ChangeEvent } from 'react';
import "../../css/recipeCreator.css"
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    id: number;
    ingredientName: string;
    amount: number;
    measurementType: string;
    onRemove: (id: number) => void;
    onChange: (id: number, ingredientName: string, amount: number, measurementType: string) => void;
  }

function NewIngredient({id, ingredientName, amount, measurementType, onRemove, onChange}: Props) {

    const handleRemove = () => {
        onRemove(id);
    };

    const handleChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
        if(field === "name") {
            onChange(id, event.target.value, amount, measurementType);
        }
        else if (field === "amount") {
            onChange(id, ingredientName, Number(event.target.value), measurementType);
        }
        else if (field=== "measurement"){
            onChange(id, ingredientName, amount, event.target.value);
        }
    }

    return (
        <div className="NewIngredient">
            <TextField sx={{ width: { xs: '100%', sm: '50%', md: '30%' }}} onChange={handleChange("name")} label='Navn' variant='outlined'></TextField>
            <TextField sx={{ width: { xs: '80%', sm: '40%', md: '10%' }}} onChange={handleChange("amount")} type='number' label='Mengde' variant='outlined'></TextField>
            <TextField sx={{ width: { xs: '80%', sm: '40%', md: '10%' }}} onChange={handleChange("measurement")} label='Måleenhet' variant='outlined'></TextField>
            <IconButton onClick={handleRemove} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </div>
    );
}

export default NewIngredient;
