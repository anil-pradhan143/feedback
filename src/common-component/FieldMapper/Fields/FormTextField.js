import React from "react";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

import "../styles.css";

/**
 * @returns
 * Form Fields with respective validations
 */

export const FormTextField = (props) => {
  const { name, isFieldRequired, rules, errors, items, onChange, control } =
    props;
  const { pattern = {} } = rules || {};
  const formOnchange = onChange;
  const errorMapper = (error) => {
    const errorText = error.message || "Error";
    return errorText;
  };
  return (
    <>
      <Controller
        control={control}
        name={name}
        type={name}
        rules={{
          required: isFieldRequired,
          pattern,
        }}
        render={({ field: { onChange, value = "" } }) => (
          <TextField
            name={name}
            type={name}
            onChange={(event) => {
              const val = event.target.value || ''
              const scriptFilteredValue = val.replace("<script","O_o");
              onChange(scriptFilteredValue);
              formOnchange(name, scriptFilteredValue);
            }}
            className={"textStyleInputField"}
            id={items?.value}
            label=""
            value={value}
            fullWidth
            sx={{color:'#0555A4'}}
          />
        )}
        
      />

      {errors?.[items.value] && (
        <Typography className={"errorTextStyle"} variant={"caption"}>
          {errorMapper(errors?.[items.value])}
        </Typography>
      )}
    </>
  );
};

FormTextField.propTypes = {
  name: PropTypes.string,
  register: PropTypes.func,
  errors: PropTypes.object,
  items: PropTypes.object,
  setError: PropTypes.func,
};
