import React, { useEffect, useState } from 'react';
import {
	FaAngleRight,
	FaAngleLeft, 
	FaChartBar, 
	FaThLarge, 
	FaShoppingCart, 
	FaCog,
	FaSignOutAlt,
	FaBars,
	FaBoxes,
	FaReceipt, 
	FaRegClipboard,
	FaRegUserCircle
} from 'react-icons/fa';
import { NavLink, Outlet, useParams } from "react-router-dom";
import "../styles/navbar.css";
import pac from '../image/pawsandclaws.jpg'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { updateUserInfoService } from '../data/firebase/services/user.service';

const ICON_SIZE = 20;

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

function Navbar({visible, show}) {

	const [user, setUser] = useState([]);
	const [userTobeUpdate, setUserTobeUpdate] = useState(null);

  	const usersCollectionRef = collection(db, "users");

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
		<>
			<div className="mobile-nav">
				<button
					className="mobile-nav-btn"
					onClick={() => show(!visible)}
				>
					<FaBars size={24}  />
				</button>
			</div>
			<nav className={!visible ? 'navbar' : ''}>
				<button
					type="button"
					className="nav-btn"
					onClick={() => show(!visible)}
				>
					{ !visible
						? <FaAngleRight size={30} /> : <FaAngleLeft size={30} />}
				</button>
				<div>
					<NavLink
						className="logo"
						to="/dashboard"
					>
							<img
								src={pac}
								alt="logo"
							/>
					</NavLink>
					<div className="links nav-top">
						<NavLink to="/dashboard" className="nav-link">
							<FaThLarge size={ICON_SIZE} />
							<span>Dashboard</span>
						</NavLink>
						<NavLink to="/orders" className="nav-link">
							<FaShoppingCart size={ICON_SIZE} />
							<span>Purchased History</span> 
						</NavLink>
                        <NavLink to="/supplies" className="nav-link">
						<FaBoxes size={ICON_SIZE} />
							<span>Supplies</span>
						</NavLink>
                        <NavLink to="/transactions" className="nav-link">
							<FaReceipt size={ICON_SIZE} />
							<span>Transactions</span>
						</NavLink>
                        <NavLink to="/pethistory" className="nav-link">
							<FaRegClipboard size={ICON_SIZE} />
							<span>Pet history</span>
						</NavLink>
                        <NavLink to="/addnewemployee" className="nav-link">
							<FaRegUserCircle size={ICON_SIZE} />
							<span>Employee</span>
						</NavLink>
						<NavLink to="/fbcomment" className="nav-link">
							<FaChartBar size={ICON_SIZE} />
							<span>Feedback </span>
						</NavLink>
						
					</div>
				</div>

				<div className="links">
				{user.map((users) => {
              		return (
					<NavLink className="nav-link"
					onClick={() => {
						handleOpen(users);
					  }}>
						<span>Profile</span>
					</NavLink>
					);
            	})}
					<NavLink to="/login" className="nav-link">
						<FaSignOutAlt size={ICON_SIZE} />
						<span>Logout</span> 
					</NavLink>
				</div>
			</nav>
			<Outlet />
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<Box sx={{ ...editAdminModal, width: "60%" }}>
					<Typography variant='h3' sx={{marginBottom: '20px'}}>
						<b>My Profile</b>
					</Typography>
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
					onClick={(e) => {updateUserInfoService(userTobeUpdate.id, userTobeUpdate); getUsers();}}
					>
					Save Changes
					</Button>
				</Box>
			</Modal>
		</>
  );
}

export default Navbar;