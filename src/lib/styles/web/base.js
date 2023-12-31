import { css } from 'styled-components';
import colors from '../colors';

export const base = css`
  * {
    -webkit-overflow-scrolling: touch;
    touch-action: manipulation;

    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }

  body {
    font-family: 'Metropolis', sans-serif;
    height: 100%;
    overflow: hidden;
    position: fixed;
    width: 100%;
    color: ${({ theme }) => theme.tokens?.content?.emphasis};
    background-color: ${({ theme }) => theme.tokens?.background?.main};
  }

  #app {
    height: 100%;
    position: relative;
  }

  [tabindex]:focus {
    outline: none;
  }

  a,
  .link {
    color: ${({ theme }) => theme.tokens?.content?.primary};
    font-weight: 600;
    text-decoration: none;
  }

  a:not([disabled]) {
    cursor: pointer;
  }

  button {
    background-color: transparent;
    border: 0;
    cursor: pointer;
    margin: 0;
    outline: none;
    padding: 0;
  }

  .grecaptcha-badge {
    z-index: 2;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: ${colors.nd140} !important;
  }
`;
