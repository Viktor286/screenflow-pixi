import React from 'react';
import { css } from 'emotion';
import BaseButton, { IDecoratedButtonProps } from './BaseButton';
import {
  buttonsTheme,
  buttonBaseCss,
  buttonIconBaseCss,
  blueButtonsTheme,
  yellowButtonsTheme,
} from './ButtonStyles';

const squareButton = (theme: buttonsTheme) => {
  let themeDeclaration = '';
  if (theme === 'blue') themeDeclaration = blueButtonsTheme;
  if (theme === 'yellow') themeDeclaration = yellowButtonsTheme;

  return css`
    ${buttonBaseCss};
    width: 45px;
    ${themeDeclaration}
  `;
};

const buttonLabel = css`
  ${buttonIconBaseCss};
  height: 21px;
  font-size: 21px;
  font-family: Georgia, sans-serif;
`;

export default function SquareButton(props: IDecoratedButtonProps) {
  return (
    <BaseButton
      {...props}
      styles={{
        button: squareButton(props.theme),
        label: buttonLabel,
      }}
    />
  );
}
