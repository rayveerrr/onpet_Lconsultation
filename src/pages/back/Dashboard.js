import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Divider, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, doc, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../firebase-config";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';


import Navbar from "../../components/Navbar";
import { getAllOrdersService } from "../../data/firebase/services/order.service";

function Dashboard() {

  const [orders, setOrders] = useState([]);
  const [finalLists, setFinalLists] = useState([]);
  const [onProcessLists, setOnProcessLists] = useState([]);
  const [orderToBeUpdate, setOrderToBeUpdate] = useState(null);
  const [search, setSearch] = useState('');
  const [ordersList, setOrdersList] = useState([]);
  const [product, setProduct] = useState([]); 
  const [received, setReceived] = useState([]); 

  const ordersCollectionRef = collection(db, "Orders");
  const productCollectionRef = collection(db, "Product");

  useEffect(() => {
    const getOrders = async () => {
      const orders = await getAllOrdersService();
      setOrders(orders);
    };
    getOrders();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

      const receivedOrder = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter(
        (order) =>
          order.Status === "Delivered"
      );
      
    let uniqueOrderId = [
      ...new Set(orderList.map((order) => order.OrderNumber)),
    ];

    let uniqueReceivedId = [
      ...new Set(receivedOrder.map((order) => order.OrderNumber)),
    ];

    const finalList = uniqueOrderId.map((orderNumber) => ({
      orderNumber,
      orders: orderList.filter((order) => order.OrderNumber == orderNumber),
    }));

    const receivedList = uniqueReceivedId.map((orderNumber) => ({
      orderNumber,
      orders: receivedOrder.filter((order) => order.OrderNumber == orderNumber),
    }));

    setOrders(orderList);
    setFinalLists(finalList);
    setReceived(receivedOrder);
  };

  useEffect(() => {
    getOrderss();
  }, []);

  const transactionSumOfPrice = useCallback((orderList: any[]) => {
    let totalAmount = 0;
    orderList.forEach((orderItem) => (totalAmount += orderItem.totalAmount));
    return totalAmount;
  }, []);

  const totalOfSales = useMemo(() => {
    let totalAmount = 0;
    received.forEach((receivedItem) => (totalAmount += receivedItem.totalAmount));
    return totalAmount;
  }, [received]);

  console.log(received);

  // Read products out of stock
  const getProduct = async () => {
    const data = await getDocs(productCollectionRef);
    setProduct(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter((productStock) => productStock.Quantity == 0));
  };

  useEffect(() => {
    getProduct();
  }, []);

    const [navVisible, showNavbar] = useState("false");
  return (
    <div>
        <Navbar visible={navVisible} show={showNavbar} />
        <div className={!navVisible ? "page" : "page page-with-navbar"}>
          <Paper sx={{width: '90%', height: '80vh', margin: 'auto', marginTop: '50px', display: 'flex'}}>
            <TableContainer sx={{marginTop: 3, width: '65%', height: '75%', margin: 'auto'}}>
              <Typography variant="h4"> <b>Orders</b> </Typography>
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
                        colSpan={8}
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


              {/* Lahat ng delivered itototal yung total payment. ayun yung lalabas sa total sales. */}
              {/* Lahat ng delivered itototal yung total payment. ayun yung lalabas sa total sales. */}
              {/* Lahat ng delivered itototal yung total payment. ayun yung lalabas sa total sales. */}
              <div style={{width: '30%', margin: 'auto'}}>
                <Paper sx={{width: '100%', height: '30%', margin: 'auto'}}>
                  <Typography variant="h4"> Total Sales: </Typography>
                  <Typography variant="h3"> <b>₱ {totalOfSales.toLocaleString()}</b> </Typography>
                </Paper>

                <Paper sx={{width: '100%', height: '50%', margin: 'auto', marginTop: '50px'}}>
                  <Typography variant="h4"> <b>Out of stock</b></Typography>
                    <Divider/>
                      <Paper >
                        <List
                          sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 200,
                            '& ul': { padding: 0 },
                          }}
                        >
                          <ul>
                            {product.map((prod) => {
                              return (
                                <Typography key={prod.id} sx={{border: '1px black solid', borderRadius: '5px', width: '100%', margin: 'auto', marginTop: 1}}>
                                  <Typography variant="title">
                                    <span style={{color: 'red'}}><b>{prod.ProdName}</b></span>
                                  </Typography>
                                  <Divider/>
                                  <Typography>
                                    Quantity: {prod.Quantity}
                                  </Typography>
                                </Typography>
                              );
                            })}
                          </ul>
                        </List>
                      </Paper>
                    <Divider/>
                </Paper>
              </div>
          </Paper>
        </div>
        
    </div>
  )
}

export default Dashboard