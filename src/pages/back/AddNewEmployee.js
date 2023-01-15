import React, { useState, useEffect } from "react";
import { IconButton, InputBase, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from '@mui/icons-material/Search';

// edit admin
const containerStyle = {
  height: "70vh",
  margin: "100px auto 0 auto",
  backgroundColor: 'white'
};

function AddNewEmployee() {
  useAuthentication("Admin");

  const [reveal, setHide] = useState(false);
  const [creveal, setCHide] = useState(false);
  const [search, setSearch] = useState('');

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
  const [user, setUser] = useState([]);
  
  const getUsers = async () => {
    const data = await getDocs(userCollectionRef);
    setUser(
      data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((userType) => userType.UserType === 'Admin')
    );
  };
  useEffect(() => {
    
    getUsers();
  }, []);

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - userCollectionRef.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [navVisible, showNavbar] = useState("false");

  return (
    <div>
      <Navbar visible={navVisible} show={showNavbar} />
      <div className={!navVisible ? "page" : "page page-with-navbar"}>
        <Paper sx={{ textAlign: "center", margin: "0 auto 0 auto" }}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            <b>Employees List</b>
          </Typography>
          <div
            component="form"
            style={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '70%', backgroundColor: 'whitesmoke', border: '1px #404040 solid' , borderRadius: '5px', margin: '10px auto' }}
            >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={(e) => {setSearch(e.target.value)}}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" >
                <SearchIcon />
            </IconButton>
          </div>
          <TableContainer sx={{ display: "flex", justifyContent: "center"}}>
            <Table
              sx={{ minWidth: 700, width: "90%"}}
              aria-label="customized table"
            >
              <TableHead sx={{ bgcolor: "black" }}>
                <TableRow>
                  <TableCell align="right" sx={{ color: "white" }}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Address
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Number
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Email
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Password
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    User Type
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? user.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : user
                ).filter((users) => {
                  if(search == ''){
                    return users;
                  }else if (users.Name.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                    return users;
                  }
                }).map((users) => (
                  <TableRow key={users.id}>
                    <TableCell align="right">{users.Name}</TableCell>
                    <TableCell align="center">{users.Address}</TableCell>
                    <TableCell align="center">{users.PhoneNum}</TableCell>
                    <TableCell align="center">{users.Email}</TableCell>
                    <TableCell align="center">{users.Password}</TableCell>
                    <TableCell align="center">{users.UserType}</TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={7}
                    count={user.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="success"
            onClick={handleOpen}
            startIcon={<AddBoxIcon />}
            sx={{ float: "right", margin: 3 }}
          >
            Add new employee
          </Button>
        </Paper>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
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

            <div style={{ display: 'flex', width: '100%'}}>
            <div style={{ display: 'flex', width: '100%'}}>
              <TextField
                type={reveal ? 'text' : 'password'}
                variant="outlined"
                label="Password"
                id="password"
                onChange={(e) => {
                  setRegisterPassword(e.target.value);
                }}
                error={passwordErr}
                fullWidth
                sx={{ marginBottom: "10px" }}
                required
              />
              <IconButton
              onClick={() => setHide(prevState => !prevState)}
              >
                {reveal ? <VisibilityIcon/> : <VisibilityOffIcon />}
              </IconButton>
            </div>
            <div style={{ display: 'flex', width: '100%'}}>
            <TextField
              type={creveal ? 'text' : 'password'}
              variant="outlined"
              label="Confirm password"
              id="confirmPassword"
              onChange={(e) => {
                setCPass(e.target.value);
              }}
              error={cpassErr}
              fullWidth
              sx={{ marginBottom: "10px" }}
              required
            />
            <IconButton
              onClick={() => setCHide(prevState => !prevState)}
              >
                {creveal ? <VisibilityIcon/> : <VisibilityOffIcon />}
              </IconButton>
            </div>
            </div>
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
        </Modal>
      </div>
    </div>
  );
}

export default AddNewEmployee;
