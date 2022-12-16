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
                    <ul className="follow">
                        <li>Follow us on:</li>
                        <li><a href="https://www.facebook.com/pawsandclaws081520/" target="_blank">
                                <IconButton aria-label="facebook" sx={{margin: 0, padding: 0}}>
                                    <FacebookIcon fontSize='medium' style={iconsStyle} />
                                </IconButton>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
    )
}

export default LoginHeader