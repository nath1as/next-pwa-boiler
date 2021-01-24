import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  height: 100%;
  width: 100%;
  user-select: none;
 * {
  user-select: none;
  scrollbar-width: none;
  *,
  *::after,
  *::before {
    outline: none;
    padding: 0;
    margin: 0;
    user-drag: none;
    font-size: 14px;
  }
  input, textarea {
    user-select: auto;
    pointer-events: auto;
    user-drag: auto;
    cursor: pointer;
  }
  img {
    pointer-events: none;
  }
  a {
    color: ${(props) => props.theme.links};
    text-decoration: none;
    outline:none;
    font-size: var(--size1);
  }
  ul {
    padding: 0;
    list-style-type: none;
  }
  li {
    padding: 0;
    list-style-type: none;
  }
  body {
    background: ${(props) => props.theme.body};
    height: 100vh;
    width: 100vw;
    font-family: Merriweather;
    overflow: hidden;
    touch-action: pan-y;
  }
  :root {
    // --bigFont: 'Erica One', regular;
    // heights
      --headerHeight: 45px;
      --footerHeight: 0px;
      --borderHeight: 0.2vh;
    // spacing
      --ratio: 1.2;
     --size-5: calc(var(--size-4) / var(--ratio));
      --size-4: calc(var(--size-3) / var(--ratio));
      --size-3: calc(var(--size-2) / var(--ratio));
      --size-2: calc(var(--size-1) / var(--ratio));
      --size-1: calc(var(--size0) / var(--ratio));
      --size0: 1rem;
      --size1: calc(var(--size0) * var(--ratio));
      --size2: calc(var(--size1) * var(--ratio));
      --size3: calc(var(--size2) * var(--ratio));
      --size4: calc(var(--size3) * var(--ratio));
      --size5: calc(var(--size4) * var(--ratio));
  }
`;

const BasicLayout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
};

export default BasicLayout;
