import React, { FC, ReactNode, MouseEvent, CSSProperties } from 'react';
import Button from '@material-ui/core/Button';

interface CustomButtonProps {
  variant?: string;
  color?: string;
  name: string;
  handler: (event: MouseEvent<HTMLButtonElement>) => void;
  property?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({
  variant,
  color,
  name,
  handler,
  property,
  style,
  disabled,
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={handler}
      className={property}
      style={style}
      disabled={disabled}
    >
      {name}
    </Button>
  );
};

export default CustomButton;