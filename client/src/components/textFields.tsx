import React, { FC } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

interface StyleProps {
  bootstrapRoot: string;
  bootstrapInput: string;
  bootstrapFormLabel: string;
}

interface SimpleTextFieldProps {
  id?: string;
  label?: string;
  type?: string;
  defaultValue?: string;
  property?: string;
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  textArea?: string;
  placeholder?: string;
  style?: React.CSSProperties;
}

interface BootStrappedTextFieldProps {
  margin?: string;
  placeholder?: string;
  type?: string;
  property?: string;
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  classes: StyleProps;
  textArea?: string;
  style?: React.CSSProperties;
}

const styles = (theme: any) => ({
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
});

export const SimpleTextField: FC<SimpleTextFieldProps> = (props) => {
  const { id, label, type, defaultValue, property, handler, textArea, placeholder, style } = props;
  let multi = false;
  if (textArea === 'true') {
    multi = true;
  }
  return (
    <TextField
      id={id}
      label={label}
      multiline={multi}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className={property}
      style={style}
      onChange={handler}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        step: 300,
      }}
    />
  );
};

export const BootStrappedTextField: FC<BootStrappedTextFieldProps & WithStyles<StyleProps>> = (props) => {
  const { margin, placeholder, type, property, handler, classes, textArea, style } = props;
  let multi = false;
  if (textArea === 'true') {
    multi = true;
  }
  return (
    <TextField
      margin={margin}
      type={type}
      multiline={multi}
      placeholder={placeholder}
      className={property}
      onChange={handler}
      style={style}
      InputProps={{
        disableUnderline: true,
        classes: {
          root: classes.bootstrapRoot,
          input: classes.bootstrapInput,
        },
      }}
      InputLabelProps={{
        shrink: true,
        className: classes.bootstrapFormLabel,
      }}
    />
  );
};

BootStrappedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
  margin: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  property: PropTypes.string,
  handler: PropTypes.func.isRequired,
  style: PropTypes.object,
  textArea: PropTypes.bool,
};

SimpleTextField.propTypes = {
  margin: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  property: PropTypes.string,
  handler: PropTypes.func.isRequired,
  style: PropTypes.object,
  textArea: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
};

export default withStyles(styles)(BootStrappedTextField);