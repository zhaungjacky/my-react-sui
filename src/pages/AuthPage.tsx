import { useMemo, useState } from "react";
import { firebaseConfig } from "../services/firebase_service";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
} from "firebase/auth";
import Box from "@mui/material/Box/Box";
import Avatar from "@mui/material/Avatar/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { StaticNameProvider } from "../services/staticNameProvider";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const navigate = useNavigate();

  const auth = useMemo(() => getAuth(app), [app]);

  const [checked, setChecked] = useState<boolean>(()=>localStorage.getItem(StaticNameProvider.saveEmail())? JSON.parse(localStorage.getItem(StaticNameProvider.saveEmail())!):false);

  const [savedEmail, setSavedEmail] = useState(()=>localStorage.getItem(StaticNameProvider.userEmail())? JSON.parse(localStorage.getItem(StaticNameProvider.userEmail())!):null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (userCredential) {
          localStorage.setItem(
            StaticNameProvider.userCredential(),
            JSON.stringify(userCredential.user)
          );
          if(checked){
            localStorage.setItem(StaticNameProvider.userEmail(),JSON.stringify(email));
            setSavedEmail(email);
          }
          navigate("/upload");
        } else {
          console.log("Wrong credential");
        }
      } catch (err) {
        throw Error(String(err));
      }
    }
  };

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
 
    setChecked(val);
    localStorage.setItem(StaticNameProvider.saveEmail(),JSON.stringify(val))
  };
  return (
    <div>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            type="email"
            defaultValue={savedEmail}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
              {/* <Checkbox
      checked={checked}
      onChange={handleChecked}
      inputProps={{ 'aria-label': 'controlled' }}
    /> */}
          <FormControlLabel
            
            control={<Checkbox value="remember" color="primary" checked={checked}
              onChange={handleChecked}
              
              />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
