import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";

// Tools
import {
  Avatar,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Checkbox,
  Button,
  Typography,
  Link,
  Alert,
  Modal,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

//Components
import LoginHeader from "../../components/frontend/LoginHeader";

//icons
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Footer from "../../components/frontend/Footer";
import { Box } from "@mui/system";

function SignUp() {

  const [checked, setChecked] = useState(true);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState(0);
  const [cpass, setCPass] = useState("");
  const [loading, setLoading] = useState(false);

  // Error
  const [checkedErr, setCheckedErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [phoneNumErr, setPhoneNumErr] = useState(false);
  const [addressErr, setAddressErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [cpassErr, setCPassErr] = useState(false);
  const [genderErr, setGenderErr] = useState(false);

  const userCollectionRef = collection(db, "users");


  const checkBox = (e) => {
    setChecked(e.target.checked);
  };
  
  const register = async (e) => {
    e.preventDefault();
    setNameErr(false);
    setPhoneNumErr(false);
    setCPassErr(false);
    setAddressErr(false);
    setGenderErr(false);
    setCheckedErr(false);

    if (name == "") {
      alert("Please enter your name.");
      return setNameErr(true);
    }
    if (registerEmail == "") {
      alert("Please enter your an email.");
      return setEmailErr(true);
    }
    if (address == "") {
      alert("Please enter your exact address.");
      return setAddressErr(true);
    }
    if (gender == "") {
      alert("Please select your gender.");
      return setGenderErr(true);
    }
    var pattern = new RegExp(/^(09|\+639)\d{9}$/);
    if (phoneNum == "") {

      return setPhoneNumErr(true);

    }else if(!pattern.test(phoneNum) || phoneNum.length != 11){
    
      alert("Please enter valid phone number.");
      return setPhoneNumErr(true);
  
    }
    if (registerPassword == "") {
      return setPasswordErr(true);
    }
    if (cpass == "" || cpass != registerPassword) {
      alert('Password do not much')
      return setCPassErr(true);
    }
    if(checked == false){
      alert('Please accept the terms and condition')
      return setCheckedErr(true)
    }
    if (
      name &&
      registerEmail &&
      gender &&
      phoneNum &&
      registerPassword &&
      cpass
    ){
      try {
        setLoading(true);
        const user = await createUserWithEmailAndPassword(
          auth,
          registerEmail,
          registerPassword
        );
        await addDoc(userCollectionRef, {
          Name: name,
          Email: registerEmail,
          Gender: gender,
          PhoneNum: phoneNum,
          Password: registerPassword,
          Address: address,
          UserType: "User",
        });
        window.location = "/login";
      } catch (e) {
        alert(e.message);
      }
      setLoading(false)
    }
  };

  const paperStyled = {
    padding: 20,
    width: "30%",
    margin: "100px auto",
    color: "black",
  };
  const btnStyle = {
    marginBottom: 10,
  };

  const h2Style = {
    margin: "10px 0 0 0",
  };

  const txtFieldStyle = {
    margin: "0 0 10px 0 ",
  };

  const tncModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <LoginHeader />
      <Grid>
        <Paper elevation={6} style={paperStyled}>
          <Grid align="center">
            <Avatar>
              <PersonAddAltIcon />
            </Avatar>
            <h2 style={h2Style}>Sign Up</h2>
            <Typography variant="caption">
              Please fill up this form to sign up.
            </Typography>
          </Grid>
          <Grid>
            <form>
              <TextField
                variant="outlined"
                label="Full name"
                id="name"
                fullWidth
                onChange={(e) => setName(e.target.value)}
                error={nameErr}
                required
                style={txtFieldStyle}
              />
              <TextField
                variant="outlined"
                type="email"
                label="Email"
                id="email"
                fullWidth
                onChange={(e) => setRegisterEmail(e.target.value)}
                error={emailErr}
                required
                style={txtFieldStyle}
              />
              <FormControl>
                <FormLabel id="gender">Gender</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="gender"
                  name="gender"
                  error={genderErr}
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                  {/* palatandaan kung pano mag disable ng radiobutton */}
                  {/* <FormControlLabel
                            value="disabled"
                            disabled
                            control={<Radio />}
                            label="other"
                            /> */}
                </RadioGroup>
              </FormControl>
              <TextField
                type="number"
                variant="outlined"
                label="Phone number"
                placeholder='09123456789'
                id="phoneNum"
                fullWidth
                onChange={(e) => setPhoneNum(e.target.value)}
                error={phoneNumErr}
                required
                style={txtFieldStyle}
              />
              <TextField
                variant="outlined"
                label="Address"
                id="address"
                fullWidth
                onChange={(e) => setAddress(e.target.value)}
                error={addressErr}
                required
                style={txtFieldStyle}
              />
              <TextField
                type="password"
                variant="outlined"
                label="Password"
                id="password"
                fullWidth
                onChange={(e) => setRegisterPassword(e.target.value)}
                error={passwordErr}
                required
                style={txtFieldStyle}
              />
              <TextField
                type="password"
                variant="outlined"
                label="Confirm Password"
                id="confirmPassword"
                fullWidth
                onChange={(e) => setCPass(e.target.value)}
                error={cpassErr}
                required
                style={txtFieldStyle}
              />
              <Link onClick={handleOpen} >
              <FormControlLabel
                control={<Checkbox checked={checked} onChange={checkBox} error={checkedErr} required />}
                label="I accept the terms and conditions"
                
              />
              </Link>
              
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
              >
                <Box sx={{ ...tncModal, width: '80%' }}>
                  <Paper sx={{marginTop: 3, width: '100%', padding: 4}}>
                    <Typography variant="h4">
                    <b>Terms and Conditions:</b>
                    </Typography>

                      <Typography margin={'5px 20px'}>1.	The logo and brand name are Paws and Claws intellectual property. Using the logo or the name of the brand illegally can face consequences with accordance to RA 8293 (The Intellectual Property Code of the Philippines).</Typography>
                      <Typography margin={'5px 20px'}>2.	Users should provide the information that is needed for completing the ordering of the products. Using wrong information or other users personal information with no permission, the account that is being question would be put on investigation that can lead to termination of the account.</Typography>
                      <Typography margin={'5px 20px'}>3.	There are maximum order per item to allow other users to try the products that are available.</Typography>
                      <Typography margin={'5px 20px'}>4.	If proven that one user has multiple accounts. All the accounts in question would be terminated.</Typography>
                      <Typography margin={'5px 20px'}>5.	There are no warranty on the item that was sold due to the damage might occur during transit or shipping.</Typography>
                      <Typography margin={'5px 20px'}>6.	Shipping fee is not included on the total price that is being displayed.</Typography>
                      <Typography margin={'5px 20px'}>7.	The feedback would be deleted if the content is abusive, offensive, profane or infringes copyright or right of any person.</Typography>
                      <Typography margin={'5px 20px'}>8.	All products can be viewed but a personal account with complete information is needed to access all the services this website provide.</Typography>
                      <Typography margin={'5px 20px'}>9.	The website is a direct seller any middleman that is using the name of the brand is not in any way part of Paws and Claws. If there some case, please report them to us.</Typography>
                      <Typography margin={'5px 20px'}>10.	There are no fixed shipping fee because the shipping may vary to the time and location of the user.</Typography>
                      <Typography margin={'5px 20px'}>11.	The coverage area that Paws and Claws cover is limited around Metro Manila area. Any orders outside Metro Manila will be processed only if the user agree on the conditions: 1. The estimated delivery is 4-7 days due to the processing of the courier. 2. The delivery fee would still vary on the location of the user but it would be more expensive than the delivery around Metro Manila. 3. The user should pay first before the orders is sent to the sorting hub of the courier of choice.</Typography>
                      <Typography margin={'5px 20px'}>12.	Before the processing of the order the staff of Paws and Claws will call the user to confirm the order to pinpoint the exact location or the landmark which is close to exact location of the user for the booking of the courier of their choice.  </Typography>
                      <Typography margin={'5px 20px'}>13. The option for using G cash, the user needs to pay 50% of the total amount ordered to process the user's order. The other 50% would be settled when the user pick up the product or the courier is picking up the order.  </Typography>
                      <Button onClick={handleClose}>Close</Button>
                  </Paper>
                </Box>
              </Modal>

              <Button
                variant="contained"
                fullWidth
                style={btnStyle}
                onClick={register}
                disabled={loading}
              >
                Register
              </Button>
              <hr></hr>
              <Typography align="center">
                Already have an account? <Link href="/login"> Sign in</Link>
              </Typography>
            </form>
          </Grid>
        </Paper>
      </Grid>
      <Footer />
    </>
  );
}

export default SignUp;
