import { Icon, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';

import "../../styles/footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="footer-section">
          <div>
            <h4>Popular Item</h4>
            <Typography>Dog Food</Typography>
            <Typography>Collar</Typography>
            <Typography>Cage</Typography>
          </div>
          <div>
            <h4>Paws and Claws Grooming Services</h4>
            <a href="https://www.facebook.com/pawsandclaws081520/" target="_blank" style={{color: 'white'}}><Typography>Facebook</Typography></a>
          </div>
          <div>
            <h4>Contact us on:</h4>
            <Typography sx={{display: 'flex', alignItems: 'center',}}> <EmailIcon/> paws.and.claws8152020@gmail.com </Typography>
            <Typography sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <CallIcon/> 09959744466 </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
