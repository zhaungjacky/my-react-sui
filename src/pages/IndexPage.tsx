import Box from "@mui/material/Box/Box";
import Container from "@mui/material/Container/Container";
import { Link } from "react-router-dom";

export default function IndexPage() {
  return (
    <Container>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          margin: "20px auto",
        }}
      >
 

        <div>
          <Link to="/home" style={{color:"red"}}>Home</Link>
        </div>
        <br />
        <br />

        <div>
          <Link to="/transcation">Transcation</Link>
        </div>
      </Box>
    </Container>
  );
}

