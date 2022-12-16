import React, { useState, useEffect} from 'react'
import Navbar from "../../components/Navbar";
import { TextField, Paper, Typography, Button, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Modal, Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';

import '../../index.css'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import useAuthentication from '../../hooks/auth/authenticate-user';

function FBComment() {

    useAuthentication('Admin')
    const [navVisible, showNavbar] = useState("false");

    const [ Name, setName] = useState('');
    const [ Date, setDate] = useState('');
    const [ comment, setComment] = useState('');
    const [ feedback, setFeedback] = useState([]);

    const feedbackCollectionRef = collection(db, "Feedback");

    // Read all the product
    useEffect(() => {
        const getFeedback = async () => {
          const data = await getDocs(feedbackCollectionRef);
          setFeedback(data.docs.map((doc) => ({...doc.data(), id: doc.id })))
        }
        getFeedback();
      }, []);
  return (
    <div>
        <Navbar visible={ navVisible } show={ showNavbar } />
        <div className={!navVisible ? "page" : "page page-with-navbar"}>
            <div style={{display: 'flex', flexDirection: 'column', width: '90%', margin: 'auto'}}>
                <Typography variant='h3' textAlign={'center'}>
                    <b>Feedback</b>
                </Typography>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 25%)', gridAutoRows: '340px'}}>
                {feedback.map((feeds) => {
                    return ( 
                        <Paper sx={{textAlign: 'center', width: '90%', height: '95%', margin: 'auto', padding: 2, border: '1px solid black'}}>
                            <TextField 
                                variant="outlined" 
                                label='Alias or name' 
                                id="fullname"
                                value={feeds.Name} 
                                fullWidth
                                onChange={(e) => setName(e.target.value)}
                                disabled
                                sx={{marginBottom: 2}}  />
                            <TextField 
                                variant="outlined" 
                                label='Date and Time Posted' 
                                id="Date"
                                value={feeds.Date} 
                                fullWidth
                                onChange={(e) => setDate(e.target.value)}
                                disabled
                                sx={{marginBottom: 2}}  />
                            <TextField 
                                variant="outlined" 
                                label='Feedback' 
                                id="feedback" 
                                value={feeds.Comment}
                                fullWidth
                                onChange={(e) => setComment(e.target.value)}
                                multiline rows={5}
                                disabled
                                sx={{marginBottom: 2}}  />
                        </Paper>
                    );
                })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default FBComment