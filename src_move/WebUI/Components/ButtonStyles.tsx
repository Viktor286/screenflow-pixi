import { css } from 'emotion';

export type buttonsTheme = 'yellow' | 'blue';

export const blueButtonsTheme = css`
  background: #395062;
  border: 1px solid #5f9ae2;
  &:hover {
    background: #416685;
  }
`;

export const yellowButtonsTheme = css`
  background: #625639;
  border: 1px solid #e2b65f;
  &:hover {
    background: #8f7a4a;
  }
`;

export const buttonBaseCss = css`
  height: 45px;
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
