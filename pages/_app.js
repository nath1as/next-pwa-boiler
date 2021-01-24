import "../styles/globals.css";
import "../styles/fonts.css";
import { ThemeProvider } from "styled-components";
import themes from "../styles/themes";
import Global from "../styles/Global";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={themes.peach}>
      <Global>
        <Component {...pageProps} />
      </Global>
    </ThemeProvider>
  );
}

export default MyApp;
