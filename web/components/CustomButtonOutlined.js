import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const StyledButton = withStyles({
  root: {
    '&': {
      borderColor: 'var(--gray1)',
      color: 'var(--gray1)',
    },
    '&:hover': {
      borderColor: 'var(--gray3)',
    },
    '&.Mui-disabled': {
      borderColor: '#666',
      color: '#666',
    },
  },
})(Button);

const CustomButtonOutlined = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <StyledButton {...props} ref={ref} variant="outlined" fullWidth>
      {children}
    </StyledButton>
  );
});

CustomButtonOutlined.displayName = 'CustomButtonOutlined';

export default CustomButtonOutlined;
