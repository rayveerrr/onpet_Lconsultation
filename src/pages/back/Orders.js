import React, { useState, useEffect, useCallback } from "react";
import { Paper, Typography } from "@mui/material";

import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase-config";
import { ref } from "firebase/storage";

import Navbar from "../../components/Navbar";
import { Button, IconButton, TableFooter, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Modal from "@mui/material/Modal";

import "../../index.css";
import useAuthentication from "../../hooks/auth/authenticate-user";

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
const hideStyle = {
  bgcolor: "gray",
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

const Orders = () => {
  useAuthentication("Admin");

  const [navVisible, showNavbar] = useState("false");

  const orderStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
 

  const [finalLists, setFinalLists] = useState([]);
  const [orders, setOrders] = useState([]);

  const ordersCollectionRef = collection(db, "Orders");

  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
      // get the order number so it will filter and create a table for the products that has the same ordernumber. will try fix this again tomorrow morning.
      const orderList = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter(
          (order) => order.Status === "Delivered" || order.Status === "Rejected"
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

  const transactionSumOfPrice = useCallback((orderList: any[]) => {
    let totalAmount = 0;
    orderList.forEach((orderItem) => (totalAmount += orderItem.totalAmount));
    return totalAmount;
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  return (
    <div>
      <Navbar visible={navVisible} show={showNavbar} />
      <div
        className={!navVisible ? "page" : "page page-with-navbar"}
        style={orderStyle}
      >
        <Paper sx={{ textAlign: "center", margin: "5% auto"}}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Purchased History
          </Typography>
          <TableContainer sx={{ display: "flex", justifyContent: "center" }}>
            <Table
              sx={{ minWidth: 700, width: "100%" }}
              aria-label="customized table"
            >
              <TableHead sx={{ bgcolor: "black" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Order Number</TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Email
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Name
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Address
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Total Amount
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Status
                  </TableCell>
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
                          <TableCell component="th" scope="row">
                            {order.orders[0].OrderNumber}
                          </TableCell>
                          <TableCell align="left">
                            {order.orders[0].Email}
                          </TableCell>
                          <TableCell align="left">
                            {order.orders[0].Name}
                          </TableCell>
                          <TableCell align="left">
                            {order.orders[0].Address}
                          </TableCell>
                          <TableCell align="left">
                            ₱ {transactionSumOfPrice(order.orders).toLocaleString()}
                          </TableCell>
                          <TableCell align="left">
                            { order.orders[0].Status == 'Delivered' ? <span style={{color: 'green'}}> {order.orders[0].Status} </span> : <span style={{color: 'red'}} > {order.orders[0].Status} </span>}
                            
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
        </Paper>
      </div>
    </div>
  );
};

export default Orders;
