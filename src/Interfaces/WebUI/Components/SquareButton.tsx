import React from 'react';
import { Button, buttonBaseCss, buttonIconBaseCss, IDecoratedButtonProps } from './Button';
import { css } from 'emotion';

const squareButton = css`
  ${buttonBaseCss};
  width: 45px;
`;

const buttonLabel = css`
  ${buttonIconBaseCss};
  height: 21px;
  font-size: 21px;
  font-family: Georgia, sans-serif;
`;

export default function SquareButton(props: IDecoratedButtonProps) {
  return (
    <Button
      {...props}
      styles={{
        button: squareButton,
        label: buttonLabel,
      }}
    />
  );
}