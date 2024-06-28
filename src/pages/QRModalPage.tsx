import Container from "@mui/material/Container/Container";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect } from "react";
import QRCode from "qrcode";
import Typography from "@mui/material/Typography/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 180,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: "32px",
  boxShadow: 24,
  p: 4,
  alignSelf: "center",
};

interface QrCodeProps {
  readonly address: string;
  readonly openQRModal: boolean;
  readonly handleCloseQRModal: () => void;
  readonly info: string;
}
export default function QRModalPage({
  address,
  openQRModal,
  handleCloseQRModal,
  info,
}: QrCodeProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      if (canvas) {
        QRCode.toCanvas(canvas, address, function (error) {
          if (error) console.error(error);
        });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [address]);
  return (
    <Container>
      <Box>
        <Modal
          open={openQRModal}
          onClose={handleCloseQRModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <canvas id="canvas"></canvas>
            <Typography>{info}</Typography>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
}
