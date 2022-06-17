import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const StyledButton = withStyles({
  root: {
    '&': {
      backgroundColor: 'var(--gray1)',
      color: '#000',
    },
    '&:hover': {
      backgroundColor: 'var(--gray2)',
    },
  },
})(Button);

const CustomButtonContained = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <StyledButton {...props} ref={ref} variant="outlined" fullWidth>
        {children}
      </StyledButton>
    );
  }
);

CustomButtonContained.displayName = 'CustomButtonContained';

export default CustomButtonContained;
