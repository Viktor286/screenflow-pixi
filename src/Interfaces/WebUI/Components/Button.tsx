import React from 'react';
import { css } from 'emotion';

export interface IButtonProps {
  text: string;
  action: IAction;
  styles: IButtonStyles;
}

export interface IButtonStyles {
  button: string;
  label: string;
}

export interface IDecoratedButtonProps {
  text: string;
  action: IAction;
}

export interface IAction {
  (e: React.MouseEvent): any;
}

export const buttonBaseCss = css`
  height: 45px;
  background: #395062;
  border: 1px solid #5f9ae2;
  margin: 0 4px;
  opacity: 0.6;
  color: white;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
`;

export const buttonIconBaseCss = css`
  padding: 0;
  margin: 0;
  text-align: center;
  line-height: 100%;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
`;

export function Button({ text, action, styles }: IButtonProps) {
  return (
    <div className={styles.button} onClick={(e) => action(e)}>
      <div className={styles.label}>{text}</div>
    </div>
  );
}
