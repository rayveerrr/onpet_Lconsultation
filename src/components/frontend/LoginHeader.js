import React from 'react';

// Styles
import '../../styles/loginheader.css'


// image
import fb from '../../image/facebook.png'
import ig from '../../image/instagram.png'
import pac from '../../image/pawsandclaws.jpg'
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';


const LoginHeader = () => {
    const iconsStyle ={
        color: 'white',
    }

    return(
            <div className="header-section">
                <div className="header-main">
                    <div className="logo">
                        <Link to='/'><img src={pac} alt="pawsandclaws logo"></img></Link>
                    </div>
                </div>
            </div>
    )
}

export default LoginHeader