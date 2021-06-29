import React from 'react';
import { buttonsTheme } from './ButtonStyles';

export interface IButtonBase {
  text: string;
  action: Function;
}

export interface IButtonProps extends IButtonBase {
  styles: IButtonStyles;
}

export interface IButtonStyles {
  button: string;
  label: string;
}

export interface IDecoratedButtonProps extends IButtonBase {
  theme: buttonsTheme;
}

export default function BaseButton({ text, action, styles }: IButtonProps) {
  return (
    <div className={styles.button} onClick={(e: React.MouseEvent) => action(e)}>
      <div className={styles.label}>{text}</div>
    </div>
  );
}
