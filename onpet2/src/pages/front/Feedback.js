import { Button, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../../firebase-config'
import Footer from '../../components/frontend/Footer'
import Header from '../../components/frontend/Header'
import useAuthentication from '../../hooks/auth/authenticate-user'

function Feedback() {

  useAuthentication('User')

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);

  const feedbackCollectionRef = collection(db, "Feedback");

  useEffect(() => {
    const getUser = async () => {
      const userCollectionRef = collection(db, "users");
      const dataUsers = await getDocs(userCollectionRef);
      const validUser = dataUsers.docs
        ?.map((doc) => ({ ...doc.data(), id: doc.id }))
        .find((user) => user.Email === sessionStorage.getItem("email"));
      setUser(validUser);
    };
    getUser();
  }, []);

  const feedback = async () => {
      try {
          setLoading(true);
          await addDoc(feedbackCollectionRef, {Name: user.Name, Date: new Date().toLocaleDateString(), Comment: comment })
          alert('Feedback posted')
          window.location = '/'
      } catch (e) {
          console.log(e.message);
      }
      setLoading(false);
  }

  return (
    
    <div>
        <Header/>
            <Paper sx={{width: '50%', margin: '16vh auto', padding: 10}}>
              <Typography variant='h2' sx={{color: 'black', fontWeight: 'Bold'}}>Feedback</Typography>
              <TextField 
                variant="outlined" 
                id="fullname" 
                fullWidth
                multiline 
                rows={1}
                value={user.Name}
                disabled
                sx={{marginBottom: 2}}  />
              <TextField 
                variant="outlined" 
                label='Feedback here..' 
                id="feedback" 
                fullWidth
                onChange={(e) => setComment(e.target.value)}
                multiline rows={5}
                required
                sx={{marginBottom: 2}}  />
              <Button onClick={feedback} variant='contained' disabled={loading}>Post Feedback</Button>
            </Paper>
        <Footer/>
    </div>
  )
}

export default Feedback