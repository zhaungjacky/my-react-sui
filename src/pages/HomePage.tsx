import { CoinBalance, getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { getFaucetHost, requestSuiFromFaucetV1 } from "@mysten/sui.js/faucet";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box/Box";
import Container from "@mui/material/Container/Container";
import requeryAccount from "../utils/queryAcount";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
// import Dotenv from "dotenv";
import { MyProvider } from "../router/MyRouter";


export const balance = (balance: CoinBalance) => {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};
// const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });
// const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });

function HomePage() {
  const {netType} = useContext(MyProvider);
  const [address, setAddress] = useState(process.env.REACT_APP_MY_ADDRESS);
  const [suiNumber, setSuiNumber] = useState<number>(0);
  const suiClient = new SuiClient({ url: getFullnodeUrl(netType) });
  // Dotenv.config();

  const disabled = netType === "mainnet";
  useEffect(() => {
    // console.log("address: ",process.env.REACT_APP_MY_ADDRESS)
    setAddress(process.env.REACT_APP_MY_ADDRESS);
  }, [netType]);

  useEffect(() => {
    if (address === null || address === undefined) {
      return;
    }

    requeryAccount(suiClient, address, setSuiNumber);

  }, [address, suiNumber,netType]);

  async function getFaucet() {
    try {
      // store the JSON representation for the SUI the address owns before using faucet
      if (address === null || address === undefined) {
        return;
      }

      await requestSuiFromFaucetV1({
        // use getFaucetHost to make sure you're using correct faucet address
        // you can also just use the address (see Sui TypeScript SDK Quick Start for values)
        host: getFaucetHost("devnet"),
        recipient: address,
      })
        .then((res) => {
          if (res.error === null) {
            if(address === null || address === undefined) return;
            console.log(res);
            const timeout = setTimeout(
              () => requeryAccount(suiClient, address, setSuiNumber),
              1000
            );

            return () => clearTimeout(timeout);
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      throw new Error(String(err));
    }
  }
  return (
    <Container>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          margin: "50px auto",
        }}
      >
 
        <Typography>wallet balance: {suiNumber}</Typography>
        <Button onClick={getFaucet} color="primary" disabled={disabled}>
          Get Faucet
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
