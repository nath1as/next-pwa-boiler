import "../styles/globals.css";
import "../styles/fonts.css";
import { ThemeProvider } from "styled-components";
import themes from "../styles/themes";
import Global from "../styles/Global";
import { FirebaseProvider } from "../firebase";
import { RecoilRoot } from "recoil";
import { AuthProvider } from '../firebase/auth.js';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <RecoilRoot>
          <ThemeProvider theme={themes.peach}>
            <Global>
              <Component {...pageProps} />
            </Global>
          </ThemeProvider>
      </RecoilRoot>
    </AuthProvider>
  );
}

export default MyApp;
