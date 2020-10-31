import type { AppProps } from "next/app";
import { useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5555";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      console.log(data);
    });
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
