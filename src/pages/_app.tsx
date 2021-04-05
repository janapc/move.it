import { AppProps } from "next/app";
import { UserProvider } from "../contexts/UserContext";

import "../styles/global.css";

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
