import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Divider, InputBase, Paper, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, addDoc, getDocs, doc, query, orderBy } from "firebase/firestore";
import { auth, db } from "../../firebase-config";

// notification
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../../components/Navbar";

import { Button, IconButton, TableFooter } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Modal from "@mui/material/Modal";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import useAuthentication from "../../hooks/auth/authenticate-user";
import {
  getAllOrdersService,
  getMyOrdersService,
  orderStatusAcceptedService,
  orderStatusCompletedService,
  orderStatusRejectedService,
  orderUpdateStatusService,
} from "../../data/firebase/services/order.service";

import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";



const editStyle = {
  bgcolor: "green",
  color: "white",
  fontSize: 16,
  borderRadius: 8,
  "&:hover": {
    bgcolor: "white",
    color: "green",
  },
};
const acceptStyle = {
  bgcolor: "blue",
  color: "white",
  fontSize: 16,
  borderRadius: 8,
  "&:hover": {
    bgcolor: "white",
    color: "gray",
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

// ProductList Modal



const plModal = {
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

const Transaction = () => {
  useAuthentication("Admin");

  const [orders, setOrders] = useState([]);
  const [finalLists, setFinalLists] = useState([]);
  const [onProcessLists, setOnProcessLists] = useState([]);
  const [orderToBeUpdate, setOrderToBeUpdate] = useState(null);
  const [search, setSearch] = useState('');
  const [ordersList, setOrdersList] = useState([]); 

  const ordersCollectionRef = collection(db, "Orders");

  const [edit, setEdit] = useState(false);
    const handleOpenEdit = (order) => {
      console.log(order)
      setOrderToBeUpdate(order)
      setEdit(true);
    };
    const handleCloseEdit = () => {
      setOrderToBeUpdate(null)
      setEdit(false);
    };

  useEffect(() => {
    const getOrders = async () => {
      const orders = await getAllOrdersService();
      setOrders(orders);
    };
    getOrders();
  }, []);

  const [navVisible, showNavbar] = useState("false");

  const orderStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [pagee, setPagee] = useState(0);
  const [rowsPerPagee, setRowsPerPagee] = useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - finalLists.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRowss =
    pagee > 0 ? Math.max(0, (1 + pagee) * rowsPerPagee - onProcessLists.length) : 0;

  const handleChangePagee = (event, newPagee) => {
    setPagee(newPagee);
  };

  const handleChangeRowsPerPagee = (event) => {
    setRowsPerPagee(parseInt(event.target.value, 10));
    setPagee(0);
  };


  // On Request
  const getOrderss = async () => {
    const data = await getDocs(query(ordersCollectionRef, orderBy('Date', 'desc')));
    // get the order number so it will filter and create a table for the products that has the same ordernumber. will try fix this again tomorrow morning.
    const orderList = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter(
        (order) =>
          order.Status === "On Request"
      );
    let uniqueOrderId = [
      ...new Set(orderList.map((order) => order.OrderNumber)),
    ];
    let uniqueOrderStatus = [
      ...new Set(orderList.map((order) => order.Status)),
    ];
    const finalList = uniqueOrderId.map((orderNumber) => ({
      orderNumber,
      orders: orderList.filter((order) => order.OrderNumber == orderNumber),
    }));
    const finalStat = uniqueOrderStatus.map((finalstatus) => ({
      finalstatus,
      finalStats: orderList.filter((order) => order.Status == finalstatus),
    }));
    setOrders(orderList);
    setFinalLists(finalList);
  };
  useEffect(() => {
    getOrderss();
  }, []);


  // Onprocess
  const getOrders = async () => {
    const data = await getDocs(query(ordersCollectionRef, orderBy('Date', 'desc')));
    const orderList = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter(
        (order) =>
          order.Status === "On Process" 
      );
    let uniqueOrderId = [
      ...new Set(orderList.map((order) => order.OrderNumber)),
    ];
    let uniqueOrderStatus = [
      ...new Set(orderList.map((order) => order.Status)),
    ];
    const finalList = uniqueOrderId.map((orderNumber) => ({
      orderNumber,
      orders: orderList.filter((order) => order.OrderNumber == orderNumber),
    }));
    const finalStat = uniqueOrderStatus.map((finalstatus) => ({
      finalstatus,
      finalStats: orderList.filter((order) => order.Status == finalstatus),
    }));
    setOrders(orderList);
    setOnProcessLists(finalList);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const submitUpdateOrderStatus = async (OrderNumber, Status) => {
    await orderUpdateStatusService(OrderNumber, Status);
    //refresh data
    const myOrders = await getMyOrdersService();
    setOrders(myOrders);
    alert("Status updated.");
    getOrders();
    getOrderss()
  };

  const transactionSumOfPrice = useCallback((orderList: any[]) => {
    let totalAmount = 0;
    orderList.forEach((orderItem) => (totalAmount += orderItem.totalAmount));
    return totalAmount;
  }, []);

  return (
    <div>

    <Modal
      open={edit}
      onClose={handleCloseEdit}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={{ ...plModal, width: '80%' }}>
     
                <Paper sx={{ width: "100%", marginBottom: "10px", padding: '1em' }}>
                  <Container
                    sx={{ display: "flex", justifyContent: "space-between", margin: 0}}
                  >
                    <Typography variant="subtitle2">
                      <b>Order number: #{orderToBeUpdate?.orders[0].OrderNumber}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Status: {orderToBeUpdate?.orders[0].Status}</b>
                    </Typography>
                  </Container> 
                  <Container
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle2">
                      <b>Email: {orderToBeUpdate?.orders[0].Email}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Number: {orderToBeUpdate?.orders[0].PhoneNum}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Payment Method: {orderToBeUpdate?.orders[0].Payment}</b>
                    </Typography>
                  </Container>
                  <Container
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            marginTop: "15px",
                          }}
                        >
                  {orderToBeUpdate?.orders.map((actualOrder) => {
                    return (
                      <>
                          <Typography key={actualOrder.id}></Typography>
                          <Typography variant="caption">
                            Product Name: {actualOrder.ProdName}
                          </Typography>
                          <Typography variant="caption">
                            Quantity: {actualOrder.Quantity}
                          </Typography>
                          <Typography variant="caption">
                            Total Amount: {actualOrder.totalAmount}
                          </Typography>
                          <Divider />
                          
                        
                      </>
                    );
                  })}
                  </Container>
                </Paper>
              
    </Box>
    </Modal>
    
      <Navbar visible={navVisible} show={showNavbar} />
      <div className={!navVisible ? "page" : "page page-with-navbar"}>
      {/* On Request */}{/* On Request */}
      {/* On Request */}{/* On Request */}
        
        <Paper sx={{width: '80%'}} >
        <Typography variant="h3" sx={{textAlign: 'center', }}>
            Transaction
          </Typography>
          <TableContainer>
            <Typography variant="h4"> On Request </Typography>
            <Table>
              <TableHead bgcolor={'black'}>
                <TableRow >
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Order Number </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Name </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Email </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Phone Number </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Date </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Status </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Total Payment </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Payment Method </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Ordered product list </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Action </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {(rowsPerPage > 0
                  ? finalLists.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : finalLists
              ).map((order) => (
                <TableRow key={order.orders.id}>
                  <TableCell >{order.orders[0].OrderNumber}</TableCell>
                  <TableCell>{order.orders[0].Name}</TableCell>
                  <TableCell>{order.orders[0].Email}</TableCell>
                  <TableCell>{order.orders[0].PhoneNum}</TableCell>
                  <TableCell>{order.orders[0].Date}</TableCell>
                  <TableCell>{order.orders[0].Status}</TableCell>
                  <TableCell> ₱ {transactionSumOfPrice(order.orders).toLocaleString()}</TableCell>
                  <TableCell>{order.orders[0].Payment}</TableCell>
                  <TableCell><Button variant="text" onClick={() => {handleOpenEdit(order)}}>Ordered Product List</Button></TableCell>
                  <TableCell>
                    <IconButton
                    sx={acceptStyle}
                    onClick={() =>
                      submitUpdateOrderStatus(
                        order.orders[0].OrderNumber,
                        "On Process"
                      )
                    }
                    >
                      Accept 
                      <PlaylistAddCheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={deleteStyle}
                      onClick={() =>
                        submitUpdateOrderStatus(
                          order.orders[0].OrderNumber,
                          "Rejected"
                        )
                      }
                    >
                      Reject 
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
                    colSpan={10}
                    count={finalLists.length}
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

          {/* On Process */}
          {/* On Process */}
          {/* On Process */}
          <TableContainer>
          <Typography variant="h4"> On Process </Typography>
            <Table>
              <TableHead bgcolor={'black'}>
              <TableRow >
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Order Number </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Name </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Email </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Phone Number </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Date </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Status </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Total Payment </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Payment Method </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Ordered product list </TableCell>
                  <TableCell sx={{color: 'white', fontSize: '17px'}}> Action </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {(rowsPerPagee > 0
                  ? onProcessLists.slice(
                    pagee * rowsPerPagee,
                    pagee * rowsPerPagee + rowsPerPagee
                  )
                : onProcessLists
              ).map((order) => (
                <TableRow key={order.orders.id}>
                  <TableCell >{order.orders[0].OrderNumber}</TableCell>
                  <TableCell>{order.orders[0].Name}</TableCell>
                  <TableCell>{order.orders[0].Email}</TableCell>
                  <TableCell>{order.orders[0].PhoneNum}</TableCell>
                  <TableCell>{order.orders[0].Date}</TableCell>
                  <TableCell>{order.orders[0].Status}</TableCell>
                  <TableCell> ₱ {transactionSumOfPrice(order.orders).toLocaleString()}</TableCell>
                  <TableCell>{order.orders[0].Payment}</TableCell>
                  <TableCell><Button variant="text" onClick={() => {handleOpenEdit(order)}}>Ordered Product List</Button></TableCell>
                  <TableCell>
                    <IconButton
                      sx={editStyle}
                      onClick={() =>
                        submitUpdateOrderStatus(
                          order.orders[0].OrderNumber,
                          "Delivered"
                        )
                      }
                    >
                      Delivered
                      <BeenhereIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                ))}
                {emptyRowss > 0 && (
                  <TableRow style={{ height: 53 * emptyRowss }}>
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
                    colSpan={10}
                    count={onProcessLists.length}
                    rowsPerPage={rowsPerPagee}
                    page={pagee}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePagee}
                    onRowsPerPageChange={handleChangeRowsPerPagee}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default Transaction;
