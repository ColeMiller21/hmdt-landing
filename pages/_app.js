import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";
import { chain, WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../utils/walletHelper";
import { UserProvider } from "../context/UserContext";
import { SessionProvider } from "../context/SessionContext";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import cookie from "js-cookie";

export default function App({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);

  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  };

  useEffect(() => {
    window.addEventListener("resize", appHeight);
    appHeight();
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            initialChain={chain.mainnet}
            theme={midnightTheme()}
          >
            <SessionProvider>
              <UserProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </UserProvider>
            </SessionProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </>
    );
  }
}
