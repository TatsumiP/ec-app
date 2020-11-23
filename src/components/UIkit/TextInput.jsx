import React from 'react';
import TextField from "@material-ui/core/TextField";

const TextInput = (props) => {
    return (
        <TextField
            fulleWidth={props.fullWidth} // falseにすると適切な幅になる
            label={props.label}
            margin="dense"
            multiline={props.multiline}
            required={props.required}
            rows={props.rows}
            value={props.value}
            type={props.type}
            onChange={props.onChange}
        />
    );
};

export default TextInput;