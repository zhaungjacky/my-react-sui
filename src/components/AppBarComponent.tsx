import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import WalletInfo from "./WalletInfo";
import HomeIcon from "@mui/icons-material/Home";
import WalletIcon from "@mui/icons-material/Wallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { MyProvider } from "../router/MyRouter";
import Typography from "@mui/material/Typography/Typography";
import Button from "@mui/material/Button/Button";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import LogoutIcon from "@mui/icons-material/Logout";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../services/firebase_service";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import LoginIcon from "@mui/icons-material/Login";
import { StaticNameProvider } from "../services/staticNameProvider";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ["Home", "Transcation", "Upload", "Image-List", "Auth"];

export default function AppBarComponent(props: Readonly<Props>) {
  const { window } = props;
  const { netType, setNetType } = React.useContext(MyProvider);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [authStatus, setAuthStatus] = React.useState(false);

  const navigate = useNavigate();

  const app = React.useMemo(() => initializeApp(firebaseConfig), []);
  const auth = React.useMemo(() => getAuth(app), [app]);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStatus(true);
      } else {
        setAuthStatus(false);
      }
    });
  }, [auth]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const toggleNetType = () => {
    if (netType === "devnet") {
      setNetType("mainnet");
    } else {
      setNetType("devnet");
    }
  };

  async function handleLogout()  {
    try {
      await signOut(auth);
      localStorage.removeItem(StaticNameProvider.userCredential());
      navigate("/auth");
    } catch (err) {
      throw Error(String(err));
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        SUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => navigate(`/${item.toLowerCase()}`)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box>
        {authStatus ? (
          <IconButton onClick={handleLogout}>
            <Tooltip title="Logout">
              <LogoutIcon sx={{color:"red"}}/>
            </Tooltip>
          </IconButton>
        ) : (
          <IconButton onClick={()=>navigate("/auth")}>
            <Tooltip title="Login">
              <LoginIcon sx={{color:"green"}}/>
            </Tooltip>
          </IconButton>
        )}
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ width: "200px", marginRight: "60px" }}>
            <Tooltip title="Current Net Type">
              <Typography>{netType.toLocaleUpperCase()}</Typography>
            </Tooltip>
          </Box>
          <Box sx={{ width: "360px" }}>
            <Tooltip title="Toggle Net Type">
              <Button onClick={toggleNetType}>Toggle Net</Button>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "60px",
              ml: "200px",
              justifyContent: "flex-end",
            }}
          >
            <Link to="/">
              <Tooltip title="Go To Index">
                <IconButton>
                  <HomeIcon sx={{ flexGrow: 1, color: "white" }} />
                </IconButton>
              </Tooltip>
            </Link>
            <Link to="/home">
              <Tooltip title="Go To Home">
                <IconButton>
                  <WalletIcon sx={{ flexGrow: 1, color: "white" }} />
                </IconButton>
              </Tooltip>
            </Link>
            <Link to="/transcation">
              <Tooltip title="Go To Transcation">
                <IconButton>
                  <CurrencyExchangeIcon sx={{ flexGrow: 1, color: "white" }} />
                </IconButton>
              </Tooltip>
            </Link>
          </Box>
          <WalletInfo />
          <Box sx={{ display: { xs: "none", sm: "none" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
