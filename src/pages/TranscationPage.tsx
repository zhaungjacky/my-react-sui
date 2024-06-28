import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Container from "@mui/material/Container/Container";
import TextField from "@mui/material/TextField/TextField";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useContext, useEffect, useState } from "react";
import bech32ToUnit8Array from "../utils/bech32ToUnit8Array";

import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import {
  encodeSuiPrivateKey,
  decodeSuiPrivateKey,
} from "@mysten/sui.js/cryptography";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import Typography from "@mui/material/Typography/Typography";
import requeryAccount from "../utils/queryAcount";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import IconButton from "@mui/material/IconButton/IconButton";
import handleCopyClipboard from "../utils/copyToClipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2 from "@mui/icons-material/QrCode2";
import QRModalPage from "./QRModalPage";
import setStatusMessage from "../utils/setStatusMessage";
import Tooltip from "@mui/material/Tooltip/Tooltip";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MyProvider } from "../router/MyRouter";

// const client = new SuiClient({ url: getFullnodeUrl("devnet") });
// const client = new SuiClient({ url: getFullnodeUrl("mainnet") });

function TranscationPage() {
  const {netType} = useContext(MyProvider);
  const client = new SuiClient({ url: getFullnodeUrl(netType) });
  const [coinNumber, setCoinNumber] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState(
    process.env.REACT_APP_KRAKEN_RECEIVER_ADDRESS
  );
  const [privateKey, setPrivateKey] = useState<number[]>([] as number[]);

  const [address, setAddress] = useState(process.env.REACT_APP_MY_ADDRESS);
  const [suiNumber, setSuiNumber] = useState<number>(0);
  const [receiverNumber, setReceiverNumber] = useState<number>(0);
  const [clipboardStatus, setClipboardStatus] = useState<string | null>(null);
  const [obsecureText, setObsecureText] = useState<"password" | "text">(
    "password"
  );
  const [privateKeyString, setPrivateKeyString] = useState<string | null>();

  const [openQRModal, setOpenQRModal] = useState(false);
  const handleOpenCloseQRModal = () => setOpenQRModal((prev) => !prev);
  const handleCloseQRModal = () => setOpenQRModal(false);



  const disableTransfer = !coinNumber || !privateKeyString  || !receiverAddress;

  useEffect(() => {
    setAddress(process.env.REACT_APP_MY_ADDRESS);

    setReceiverAddress(process.env.REACT_APP_RECEIVER_ADDRESS);
  }, [netType]);

  useEffect(() => {
    if (
      address === null ||
      address === undefined ||
      receiverAddress === undefined
    ) {
      return;
    }
    requeryAccount(
      client,
      address,
      setSuiNumber,
      receiverAddress,
      setReceiverNumber
    );
  }, [address, receiverAddress,netType]);

  useEffect(() => {

    setReceiverAddress(process.env.REACT_APP_RECEIVER_ADDRESS);

  }, []);

  const transferCoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (privateKey === undefined) return;
    if (privateKeyString === undefined && privateKeyString === null) return;
    if (receiverAddress === null || receiverAddress === undefined) return;
    if (coinNumber === 0 || receiverAddress?.length !== 66) {
      setStatusMessage("Can Not Transfer 0 SUI", setClipboardStatus, 1000);

      return;
    }

    const data = bech32ToUnit8Array(privateKeyString!);
    setPrivateKey(data);

    const unit8Arr = Uint8Array.from(data);

    const encoded = encodeSuiPrivateKey(unit8Arr, "ED25519");

    const { secretKey } = decodeSuiPrivateKey(encoded);
    // use schema to choose the correct key pair
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const txb = new TransactionBlock();

    const [coin] = txb.splitCoins(txb.gas, [coinNumber]);

    // transfer the split coin to a specific address
    txb.transferObjects([coin], receiverAddress);

    //excute
    await client
      .signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb,
        requestType: "WaitForEffectsCert",
        // options: {
        //   showEffects: true,
        // },
      })
      .then((txRes) => {
        const status = txRes.confirmedLocalExecution;
        // console.log(txRes.confirmedLocalExecution)

        if (!status) {
          if (address === undefined || receiverAddress === undefined) return;

          requeryAccount(
            client,
            address,
            setSuiNumber,
            receiverAddress,
            setReceiverNumber
          );

          setCoinNumber(0);
          // setObsecureText("text");
          setPrivateKeyString(null);
          setStatusMessage("transfer success", setClipboardStatus, 1000);


          return;
        }
        return txRes;
      })
      .catch((err) => {
        throw new Error(`Error thrown: Could not split coin!: ${err}`);
      });
  };

  // coin number
  const handleCoinNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // console.log(e.currentTarget.value)
    setCoinNumber(parseFloat(e.currentTarget.value));
  };

  //receiver address
  const handleReciverAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // console.log(e.currentTarget.value)
    // const timer = setTimeout(()=>{

      setReceiverAddress(e.currentTarget.value);
    // },1500);

    // return ()=> clearTimeout(timer);
  };

  const handlePrivateKeyStringChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // console.log(e.currentTarget.value)
    setPrivateKeyString(e.currentTarget.value);
  };

  const toggleObsecureText = () => {
    setObsecureText((prev) => (prev === "text" ? "password" : "text"));
  };

  const coinNumberHelpText= coinNumber > 0 ? `Transfer number 1 billion = 1 SUI...  Transfer Amount: ${coinNumber / 1000000000} SUI` :"Transfer Number 1 billion = 1 SUI";

  return (
    <Container component="form" onSubmit={transferCoin}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          flexDirection: "column",
          margin: "50px auto",
          width: { xs: "90%", md: "70%", lg: "50%" },
        }}
      >
        <Typography> sender: {suiNumber}</Typography>
        <Typography> receiver: {receiverNumber}</Typography>

        <TextField
          value={coinNumber}
          type="number"
          onChange={handleCoinNumberChange}
          helperText={coinNumberHelpText} 
          fullWidth
          required
        />

        <TextField
          // value={coinNumber}
          type={obsecureText}
          onChange={handlePrivateKeyStringChange}
          helperText="Private key"
          fullWidth
          required
       
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="copy">
                  <IconButton onClick={toggleObsecureText}>
                    {obsecureText === "password" ? (
                      <VisibilityIcon sx={{color:"green"}}/>
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          value={receiverAddress}
          type="string"
          onChange={handleReciverAddressChange}
          required
          helperText="Receiver address required vaild sui address"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="copy">
                  <IconButton   
                    onClick={() =>
                      handleCopyClipboard(receiverAddress, setClipboardStatus)
                    }
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="QR code">
                  <IconButton onClick={handleOpenCloseQRModal}>
                    <QrCode2 />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" disabled={disableTransfer}>Transfer</Button>
        {openQRModal ? (
          <QRModalPage
            address={receiverAddress!}
            openQRModal={openQRModal}
            handleCloseQRModal={handleCloseQRModal}
            info={"receiver sui address"}
          />
        ) : null}
        {clipboardStatus ? (
          <Typography
            sx={{ color: clipboardStatus.startsWith("can") ? "red" : "green" }}
          >
            {clipboardStatus}
          </Typography>
        ) : null}
      </Box>
    </Container>
  );
}

export default TranscationPage;
