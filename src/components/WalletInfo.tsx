import Box from "@mui/material/Box/Box";
import Container from "@mui/material/Container/Container";
import IconButton from "@mui/material/IconButton/IconButton";
import Typography from "@mui/material/Typography/Typography";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect, useState } from "react";
import  handleCopyClipboard  from "../utils/copyToClipboard";
import getAddressShortcut from "../utils/getAddressShortcut";
import  QrCode2  from "@mui/icons-material/QrCode2"
import QRModalPage from "../pages/QRModalPage";
import Tooltip from "@mui/material/Tooltip/Tooltip";

function WalletInfo() {
  const [addressShortcut, setAddressShortcut] = useState("");
  const [address, setAddress] = useState(process.env.REACT_APP_MY_ADDRESS);
  const [clipboardStatus, setClipboardStatus] = useState<string | null>(null);

  const [openQRModal, setOpenQRModal] = useState(false);
  const handleOpenCloseQRModal = () => setOpenQRModal(prev=>!prev);
  const handleCloseQRModal = () => setOpenQRModal(false);

  useEffect(() => {
    setAddress(process.env.REACT_APP_MY_ADDRESS);
  }, []);

  useEffect(() => {
    if (address === null || address === undefined) {
      return;
    }
    getAddressShortcut(address,setAddressShortcut);
  }, [address]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography>wallet: {addressShortcut}</Typography>
        <Tooltip title="copy">

          <IconButton
            onClick={() => handleCopyClipboard(address, setClipboardStatus)}
          >
            <ContentCopyIcon sx={{color:"white"}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="QR code">

        <IconButton
          onClick={handleOpenCloseQRModal}
          >
          <QrCode2 sx={{color:"white"}}/>
        </IconButton>
          </Tooltip>
        {clipboardStatus ? (
          <Typography sx={{ color: "green" }}>{clipboardStatus}</Typography>
        ) : null}
        {openQRModal ? <QRModalPage address={address!} openQRModal={openQRModal} handleCloseQRModal={handleCloseQRModal } info={"sender sui address"}/>:null}
      </Box>
    </Container>
  );
}

export default WalletInfo;
