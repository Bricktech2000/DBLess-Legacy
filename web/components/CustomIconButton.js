import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const StyledButton = withStyles({
  root: {
    '&': {
      color: 'var(--gray1)',
    },
    '&:hover': {
      color: 'var(--gray2)',
    },
  },
})(IconButton);

const CustomIconButton = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <StyledButton {...props} ref={ref} variant="outlined">
      {children}
    </StyledButton>
  );
});

CustomIconButton.displayName = 'CustomIconButton';

export default CustomIconButton;
