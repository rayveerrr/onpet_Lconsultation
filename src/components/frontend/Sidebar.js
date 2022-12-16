import React, { useEffect, useState } from 'react'
import {Routes, Route} from "react-router-dom";
import { Link } from 'react-router-dom'

import '../../styles/sidebar.css'

// component

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// image
import profile from '../../image/user.png'


//MUI
import { Divider, Paper } from '@mui/material'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

function Layout() {

    const style = {
        width: '100%',
        maxWidth: 360,
      };

      const [user, setUser] = useState([]);

      const usersCollectionRef = collection(db, "users")
  
      useEffect(() => {
          const fetch = async () => {
              const data = await getDocs(usersCollectionRef);
              setUser(data.docs.map((doc) => ({...doc.data(), id: doc.id })).filter(userInfo => (userInfo.Email === sessionStorage.getItem('email'))))
          }
          fetch();
      }, [])

  return (
    <>
        {user.map((users) => {
            return (
                <Paper elevation={0} className="side" >
                    <div className="profile-container">
                        <div className="user-icon-container">
                            <img src={profile} alt="profile" />
                        </div>
                        <div className="username-container">
                            <p>{users.Name}</p>
                            <p><Link to="/myaccount">Edit profile</Link></p>
                        </div>
                    </div>
                    <Paper className="menu-container" sx={{borderRadius: '0'}}>
                        <List sx={style} aria-label="mailbox folders">
                            <div className="dropdown">
                                <Link to="/myaccount">My Account 
                                    {/* <div className="dropdown-logo-container"> 
                                        <ArrowDropDownIcon />
                                    </div> */}
                                </Link>
                                {/* <div className="dropdown-content">
                                    <Link to="/myaccount">My Profile</Link>
                                    <Link href="#">My Pet</Link>
                                </div> */}
                            </div>
                            <Link to="/mypurchase">
                                <ListItemText primary="My Purchase" />
                            </Link>
                            <Link to="/feedback">
                                <ListItemText primary="Feedback" />
                            </Link>  
                        </List>
                    </Paper>
            </Paper>
            )
        })}
    </>
  )
}

export default Layout