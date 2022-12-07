import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Divider, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";

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

const sample = [
  {
    id: 1,
    itemName: "name",
    description: "Ongoing",
    price: "Ongoing",
    quantity: "Ongoing",
    image: "image",
  },
  {
    id: 2,
    itemName: "Ongoing",
    description: "Ongoing",
    price: "Ongoing",
    quantity: "Ongoing",
    image: "image",
  },
  {
    id: 3,
    itemName: "Ongoing",
    description: "Ongoing",
    price: "Ongoing",
    quantity: "Ongoing",
    image: "Ongoing",
  },
  {
    id: 4,
    itemName: "Ongoing",
    description: "Ongoing",
    price: "Ongoing",
    quantity: "Ongoing",
    image: "Ongoing",
  },
  {
    id: 5,
    itemName: "Ongoing",
    description: "Ongoing",
    price: "Ongoing",
    quantity: "Ongoing",
    image: "Ongoing",
  },
  {
    id: 6,
    itemName: "Ongoing",
    description: "Ongoing",
    price: "Ongoing",
    quantity: "Ongoing",
    image: "Ongoing",
  },
  {
    id: 7,
    itemName: "Ongoing",
    description: "Ongoing",
    price: "Ongoing",
    quantity: "Ongoing",
    image: "Ongoing",
  },
];

// Pet history Modal

const phModal = {
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

  const ordersCollectionRef = collection(db, "Orders");

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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sample.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
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
    getOrders();
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
      // get the order number so it will filter and create a table for the products that has the same ordernumber. will try fix this again tomorrow morning.
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
    getOrders();
  }, []);

  const submitUpdateOrderStatus = async (OrderNumber, Status) => {
    await orderUpdateStatusService(OrderNumber, Status);
    //refresh data
    const myOrders = await getMyOrdersService();
    setOrders(myOrders);
    alert("Status updated.");
  };

  const transactionSumOfPrice = useCallback((orderList: any[]) => {
    let totalAmount = 0;
    orderList.forEach((orderItem) => (totalAmount += orderItem.totalAmount));
    return totalAmount;
  }, []);

  return (
    <div>
      <Typography variant="h3" sx={{textAlign: 'center', }}>
        Transaction
      </Typography>
      <Navbar visible={navVisible} show={showNavbar} />
      <div className={!navVisible ? "page" : "page page-with-navbar"}>
      {/* On Request */}{/* On Request */}
      {/* On Request */}{/* On Request */}
        
        <Paper sx={{ width: "100%", margin: "0 auto", display: 'flex', justifyContent: 'space-evenly'}}>
        
          <div>
          <Typography variant="h4" textAlign={'center'}>
            On Request
          </Typography>
          {finalLists.map((order) => {
            return (
              <>
                <Paper sx={{ width: "100%", marginBottom: "10px", padding: '1em' }}>
                  <Container
                    sx={{ display: "flex", justifyContent: "space-between", margin: 0}}
                  >
                    <Typography variant="subtitle2">
                      <b>Order number: #{order.orders[0].OrderNumber}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Status: {order.orders[0].Status}</b>
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
                      <b>Email: {order.orders[0].Email}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Payment Method: {order.orders[0].Payment}</b>
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
                  {order.orders.map((actualOrder) => {
                    return (
                      <>
                        
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
                  
                  <Typography variant="subtitle2">
                    <b>Total Payment: ₱ {transactionSumOfPrice(order.orders).toLocaleString()}</b>
                  </Typography>
                  </Container>
                  
                  <Container sx={{textAlign: 'center', display: 'flex', justifyContent: 'space-around', marginTop: '0.5em'}}>
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
                    </Container>
                </Paper>
              </>
            );
          })}
          </div>

          <div>
        {/* On Process */}{/* On Process */}
        {/* On Process */}{/* On Process */}
        <Typography variant="h4" textAlign={'center'}>
            On Process
          </Typography>
        {onProcessLists.map((order) => {
            return (
              <>
                <Paper sx={{ width: "100%", marginBottom: "10px", padding: '1em' }}>
                  <Container
                    sx={{ display: "flex", justifyContent: "space-between", margin: 0}}
                  >
                    <Typography variant="subtitle2">
                      <b>Order number: #{order.orders[0].OrderNumber}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Status: {order.orders[0].Status}</b>
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
                      <b>Email: {order.orders[0].Email}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Payment Method: {order.orders[0].Payment}</b>
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
                  {order.orders.map((actualOrder) => {
                    return (
                      <>
                        
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
                  
                  <Typography variant="subtitle2">
                    <b>Total Payment: ₱ {transactionSumOfPrice(order.orders).toLocaleString()}</b>
                  </Typography>
                  </Container>
                  
                  <Container sx={{textAlign: 'center'}}>
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
                    </Container>
                </Paper>
              </>
            );
          })}
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Transaction;
