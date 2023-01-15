import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, ver } from "firebase/auth";
import { auth } from "../../firebase-config";

//Components
import LoginHeader from "../../components/frontend/LoginHeader";

//Tools
import { CheckBox, Label } from "@mui/icons-material";
import {
  Avatar,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputBase,
} from "@mui/material";

//icons
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Footer from "../../components/frontend/Footer";
import { getUserByIdService } from "../../data/firebase/services/user.service";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [reveal, setHide] = useState(false);

  const login = async () => {
    try {
      // kapag ang usertype ay user, sa user side lang diretso sa homepage. kapag admin naman ang usertype, diretso sa admin side.
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      const userRecord = await getUserByIdService(loginEmail);
      if (user && userRecord) {
        sessionStorage.setItem("email", loginEmail);
        return (window.location.href =
          userRecord.UserType === "User" ? "/homepage" : "/dashboard");
      }
    } catch (e) {
      alert("Invalid Credential");
      console.log(e.message);
    }
  };

  useEffect(() => {
    sessionStorage.clear();
    auth
      .signOut()
      .then(() => null)
      .catch((error) => alert(error));
    console.log(auth.currentUser);
  }, []);

  const paperStyled = {
    padding: 20,
    width: 500,
    margin: "150px auto",
  };
  const btnStyle = {
    margin: "10px 0",
  };
  return (
    <Grid>
      <LoginHeader />
      <Paper elevation={6} style={paperStyled}>
        <Grid align="center">
          <Avatar>
            <PersonOutlineOutlinedIcon />
          </Avatar>
          <h2>Sign in</h2>
        </Grid>
        <Grid>
          <form noValidate autoComplete="off">
            <TextField
              id="emailnumber"
              variant="outlined"
              label='Email'
              placeholder="Email"
              onChange={(e) => setLoginEmail(e.target.value)}
              fullWidth
              required
              sx={{marginBottom: '10px'}}
            />

            <div style={{ display: 'flex'}}>
            <TextField
              id="password"
              type={reveal ? 'text' : 'password'}
              variant="outlined"
              label='Password'
              placeholder="Password"
              onChange={(e) => setLoginPassword(e.target.value)}
              fullWidth
              required
            />
            <IconButton
              onClick={() => setHide(prevState => !prevState)}
            >
              {reveal ? <VisibilityIcon/> : <VisibilityOffIcon />}
            </IconButton>
            </div>
            <Button
              variant="contained"
              fullWidth
              style={btnStyle}
              onClick={login}
            >
              Sign in
            </Button>
            <hr></hr>
            <Typography align="center">
              Don't have an account? <Link href="/signup"> Sign up here. </Link>
            </Typography>
          </form>
        </Grid>
      </Paper>
      <Footer />
    </Grid>
  );
}

export default Login;
