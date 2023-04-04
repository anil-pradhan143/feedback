import React from "react";
import { Typography, Paper } from "@mui/material";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";

import { MapRespectiveFields } from "./MapRespectiveFields";
import "./styles.css";

/**
 * @returns
 * Field mapper is responsible for mapping the fields and adding
 * proper label to the field
 */

export const FieldMapper = (props) => {
  const {
    fieldsFormData = [],
    currentPage = null,
    defaultValues = {},
    mandatoryArrayIndex = [],
    register = () => {},
    fieldSet = [],
    errors,
    setError,
    clearErrors,
    onChange,
    control
  } = props;

  return (
    <Grid container justifyContent="center" spacing={2}>
      {fieldSet.map((items, index) => {
        return (
          <Grid key={items?.label} item xs={12}>
            <Typography className={"textStyleFieldLabel"}>
              {items?.label}
              {mandatoryArrayIndex[index] !== index && " (optional)"}
            </Typography>
            <MapRespectiveFields
              {...{
                items,
                currentPage,
                register,
                fieldsFormData,
                mandatoryArrayIndex,
                defaultValues,
                index,
                errors,
                setError,
                clearErrors,
                onChange,
                control
              }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

FieldMapper.propTypes = {
  fieldsFormData: PropTypes.object,
  currentPage: PropTypes.number,
  defaultValues: PropTypes.object,
  mandatoryArrayIndex: PropTypes.array,
  register: PropTypes.func,
  fieldSet: PropTypes.array,
  errors: PropTypes.object,
  setError: PropTypes.func,
  clearErrors: PropTypes.func,
  onChange: PropTypes.func,
};
