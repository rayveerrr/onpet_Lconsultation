import React, { useEffect, useState } from 'react'
import {Routes, Route} from "react-router-dom";
import { Link } from 'react-router-dom'

// component
import Header from '../../components/frontend/Header'
import Footer from '../../components/frontend/Footer';
import Sidebar from '../../components/frontend/Sidebar';

//styles
import '../../styles/myaccount.css'

// icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// image
import profile from '../../image/user.png'
import EditIcon from "@mui/icons-material/Edit";


//MUI
import { TextField, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Typography, Modal, Box, Button, IconButton } from '@mui/material';
import useAuthentication from '../../hooks/auth/authenticate-user';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { updateUserInfoService } from '../../data/firebase/services/user.service';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const editUserModal = {
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

const MyAccount = () => {

    useAuthentication('User')

    const [user, setUser] = useState([]);
    const [userTobeUpdate, setUserTobeUpdate] = useState(null);
    const [reveal, setHide] = useState(false);

    const usersCollectionRef = collection(db, "users")

    useEffect(() => {
        const fetch = async () => {
            const data = await getDocs(usersCollectionRef);
            setUser(data.docs.map((doc) => ({...doc.data(), id: doc.id })).filter(userInfo => (userInfo.Email === sessionStorage.getItem('email'))))
        }
        fetch();
    }, [])

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

    const txtFieldStyle = {
        marginBottom: '10px'
      };


    const changePassword = (currentPassword, newPassword) => {
        this.reauthenticate(currentPassword).then(() => {
          var user = auth().currentUser;
          user.updatePassword(newPassword).then(() => {
            console.log("Password updated!");
          }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
      }
    const changeEmail = (currentPassword, newEmail) => {
        this.reauthenticate(currentPassword).then(() => {
          var user = auth().currentUser;
          user.updateEmail(newEmail).then(() => {
            console.log("Email updated!");
          }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
      }
    

    return (
        <>
            <Header />
                {user.map((users) => {
                return (
                    <>
                        <div className="main-content-container">
                            <Sidebar />
                            <div className="myaccount-container">
                                <div className="accountdata-container">
                                    <Typography variant='h3' sx={{marginBottom: 2}}> <b>My Profile</b></Typography>
                                    <TextField 
                                        variant="outlined" 
                                        label='Name' 
                                        id="name" 
                                        value={users.Name}
                                        fullWidth
                                        sx={txtFieldStyle}  />
                                    <TextField 
                                        type='email'
                                        variant="outlined" 
                                        label='Email' 
                                        id="email" 
                                        value={users.Email}
                                        fullWidth
                                        sx={txtFieldStyle}  />
                                    <TextField 
                                        variant="outlined" 
                                        label='Phone number' 
                                        id="phoneNum" 
                                        value={users.PhoneNum}
                                        fullWidth
                                        sx={txtFieldStyle}  />
                                    <TextField 
                                        variant="outlined" 
                                        label='Address' 
                                        id="address" 
                                        value={users.Address}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        sx={txtFieldStyle}  />
                                    <FormControl fullWidth>
                                        <FormLabel id="gender" 
                                        >Gender</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="gender"
                                            name="gender"
                                            value={users.Gender}
                                            sx={txtFieldStyle}
                                        >
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                                        </RadioGroup>
                                    </FormControl>
                                    <div style={{ display: 'flex'}}>
                                        <TextField 
                                            type={reveal ? 'text' : 'password'}
                                            variant="outlined" 
                                            label='Password'
                                            placeholder="Password"
                                            id="password" 
                                            value={users.Password}
                                            fullWidth
                                            sx={txtFieldStyle}  />
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
                                        Edit my info
                                    </Button>
                                </div>
                                <div className="accountprofile-container">
                                    <div className="image-container">
                                        <img src={profile} alt="User profile" />
                                    </div>
                                </div>

                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="parent-modal-title"
                                    aria-describedby="parent-modal-description"
                                    >
                                    <Box sx={{ ...editUserModal, width: "60%" }}>
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
                                        disabled
                                        multiline
                                        rows={1}
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
                                        <div style={{display: 'flex'}}>
                                            <TextField
                                                type={reveal ? 'text' : 'password'}
                                                variant="outlined"
                                                label="Password"
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
                                        className="save-btn"
                                        sx={{ marginBottom: 2 }}
                                        onClick={() => {
                                            updateUserInfoService(userTobeUpdate.id, userTobeUpdate);
                                        }}
                                        >
                                        Save Changes
                                        </Button>
                                    </Box>
                                </Modal>
                            </div>
                        </div>
                    </>
                    )
                })}
            <Footer />
        </>
    )
}

export default MyAccount