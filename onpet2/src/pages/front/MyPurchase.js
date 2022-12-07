import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { getDocs, collection } from "firebase/firestore";

// component
import Header from "../../components/frontend/Header";
import Sidebar from "../../components/frontend/Sidebar";

// Styles
import "../../styles/mypurchase.css";

// Image
import beefpro from "../../image/beefpro.jpg";
import profile from "../../image/user.png";

// Icon
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Paper, Divider, List, ListItemText, Typography } from "@mui/material";
import Footer from "../../components/frontend/Footer";
import useAuthentication from "../../hooks/auth/authenticate-user";

const style = {
  width: "100%",
  maxWidth: 360,
};

function MyPurchase() {
  useAuthentication("User");

  const [orders, setOrders] = useState([]);
  const [finalLists, setFinalLists] = useState([]);
  const [finalStatus, setFinalStatus] = useState([]);

  const ordersCollectionRef = collection(db, "Orders");

  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
      // get the order number so it will filter and create a table for the products that has the same ordernumber. will try fix this again tomorrow morning.
      const orderList = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter(
          (cartEmail) => cartEmail.Email === sessionStorage.getItem("email")
          &&
          cartEmail.Status === 'On Process' || cartEmail.Status === 'On Request'
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

  const sumOfPrice = useMemo(() => {
    let totalAmount = 0;
    // fix mo to ver. kukunin mo yung order number lahat ng magkakaparehas na order number pag aaddin mo yung mga price tas ilagay sa total amount.
    orders.forEach((orderItem) => (totalAmount += orderItem.totalAmount));
    return totalAmount;
  }, [orders]);

  const sumOfOrderNumber = useMemo(() => {
    let totalAmount = 0;
    // fix mo to ver. kukunin mo yung order number lahat ng magkakaparehas na order number pag aaddin mo yung mga price tas ilagay sa total amount.
    finalLists.forEach((orderItem) => (totalAmount += orderItem.totalAmount));
    return totalAmount;
  }, [finalLists]);

  const orderStatus = useMemo(() => {
    let Status = "";
    finalLists.forEach((ordersStatus) => (Status = ordersStatus.Status));
    return Status;
  }, [finalLists]);

  return (
    <div>
      <Header />
      <div className="main-content-container">
        <Sidebar />
        <div className="content-container">
          <Paper className="content-header" elevation={1}>
            <Link to="/mypurchase">Order</Link>
            <Link to="/mypurchase/mypurchasedhistory">My Purchased History</Link>
          </Paper>
          {finalLists.map((order) => {
            return (
              <>
                <div
                  className="purchase-container"
                  style={{
                    border: "2px solid #0D0D0D",
                    borderRadius: 10,
                    padding: "1em 2em",
                    marginBottom: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <div className="purchase-border">
                    <div
                      className="purchase-header"
                      style={{
                        diplay: "flex",
                        margin: "auto 0px",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "20px" }}>
                          Order number: <b>#{order.orders[0].OrderNumber}</b>
                        </span>
                      </div>
                      <h4>Status: {order.orders[0].Status} </h4>
                    </div>
                  </div>
                  {order.orders.map((actualOrder) => {
                    return (
                      <>
                        <div className="purchase-container">
                          <Paper elevation={2} className="purchase-border">
                            <div className="purchase">
                              <div className="img-container">
                                <img src={beefpro} alt="Product-image" />
                              </div>
                              {/* ilalagay ko yung price ng product */}
                              <div className="product-details">
                                <h3>{actualOrder.ProdName}</h3>
                                <h4>Quantity: {actualOrder.Quantity} </h4>
                              </div>
                              <div className="price">
                                <p>
                                  ₱ {actualOrder.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </Paper>
                        </div>
                      </>
                    );
                  })}
                  <div className="total" style={{ marginTop: "1em" }}>
                    <p style={{ color: "black" }}>
                      Order Total:{" "}
                      <b> ₱ {transactionSumOfPrice(order.orders)}</b>
                    </p>
                  </div>
                </div>
              </>
            );
          })}
          <div className="total">
            <p>
              Order Total: <span> ₱ {sumOfPrice.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyPurchase;
