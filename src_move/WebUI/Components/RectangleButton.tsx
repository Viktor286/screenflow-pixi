import React from 'react';
import BaseButton, { IDecoratedButtonProps } from './BaseButton';
import {
  blueButtonsTheme,
  buttonBaseCss,
  buttonIconBaseCss,
  buttonsTheme,
  yellowButtonsTheme,
} from './ButtonStyles';
import { css } from 'emotion';

const rectangleButton = (theme: buttonsTheme) => {
  let themeDeclaration = '';
  if (theme === 'blue') themeDeclaration = blueButtonsTheme;
  if (theme === 'yellow') themeDeclaration = yellowButtonsTheme;

  return css`
    ${buttonBaseCss};
    width: 55px;
    ${themeDeclaration}
  `;
};

const buttonTextLabel = css`
  ${buttonIconBaseCss};
  height: 14px;
  font-size: 14px;
  font-family: Verdana, sans-serif;
`;

export default function RectangleButton(props: IDecoratedButtonProps) {
  return (
    <BaseButton
      {...props}
      styles={{
        button: rectangleButton(props.theme),
        label: buttonTextLabel,
      }}
    />
  );
}
