import React from 'react';
import { Button, buttonBaseCss, buttonIconBaseCss, IDecoratedButtonProps } from './Button';
import { css } from 'emotion';

const labeledButton = css`
  ${buttonBaseCss};
  width: 55px;
`;

const buttonTextLabel = css`
  ${buttonIconBaseCss};
  height: 14px;
  font-size: 14px;
  font-family: Verdana, sans-serif;
`;

export default function RectangleButton(props: IDecoratedButtonProps) {
  return (
    <Button
      {...props}
      styles={{
        button: labeledButton,
        label: buttonTextLabel,
      }}
    />
  );
}
