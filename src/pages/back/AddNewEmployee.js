import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";

import Navbar from "../../components/Navbar";

import {
  Avatar,
  Button,
  Grid,
  TextField,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { Container } from "@mui/system";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import useAuthentication from "../../hooks/auth/authenticate-user";

// edit admin
const containerStyle = {
  height: "70vh",
  margin: "100px auto 0 auto",
};

function AddNewEmployee() {
  useAuthentication("Admin");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState(0);
  const [cpass, setCPass] = useState("");
  const [loading, setLoading] = useState(false);

  // Error
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [phoneNumErr, setPhoneNumErr] = useState(false);
  const [addressErr, setAddressErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [cpassErr, setCPassErr] = useState(false);
  const [genderErr, setGenderErr] = useState(false);

  const userCollectionRef = collection(db, "users");

  const addNewEmployee = async (e) => {
    e.preventDefault();
    setName(false);
    setPhoneNum(false);
    setCPass(false);
    setAddress(false);

    if (name == "") {
      return setNameErr(true);
    }
    if (registerEmail == "") {
      return setEmailErr(true);
    }
    if (address == "") {
      return setAddressErr(true);
    }
    if (gender == "") {
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
    if (
      name &&
      registerEmail &&
      gender &&
      phoneNum &&
      registerPassword &&
      cpass
    ){
      try {
        setLoading(true)
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
          UserType: "Admin",
        });
        window.location.href = '/addnewemployee'
      } catch (e) {
        console.log(e.message);
      }
      setLoading(false);
    }
  };

  const [navVisible, showNavbar] = useState("false");

  return (
    <div>
      <Navbar visible={navVisible} show={showNavbar} />
      <div className={!navVisible ? "page" : "page page-with-navbar"}>
        <Container sx={containerStyle} elevation={1}>
          <Grid align="center">
            <Avatar>
              <PersonAddAltIcon />
            </Avatar>
            <h2 style={{ textAlign: "center" }}>Add new employee</h2>
            <Typography variant="caption">
              Please fill up this form to add new employee.
            </Typography>
          </Grid>
          <form style={{ width: "80%", margin: "75px auto" }}>
            <TextField
              m={{ width: "100%" }}
              variant="outlined"
              label="Full name"
              id="fullname"
              onChange={(e) => {
                setName(e.target.value);
              }}
              error={nameErr}
              sx={{ width: "48%", marginBottom: "10px", marginRight: "4%" }}
              required
            />
            <TextField
              type="number"
              variant="outlined"
              label="Phone Number"
              id="phoneNumber"
              onChange={(e) => {
                setPhoneNum(e.target.value);
              }}
              error={phoneNumErr}
              sx={{ width: "48%", marginBottom: "10px" }}
              required
            />
            <TextField
              variant="outlined"
              label="Email Address"
              id="email"
              onChange={(e) => {
                setRegisterEmail(e.target.value);
              }}
              error={emailErr}
              sx={{ width: "100%", marginBottom: "10px" }}
              required
            />

            <FormControl>
              <FormLabel id="gender">Gender</FormLabel>
              <RadioGroup
                row
                aria-labelledby="gender"
                name="gender"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                error={genderErr}
                required
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
              variant="outlined"
              label="Address"
              id="address"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              error={addressErr}
              multiline
              rows={3}
              sx={{ width: "100%", marginBottom: "10px" }}
              required
            />

            <TextField
              type="password"
              variant="outlined"
              label="Password"
              id="password"
              onChange={(e) => {
                setRegisterPassword(e.target.value);
              }}
              error={passwordErr}
              sx={{ width: "48%", marginBottom: "10px", marginRight: "4%" }}
              required
            />
            <TextField
              type="password"
              variant="outlined"
              label="Confirm password"
              id="confirmPassword"
              onChange={(e) => {
                setCPass(e.target.value);
              }}
              error={cpassErr}
              sx={{ width: "48%", marginBottom: "10px" }}
              required
            />
            <Button
              variant="contained"
              className="save-btn"
              onClick={addNewEmployee}
              disabled={loading}
            >
              Add new employee
            </Button>
            <Button variant="contained" type="reset" sx={{ marginLeft: "2%" }}>
              Clear
            </Button>
          </form>
        </Container>
      </div>
    </div>
  );
}

export default AddNewEmployee;
