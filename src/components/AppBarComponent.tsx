import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import WalletInfo from "./WalletInfo";
import HomeIcon from "@mui/icons-material/Home";
import WalletIcon from '@mui/icons-material/Wallet';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { MyProvider } from "../router/MyRouter";
import Typography from "@mui/material/Typography/Typography";
import Button from "@mui/material/Button/Button";
import Tooltip from "@mui/material/Tooltip/Tooltip";

export default function AppBarComponent() {

  const {netType,setNetType} = React.useContext(MyProvider);
  const toggleNetType = () =>{
    if(netType === "devnet"){
      setNetType("mainnet");
    } else {
      setNetType("devnet");
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ color: "white", background: "black" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{width:"200px",marginRight:"60px"}}>
          <Tooltip  title="Current Net Type">
            <Typography>{netType.toLocaleUpperCase()}</Typography>
            </Tooltip>
          </Box>
          <Box sx={{width:"360px"}}>
          <Tooltip  title="Toggle Net Type">
            <Button onClick={toggleNetType}>Toggle Net</Button>
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", gap: "60px" ,ml:"200px",justifyContent:"flex-end"}}>
            <Link to="/">
            <Tooltip  title="Go To Index">
              <IconButton>
                <HomeIcon sx={{ flexGrow: 1, color: "white" }} />
              </IconButton>
              </Tooltip>
            </Link>
            <Link to="/home">
            <Tooltip  title="Go To Home">
              <IconButton>
                <WalletIcon sx={{ flexGrow: 1, color: "white" }} />
              </IconButton>
              </Tooltip>
            </Link>
            <Link to="/transcation">
            <Tooltip  title="Go To Transcation">
              <IconButton>
                <CurrencyExchangeIcon sx={{ flexGrow: 1, color: "white" }} />
              </IconButton>
              </Tooltip>
            </Link>
            
          </Box>
          <WalletInfo />
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
