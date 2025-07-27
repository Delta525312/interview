import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* 1. Reset and Box Model */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 2. Responsive Font Scaling Base */
  html {
    font-size: 16px;

    @media (max-width: 1200px) {
      font-size: 15px;
    }
    @media (max-width: 992px) {
      font-size: 14px;
    }
    @media (max-width: 768px) {
      font-size: 13px;
    }
    @media (max-width: 576px) {
      font-size: 12px;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: background-color 0.3s ease, color 0.3s ease;
    line-height: 1.6;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* 3. Image and Media Scaling */
  img, video, canvas {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 4. Form Controls Reset (optional) */
  input, button, textarea, select {
    font: inherit;
    color: inherit;
  }

  /* 5. Scroll Behavior */
  html {
    scroll-behavior: smooth;
  }

  /* 6. Remove default focus outline but keep accessibility */
  button:focus, input:focus, textarea:focus, select:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export default GlobalStyles;
