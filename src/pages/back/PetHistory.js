import React, { useState, useEffect } from 'react'
import { Paper, Typography } from "@mui/material";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore'
  import {auth, db} from '../../firebase-config'

import Navbar from "../../components/Navbar";

import { Button, IconButton, TableFooter, TextField} from '@mui/material';
import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import TablePagination from '@mui/material/TablePagination';
  import Box from '@mui/material/Box';
  import Radio from '@mui/material/Radio';
  import RadioGroup from '@mui/material/RadioGroup';
  import FormControlLabel from '@mui/material/FormControlLabel';
  import FormControl from '@mui/material/FormControl';
  import FormLabel from '@mui/material/FormLabel';
  import AddBoxIcon from '@mui/icons-material/AddBox';
  import Modal from '@mui/material/Modal';
import useAuthentication from '../../hooks/auth/authenticate-user';
import { updatePetHistoryService } from '../../data/firebase/services/petHistory.service';
import { Sort } from '@mui/icons-material';

  const editStyle = {
    bgcolor: 'green',
    color: 'white',
    fontSize: 16,
    borderRadius: 8,
    marginRight: 1,
    '&:hover': {
      bgcolor: 'white',
      color: 'green',
    }
  }
  const hideStyle = {
    bgcolor: 'gray',
    color: 'white',
    fontSize: 16,
    borderRadius: 8,
    '&:hover': {
      bgcolor: 'white',
      color: 'gray',
    }
  }
  const deleteStyle = {
    bgcolor: 'red',
    color: 'white',
    fontSize: 16,
    borderRadius: 8,
    '&:hover': {
      bgcolor: 'white',
      color: 'red',
    }
    
  }

  const data = [
    { id: 1, itemName: 'name', description: 'Ongoing', price: 'Ongoing', quantity: 'Ongoing', image: 'image'},
    { id: 2, itemName: 'Ongoing', description: 'Ongoing', price: 'Ongoing', quantity: 'Ongoing', image: 'image'},
    { id: 3, itemName: 'Ongoing', description: 'Ongoing', price: 'Ongoing', quantity: 'Ongoing', image: 'Ongoing'},
    { id: 4, itemName: 'Ongoing', description: 'Ongoing', price: 'Ongoing', quantity: 'Ongoing', image: 'Ongoing'},
    { id: 5, itemName: 'Ongoing', description: 'Ongoing', price: 'Ongoing', quantity: 'Ongoing', image: 'Ongoing'},
    { id: 6, itemName: 'Ongoing', description: 'Ongoing', price: 'Ongoing', quantity: 'Ongoing', image: 'Ongoing'},
    { id: 7 , itemName: 'Ongoing', description: 'Ongoing', price: 'Ongoing', quantity: 'Ongoing', image: 'Ongoing'},
  ]


// Pet history Modal

const phModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const PetHistory = () => {

    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [petName, setPetName] = useState('');
    const [remarks, setRemarks] = useState('');
    const [species, setSpecies] = useState('');
    const [healthHistory, setHealthHistory] = useState('');
    const [loading, setLoading] = useState(false);
  
    const [ageErr, setAgeErr] = useState(false);
    const [breedErr, setBreedErr] = useState(false);
    const [dateErr, setDateErr] = useState(false);
    const [genderErr, setGenderErr] = useState(false);
    const [ownerNameErr, setOwnerNameErr] = useState(false);
    const [petNameErr, setPetNameErr] = useState(false);
    const [remarksErr, setRemarksErr] = useState(false);
    const [speciesErr, setSpeciesErr] = useState(false);
    const [healthHistoryErr, setHealthHistoryErr] = useState(false);
    
    const [petToBeUpdate, setPetToBeUpdate] = useState(null);
  
    const [history, setHistory] = useState([]);
  
    const petHistoryCollectionRef = collection(db, "petHistory");
  
    useAuthentication('Admin')

    // Read data
    const getHistory = async () => {
      const data = await getDocs(query(petHistoryCollectionRef, orderBy('ownerName', 'asc')));
      
      setHistory(data.docs.map((doc) => ({...doc.data(), id: doc.id })))
    }
    useEffect(() => {
      
      getHistory();
    }, []);

    const [navVisible, showNavbar] = useState("false");

    const orderStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(5);
  
      // Avoid a layout jump when reaching the last page with empty rows.
      const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
  
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

    // Modal for Create
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    // this is how to update data in same file folder
    // this is my reference to understand better the update function of firebase using the repo and service.
    const updateHistory = async (id, age, healthHistory) => {
      const historyDoc = doc(db, "petHistory", id)
      const newAge = { age: setAge}
      const newHealthHistory = { healthHistory: setHealthHistory}
      await updateDoc(historyDoc, {newAge, newHealthHistory} )
    }


    // Delete
    // const deleteHistory = async (id) => {
    //   const historyDoc = doc(db, "petHistory", id);
    //   await deleteDoc(historyDoc)
    //   getHistory()
    // }

    // Modal  for Edit
    const [edit, setEdit] = useState(false);
    const handleOpenEdit = (pet) => {
      console.log(pet)
      setPetToBeUpdate(pet)
      setEdit(true);
    };
    const handleCloseEdit = () => {
      setPetToBeUpdate(null)
      setEdit(false);
    };

    // add new data
    const addPetHistory = async () => {
  
      setAgeErr("false")
      setBreedErr("false")
      setGenderErr("false")
      setDateErr("false")
      setOwnerNameErr("false")
      setPetNameErr("false")
      setRemarksErr("false")
      setSpeciesErr("false")
      setHealthHistoryErr("false")
      if( age == ''){
        return setAgeErr(true)
      }
      if( breed == ''){
        return setBreedErr(true)
      }
      if( gender == ''){
        return setGenderErr(true)
      }
      if( date == ''){
        return setDateErr(true)
      }
      if( ownerName == ''){
        return setOwnerNameErr(true)
      }
      if( petName == ''){
        return setPetNameErr(true)
      }
      if( remarks == ''){
        return setRemarksErr(true)
      }
      if( species == ''){
        return setSpeciesErr(true)
      }
      if( healthHistory == ''){
        return setHealthHistoryErr(true)
      }
      if(age && breed && date && gender && ownerName && petName && remarks && species && healthHistory){
        try {
            setLoading(true)
            const petHistory = await addDoc(petHistoryCollectionRef, {age: age, breed: breed, date: date, gender: gender, ownerName: ownerName, petName: petName, remarks: remarks, species: species, healthHistory: healthHistory});
            handleClose();
        } catch (e) {
            console.log(e.message);
        }
        setLoading(false)
      }
      getHistory()
    }

  return (
    <div>
        <Navbar visible={ navVisible } show={ showNavbar } />
        <div className={!navVisible ? "page" : "page page-with-navbar"}>
                <Paper elevation={3} sx={{width: '90%', margin: '5% auto'}}>
                    <Typography variant='h4' sx={{marginLeft: '1%',}}>Pet History</Typography>
                      
                      {/* This modal is for adding pet history */}
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                      >
                        <Box sx={{ ...phModal, width: '80%' }}>
                          <h2 id="parent-modal-title">Add new pet history</h2>
                          <Paper sx={{marginTop: 3, width: '100%', padding: 4}}>
                            <form>
                              <TextField m={{width:'100%'}}
                                        variant="outlined" 
                                        label='Owners Name' 
                                        id="ownerName"
                                        onChange={(e) => setOwnerName(e.target.value)}
                                        sx={{width: '40%', marginBottom:'10px', marginRight:'2%', marginLeft:'1%'}}      
                                        required 
                                      />
                              <TextField m={{width:'100%'}}
                                        variant="outlined" 
                                        label='Pet Name' 
                                        id="petName"
                                        onChange={(e) => setPetName(e.target.value)} 
                                        sx={{width: '26%', marginBottom:'10px', marginRight:'2%'}}      
                                        required 
                                      />
                              <TextField m={{width:'100%'}}
                                        variant="outlined" 
                                        label='Pet Species' 
                                        id="species" 
                                        onChange={(e) => setSpecies(e.target.value)}
                                        sx={{width: '28%', marginBottom:'10px',}}      
                                        required 
                                      />
                              <TextField m={{width:'100%'}}
                                        variant="outlined" 
                                        label='Pet Breed' 
                                        id="breed" 
                                        onChange={(e) => setBreed(e.target.value)}
                                        sx={{width: '30%', marginBottom:'10px', marginRight:'2%', marginLeft:'1%'}}      
                                        required 
                                      />
                              <TextField m={{width:'100%'}}
                                        variant="outlined" 
                                        label='Age' 
                                        id="age" 
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)} 
                                        sx={{width: '30%', marginBottom:'10px', marginRight:'2%'}}      
                                        required 
                                      />
                              <FormControl className='frmctrl'>
                                <FormLabel >Gender</FormLabel>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-row-radio-buttons-group-label"
                                  name="row-radio-buttons-group"
                                  id="gender"
                                  onChange={(e) => setGender(e.target.value)}
                                >
                                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                                </RadioGroup>
                              </FormControl> 
                              <TextField m={{width:'100%'}}
                                        variant="outlined" 
                                        label='Remarks' 
                                        onChange={(e) => {setRemarks(e.target.value)}}
                                        id="remarks" 
                                        sx={{width: '30%', marginBottom:'10px', marginRight:'2%', marginLeft:'1%'}}
                                        required 
                                      />
                              <TextField m={{width:'100%'}}
                                        type='datetime-local'
                                        variant="outlined" 
                                        id="date" 
                                        onChange={(e) => {setDate(e.target.value)}}
                                        sx={{width: '30%', marginBottom:'10px', marginRight:'2%'}}      
                                        required 
                                      />       
                              <TextField 
                                        variant="outlined" 
                                        label='Pet health history' 
                                        id="healthHistory" 
                                        onChange={(e) => {setHealthHistory(e.target.value)}}
                                        multiline rows={6}
                                        sx={{width: '98%', marginBottom:'10px', marginLeft:'1%'}}      
                                        required 
                                      />

                              <Button variant='contained' color='success' onClick={addPetHistory} disabled={loading} startIcon={<AddBoxIcon />} >Add pet history</Button>
                              <Button variant='contained' type='reset' sx={{margin: '0 5px'}} >Clear</Button>
                              <Button variant='contained' color='error' onClick={handleClose}>Cancel</Button>
                            </form>
                    </Paper>
                        </Box>
                      </Modal>
                      {/* This Modal is for Updating pet history */}
                      <Modal
                        open={edit}
                        onClose={handleCloseEdit}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                      >
                        <Box sx={{ ...phModal, width: '80%' }}>
                          <h2 id="parent-modal-title">Update pet history {petToBeUpdate?.ownerName}</h2>
                          <Paper sx={{marginTop: 3, width: '100%', padding: 4}}>
                      <form>
                        <TextField m={{width:'100%'}}
                                  variant="outlined" 
                                  label='Owners Name' 
                                  id="ownerName"
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, ownerName: e.target.value})}
                                  sx={{width: '40%', marginBottom:'10px', marginRight:'2%', marginLeft:'1%'}}      
                                  value={petToBeUpdate?.ownerName}
                                />
                        <TextField m={{width:'100%'}}
                                  variant="outlined" 
                                  label='Pet Name' 
                                  id="petName"
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, petName: e.target.value})}
                                  sx={{width: '26%', marginBottom:'10px', marginRight:'2%'}}      
                                  value={petToBeUpdate?.petName}
                                  disabled ={true}
                                />
                        <TextField m={{width:'100%'}}
                                  variant="outlined" 
                                  label='Pet Species' 
                                  id="species" 
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, species: e.target.value})}
                                  sx={{width: '28%', marginBottom:'10px',}}      
                                  value={petToBeUpdate?.species}
                                  disabled ={true}
                                />
                        <TextField m={{width:'100%'}}
                                  variant="outlined" 
                                  label='Pet Breed' 
                                  id="breed" 
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, breed: e.target.value})} 
                                  sx={{width: '30%', marginBottom:'10px', marginRight:'2%', marginLeft:'1%'}}      
                                  value={petToBeUpdate?.breed}
                                  disabled ={true}
                                />
                        <TextField m={{width:'100%'}}
                                  variant="outlined" 
                                  label='Age' 
                                  id="age" 
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, age: e.target.value})} 
                                  sx={{width: '30%', marginBottom:'10px', marginRight:'2%'}}
                                  value={petToBeUpdate?.age}   
                                  required 
                                />
                        <FormControl className='frmctrl'>
                          <FormLabel >Gender</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            id="gender"
                            value={petToBeUpdate?.gender}
                            onChange={(e) => setPetToBeUpdate({...petToBeUpdate, gender: e.target.value})}
                            disabled ={true}
                          >
                            <FormControlLabel value="male" control={<Radio />} disabled label="Male" />
                            <FormControlLabel value="female" control={<Radio />} disabled label="Female" />
                          </RadioGroup>
                        </FormControl> 
                        <TextField m={{width:'100%'}}
                                  variant="outlined" 
                                  label='Remarks' 
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, remarks: e.target.value})}
                                  id="remarks" 
                                  sx={{width: '30%', marginBottom:'10px', marginRight:'2%', marginLeft:'1%'}}
                                  value={petToBeUpdate?.remarks}
                                  disabled ={true}
                                />
                        <TextField m={{width:'100%'}}
                                  type='datetime-local'
                                  variant="outlined" 
                                  id="date" 
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, date: e.target.value})}
                                  sx={{width: '30%', marginBottom:'10px', marginRight:'2%'}}
                                  value={petToBeUpdate?.date}   
                                  required 
                                />       
                        <TextField 
                                  variant="outlined" 
                                  label='Pet health history' 
                                  id="healthHistory" 
                                  onChange={(e) => setPetToBeUpdate({...petToBeUpdate, healthHistory: e.target.value})}
                                  multiline rows={6}
                                  sx={{width: '98%', marginBottom:'10px', marginLeft:'1%'}}
                                  value={petToBeUpdate?.healthHistory}
                                  required 
                                />

                        <Button variant='contained' color='success' startIcon={<AddBoxIcon />} onClick={() => {updatePetHistoryService(petToBeUpdate.id, petToBeUpdate); getHistory();}} > Edit history </Button>
                        <Button variant='contained' type='reset' sx={{margin: '0 5px'}} >Clear</Button>
                        <Button variant='contained' color='error' onClick={handleCloseEdit}>Cancel</Button>
                      </form>
                    </Paper>
                        </Box>
                      </Modal>

                      {/* TABLE */}
                    <TableContainer sx={{display: 'flex', justifyContent: 'center'}} >
                    <Table sx={{ minWidth: 700, width: '100%' }} aria-label="customized table">
                      <TableHead sx={{bgcolor: 'black'}}>
                        <TableRow>
                          <TableCell align="left" sx={{color: 'white', fontSize: '17px'}}>Owner's Name</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>Pet Name</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>Pet Species</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>Pet Breed</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>Age</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>Gender</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>Remarks</TableCell>
                          <TableCell align="center" sx={{color: 'white'}}>Date</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>History</TableCell>
                          <TableCell align="center" sx={{color: 'white', fontSize: '17px'}}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{(rowsPerPage > 0
                            ? history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : history
                          ).map((pet) => (
                          <TableRow key={pet.id}>
                            <TableCell align="left">{pet.ownerName}</TableCell>
                            <TableCell align="center">{pet.petName}</TableCell>
                            <TableCell align="center">{pet.species}</TableCell>
                            <TableCell align="center">{pet.breed}</TableCell>
                            <TableCell align="center">{pet.age}</TableCell>
                            <TableCell align="center">{pet.gender}</TableCell>
                            <TableCell align="center">{pet.remarks}</TableCell>
                            <TableCell align="center">{pet.date}</TableCell> 
                            <TableCell align="center" width='35%'>{pet.healthHistory}</TableCell>
                            <TableCell align="center">
                              <IconButton sx={editStyle} onClick={() => {handleOpenEdit(pet)}}>Edit<EditIcon fontSize='small'/></IconButton> 
                              {/* <IconButton sx={deleteStyle} onClick={() => {deleteHistory(pet.id)}} >Delete<DeleteIcon fontSize='small'/></IconButton> */}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                              colSpan={10}
                              count={history.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              SelectProps={{
                                inputProps: {
                                  'aria-label': 'rows per page',
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
                  <Button variant='contained' color='success' onClick={() => {handleOpen(ownerName, petName, species, breed, age, gender, remarks, date, healthHistory)}} startIcon={<AddBoxIcon />} sx={{float: 'right', margin: 3}}>Add pet history</Button>
                    {/* <div style={{ height: '40%', width: '80%'}}>
                      <DataGrid
                        rows={petRows}
                        columns={petColumns}
                        pageSize={5}
                        rowsPerPageOptions={[2]}
                    />
                    </div> */}
                    
                </Paper>
              </div>
    </div>
  )
}

export default PetHistory