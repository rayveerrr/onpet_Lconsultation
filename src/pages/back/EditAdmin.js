import React, { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";
import {
  TextField,
  Paper,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useParams } from "react-router-dom";

import "../../index.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import useAuthentication from "../../hooks/auth/authenticate-user";
import { updateUserInfoService } from "../../data/firebase/services/user.service";

const editAdminModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const EditAdmin = () => {
  useAuthentication("Admin");

  const [userTobeUpdate, setUserTobeUpdate] = useState(null);

  const [reveal, setHide] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState(0);
  const [cpass, setCPass] = useState("");

  const [user, setUser] = useState([]);

  const usersCollectionRef = collection(db, "users");


  // read data
  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setUser(
      data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter(
          (adminInfo) => adminInfo.Email === sessionStorage.getItem("email")
        )
    );
  };
  useEffect(() => {
    
    getUsers();
  }, []);

  const [navVisible, showNavbar] = useState("false");

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = (users) => {
    setUserTobeUpdate(users);
    setOpen(true);
  };
  const handleClose = () => {
    setUserTobeUpdate(null);
    setOpen(false);
  };

  return (
    <div>
      <Navbar visible={navVisible} show={showNavbar} />
      <div className={!navVisible ? "page" : "page page-with-navbar"}>
        <Paper elevation={3} sx={{ width: "80%", margin: "5% auto" }}>
          <Typography variant="h4" sx={{ textAlign: "center", margin: 2 }}>
            My account
          </Typography>
          <form style={{ width: "80%", margin: "auto" }}>
            {user.map((users) => {
              return (
                <div>
                  <TextField
                    m={{ width: "100%" }}
                    variant="outlined"
                    label="Full Name"
                    id="fullname"
                    sx={{
                      width: "48%",
                      marginBottom: "10px",
                      marginRight: "4%",
                    }}
                    value={users.Name}
                    multiline
                    rows={1}
                    disabled
                  />
                  <TextField
                    variant="outlined"
                    label="Email Address"
                    id="email"
                    sx={{ width: "48%", marginBottom: "10px" }}
                    value={users.Email}
                    multiline
                    rows={1}
                    disabled
                  />
                  <TextField
                    variant="outlined"
                    label="Phone Number"
                    id="phoneNum"
                    sx={{ width: "48%", marginBottom: "10px" }}
                    value={users.PhoneNum}
                    multiline
                    rows={1}
                    disabled
                  />
                  <FormControl sx={{ width: "60%", marginBottom: "10px" }}>
                    <FormLabel id="gender">Gender</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="gender"
                      name="gender"
                      value={users.Gender}
                      disabled
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
                    </RadioGroup>
                  </FormControl>
                  <TextField
                    variant="outlined"
                    label="Address"
                    id="address"
                    multiline
                    rows={3}
                    sx={{ width: "100%", marginBottom: "10px" }}
                    value={users.Address}
                    disabled
                  />
                  <div style={{ display: 'flex'}}>
                    <TextField
                      type={reveal ? 'text' : 'password'}
                      variant="outlined"
                      id="currentPassword"
                      sx={{ width: "48%", marginBottom: "10px", display: "flex" }}
                      value={users.Password}
                      disabled
                    />
                    <IconButton
                      onClick={() => setHide(prevState => !prevState)}
                    >
                      {reveal ? <VisibilityIcon/> : <VisibilityOffIcon />}
                    </IconButton>
                  </div>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleOpen(users);
                    }}
                    startIcon={<EditIcon />}
                    sx={{ margin: "20px 0" }}
                  >
                    Edit admin info
                  </Button>
                </div>
              );
            })}
          </form>
        </Paper>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...editAdminModal, width: "60%" }}>
            <TextField
              m={{ width: "100%" }}
              variant="outlined"
              label="Full Name"
              id="fullname"
              sx={{ width: "48%", marginBottom: "10px", marginRight: "4%" }}
              value={userTobeUpdate?.Name}
              onChange={(e) =>
                setUserTobeUpdate({ ...userTobeUpdate, Name: e.target.value })
              }
              multiline
              rows={1}
            />
            <TextField
              variant="outlined"
              label="Email Address"
              id="email"
              sx={{ width: "48%", marginBottom: "10px" }}
              value={userTobeUpdate?.Email}
              onChange={(e) =>
                setUserTobeUpdate({ ...userTobeUpdate, Email: e.target.value })
              }
              multiline
              rows={1}
              disabled
            />
            <TextField
              variant="outlined"
              label="Phone Number"
              id="phoneNum"
              sx={{ width: "48%", marginBottom: "10px" }}
              value={userTobeUpdate?.PhoneNum}
              onChange={(e) =>
                setUserTobeUpdate({
                  ...userTobeUpdate,
                  PhoneNum: e.target.value,
                })
              }
              multiline
              rows={1}
            />
            <FormControl sx={{ width: "60%", marginBottom: "10px" }}>
              <FormLabel id="gender">Gender</FormLabel>
              <RadioGroup
                row
                aria-labelledby="gender"
                name="gender"
                value={userTobeUpdate?.Gender}
                onChange={(e) =>
                  setUserTobeUpdate({
                    ...userTobeUpdate,
                    Gender: e.target.value,
                  })
                }
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
              multiline
              rows={3}
              sx={{ width: "100%", marginBottom: "10px" }}
              value={userTobeUpdate?.Address}
              onChange={(e) =>
                setUserTobeUpdate({
                  ...userTobeUpdate,
                  Address: e.target.value,
                })
              }
            />
            <TextField
              type="password"
              variant="outlined"
              label="Password"
              id="currentPassword"
              sx={{ width: "48%", marginBottom: "10px", display: "flex" }}
              value={userTobeUpdate?.Password}
              disabled
            />
            <Button
              variant="contained"
              className="save-btn"
              sx={{ marginBottom: 2 }}
              onClick={() => {
                updateUserInfoService(userTobeUpdate.id, userTobeUpdate);
                getUsers();
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default EditAdmin;
