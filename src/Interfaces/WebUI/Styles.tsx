import { css } from 'emotion';

export const mainContainer = css`
  display: flex;
  width: auto;
  left: 50%;
  transform: translateX(-50%);
  margin: 10px auto 0;
  padding: 0;
  position: absolute;
  justify-content: center;
`;

export const buttonBase = css`
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
`;

export const squareButton = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  margin: 0 4px;
  opacity: 0.6;
  color: white;
  border-radius: 0.5rem;
  background: #395062;
  border: 1px solid #5f9ae2;
  ${buttonBase}
`;

export const buttonIcon = css`
  padding: 0;
  margin: 0;
  height: 21px;
  font-size: 21px;
  font-family: Georgia, sans-serif;
  text-align: center;
  line-height: 100%;
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
  ${buttonBase}
`;

export const buttonTextLabel = css`
  ${buttonIcon}
  font-size: 14px;
  height: 14px;
  font-family: Verdana, sans-serif;
`;

export const labeledButtonCss = css`
  ${squareButton}
  width: 55px;
`;
