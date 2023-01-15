import React, { useEffect, useState } from "react";
import { InputBase, Paper, Typography } from "@mui/material";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import Navbar from "../../components/Navbar";
import {
  Button,
  IconButton,
  TableFooter,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Modal from "@mui/material/Modal";

import SearchIcon from '@mui/icons-material/Search';

import "../../index.css";
import useAuthentication from "../../hooks/auth/authenticate-user";
import { updateProductService } from "../../data/firebase/services/product.service";
import { getProducts } from "../../data/firebase/repositories/product.repository";

const editStyle = {
  bgcolor: "green",
  color: "white",
  fontSize: 16,
  borderRadius: 8,
  marginRight: 1,
  "&:hover": {
    bgcolor: "white",
    color: "green",
  },
};
const deleteStyle = {
  bgcolor: "red",
  color: "white",
  fontSize: 16,
  borderRadius: 8,
  "&:hover": {
    bgcolor: "white",
    color: "red",
  },
};

const suppliesModal = {
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

const Supplies = () => {
  useAuthentication("Admin");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [navVisible, showNavbar] = useState("false");

  const orderStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [prodName, setProdName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [product, setProduct] = useState([]);
  const [productTobeUpdate, setProductTobeUpdate] = useState([]);

  const productCollectionRef = collection(db, "Product");

  // Add new product
  const addProduct = async () => {
    const uploadedImage = await uploadImage()
    try {
      setLoading(true);
      await addDoc(productCollectionRef, {
        Category: category,
        Description: description,
        Price: price,
        ProdName: prodName,
        Quantity: quantity,
        ImageURL: uploadedImage,
      });
      handleClose();
    } catch (e) {
      console.log(e);
    }
    getProduct();
    setLoading(false);
  };

  // Read all the product
  const getProduct = async () => {
    const data = await getDocs(productCollectionRef);
    setProduct(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getProduct();
  }, []);

  // Delete ng product
  // const deleteProduct = async (id) => {
  //   const productDoc = doc(db, "Product", id);
  //   await deleteDoc(productDoc);
  //   getProduct();
  // };


  const [imgUpload, setImgUpload] = useState(null);

  const uploadImage = () => {
    if (imgUpload == null) return;
    const imgRef = ref(storage, `suppliesImages/${imgUpload.name + v4()}`);
    return uploadBytes(imgRef, imgUpload).then(
      async (res) => await retrieveImg(res.metadata.fullPath)
    );
  };

  const retrieveImg = async (fullPath) => {
    return getDownloadURL(ref(storage, fullPath)).then((url) => {
      return url;
    });
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - productCollectionRef.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Modal  for Edit
  const [edit, setEdit] = useState(false);
  const handleOpenEdit = (prod) => {
    console.log(prod)
    setProductTobeUpdate(prod)
    setEdit(true);
  };
  const handleCloseEdit = () => {
    setProductTobeUpdate(null)
    setEdit(false);
  };

  return (
    <div>
      <Navbar visible={navVisible} show={showNavbar} />
      <div className={!navVisible ? "page" : "page page-with-navbar"}>
        <Paper sx={{ textAlign: "center", margin: "0 auto 0 auto" }}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            <b>Supplies</b>
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
                    Item name
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Image
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Description
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Price
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Quantity
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Category
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? product.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : product
                ).filter((prod) => {
                  if(search == ''){
                    return prod;
                  }else if (prod.ProdName.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                    return prod;
                  }
                }).map((prod) => (
                  <TableRow key={prod.id}>
                    <TableCell align="right">{prod.ProdName}</TableCell>
                    <TableCell align="right"><div style={{width: '100px', height: '120px', border: '1px black solid'}}><img src={prod.ImageURL} alt="product" style={{width: '100%', height: '100%'}} /></div></TableCell>
                    <TableCell align="center">{prod.Description}</TableCell>
                    <TableCell align="center">{prod.Price}</TableCell>
                    <TableCell align="center">{prod.Quantity}</TableCell>
                    <TableCell align="center">{prod.Category}</TableCell>
                    <TableCell align="center">
                    <IconButton sx={editStyle} onClick={() => {handleOpenEdit(prod)}}>Edit<EditIcon fontSize='small'/></IconButton> 
                      {/* <IconButton
                        sx={deleteStyle}
                        onClick={() => {
                          deleteProduct(prod.id);
                        }}
                      >
                        Delete
                        <DeleteIcon fontSize="small" />
                      </IconButton> */}
                    </TableCell>
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
                    count={product.length}
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
            Add new product
          </Button>

          {/* Modal for create */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...suppliesModal, width: "60%" }}>
              <form
                style={{
                  width: "100%",
                  margin: "10px auto",
                  border: "1px lightgray solid",
                  padding: 15,
                  borderRadius: 9,
                }}
              >
                <Typography variant="h4" sx={{ textAlign: "left" }}>
                  Add new item
                </Typography>
                <TextField
                  m={{ width: "100%" }}
                  variant="outlined"
                  label="Item name"
                  id="itemName"
                  onChange={(e) => {
                    setProdName(e.target.value);
                  }}
                  sx={{ width: "50%", marginBottom: "10px", marginRight: "2%" }}
                  required
                />
                <TextField
                  type='number'
                  m={{ width: "100%" }}
                  variant="outlined"
                  label="Price"
                  id="price"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  sx={{ width: "23%", marginBottom: "10px", marginRight: "2%" }}
                  required
                />
                <TextField
                  type='number'
                  variant="outlined"
                  label="Quantity"
                  id="quantity"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                  sx={{ width: "23%", marginBottom: "10px" }}
                  required
                />
                <TextField
                  variant="outlined"
                  label="Description"
                  id="description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  sx={{ width: "100%", marginBottom: "10px" }}
                  multiline
                  rows={4}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="category"
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                    label="Select Category"
                  >
                    <MenuItem value="food">Pet Food</MenuItem>
                    <MenuItem value="supplement">Pet Supplement</MenuItem>
                    <MenuItem value="cage">Pet Cage</MenuItem>
                    <MenuItem value="accessories">Pet Accessories</MenuItem>
                    <MenuItem value="feeders">Pet Feeders/Bowls</MenuItem>
                    <MenuItem value="treats">Pet Treats</MenuItem>
                  </Select>
                </FormControl>
                <input
                  type="file"
                  onChange={(e) => {
                    setImgUpload(e.target.files[0]);
                  }}
                  style={{margin: '10px 0'}}
                />
                <div>
                  <Button
                    variant="contained"
                    className="save-btn"
                    onClick={addProduct}
                    disabled={loading}
                    sx={{ marginRight: 2 }}
                  >
                    ADD NEW ITEM
                  </Button>
                  <Button variant='contained' color='error' onClick={handleClose}>Cancel</Button>
                </div>
              </form>
            </Box>
          </Modal>
        </Paper>

        {/* Modal for editing product */}
        <Modal
            open={edit}
            onClose={handleCloseEdit}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...suppliesModal, width: "60%" }}>
              <form
                style={{
                  width: "100%",
                  margin: "10px auto",
                  border: "1px lightgray solid",
                  padding: 15,
                  borderRadius: 9,
                }}
              >
                <Typography variant="h4" sx={{ textAlign: "left", marginBottom: 2 }}>
                  Update existing item
                </Typography>
                <TextField
                  m={{ width: "100%" }}
                  variant="outlined"
                  label="Item name"
                  id="itemName"
                  onChange={(e) => setProductTobeUpdate({...productTobeUpdate, ProdName: e.target.value})}      
                  value={productTobeUpdate?.ProdName}
                  sx={{ width: "50%", marginBottom: "10px", marginRight: "2%" }}
                  required
                />
                <TextField
                  type='number'
                  m={{ width: "100%" }}
                  variant="outlined"
                  label="Price"
                  id="price"
                  onChange={(e) => setProductTobeUpdate({...productTobeUpdate, Price: e.target.value})}      
                  value={productTobeUpdate?.Price}
                  sx={{ width: "23%", marginBottom: "10px", marginRight: "2%" }}
                  required
                />
                <TextField
                  type='number'
                  variant="outlined"
                  label="Quantity"
                  id="quantity"
                  onChange={(e) => setProductTobeUpdate({...productTobeUpdate, Quantity: e.target.value})}      
                  value={productTobeUpdate?.Quantity}
                  sx={{ width: "23%", marginBottom: "10px" }}
                  required
                />
                <TextField
                  variant="outlined"
                  label="Description"
                  id="description"
                  onChange={(e) => setProductTobeUpdate({...productTobeUpdate, Description: e.target.value})}      
                  value={productTobeUpdate?.Description}
                  sx={{ width: "100%", marginBottom: "10px" }}
                  multiline
                  rows={4}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="category"
                    onChange={(e) => setProductTobeUpdate({...productTobeUpdate, Category: e.target.value})}      
                    value={productTobeUpdate?.Category}
                    label="Select Category"
                  >
                    <MenuItem value="food">Pet Food</MenuItem>
                    <MenuItem value="supplement">Pet Supplement</MenuItem>
                    <MenuItem value="cage">Pet Cage</MenuItem>
                    <MenuItem value="accessories">Pet Accessories</MenuItem>
                    <MenuItem value="feeders">Pet Feeders/Bowls</MenuItem>
                    <MenuItem value="treats">Pet Treats</MenuItem>
                  </Select>
                </FormControl>

                {/* need to be fix kaya comment in muna */}
                {/* <input
                  type="file"
                  onChange={(e) => {
                    setImgUpload(e.target.files[0]);
                  }}
                /> */}

                <div style={{marginTop: 10}}>
                  <Button
                    variant="contained"
                    className="save-btn"
                    color='success'
                    onClick={(e) => {updateProductService(productTobeUpdate.id, productTobeUpdate); getProduct();}}
                    disabled={loading}
                    sx={{marginRight: 2}}
                  >
                    Update
                  </Button>
                  <Button variant='contained' color='error' onClick={handleCloseEdit}>Cancel</Button>
                </div>
              </form>
            </Box>
          </Modal>
      </div>
    </div>
  );
};

export default Supplies;
