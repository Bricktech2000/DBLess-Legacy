import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

// https://mui.com/material-ui/react-text-field/
// https://mui.com/material-ui/customization/theming/
// https://dtuto.com/questions/4662/how-to-change-the-border-color-of-material-ui-lt-textfield-gt

const StyledTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'var(--gray2)',
    },
    '& label': {
      color: 'var(--gray1)',
    },
    '& input': {
      color: 'var(--gray2)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--gray1)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--gray3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--gray2)',
      },
    },
  },
})(TextField);

const CustomTextFieldOutlined = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <StyledTextField {...props} ref={ref} variant="outlined" fullWidth>
        {children}
      </StyledTextField>
    );
  }
);

CustomTextFieldOutlined.displayName = 'CustomTextFieldOutlined';

export default CustomTextFieldOutlined;
