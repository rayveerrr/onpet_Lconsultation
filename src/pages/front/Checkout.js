import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import {
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import Footer from "../../components/frontend/Footer";
import Header from "../../components/frontend/Header";
import "../../styles/checkout.css";

import { Input } from "@mui/material";
import Button from "@mui/material/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import useAuthentication from "../../hooks/auth/authenticate-user";

function Checkout() {
  useAuthentication("User");

  const [prodName, setProdName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [order, setOrder] = useState([]);
  const [payment, setPayment] = useState("");
  const [paymentErr, setPaymentErr] = useState(false);
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const cartCollectionRef = collection(db, "MyCart");
  const orderCollectionRef = collection(db, "Orders");
  const prodCollectionRef = collection(db, "Product");

  const query = new URLSearchParams(window.location.search);

  const [selected, setSelected] = useState(query.get("selected").split(","));

  useEffect(() => {
    const getCart = async () => {
      const data = await getDocs(cartCollectionRef);
      setCart(
        data.docs
          .map((doc) => ({ ...doc.data(), isSelected: false, id: doc.id }))
          .filter((cartItem) => selected.includes(cartItem.id))
      );
      const userCollectionRef = collection(db, "users");
      const dataUsers = await getDocs(userCollectionRef);
      const validUser = dataUsers.docs
        ?.map((doc) => ({ ...doc.data(), id: doc.id }))
        .find((user) => user.Email === sessionStorage.getItem("email"));
      setUser(validUser);
    };
    const getProd = async () => {
      const data = await getDocs(prodCollectionRef)
      setProduct(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getProd();
    getCart();
  }, []);

  const sumOfPrice = useMemo(() => {
    let totalAmount = 0;
    cart.forEach(
      (cartItem) => (totalAmount += cartItem.Price * cartItem.Quantity)
    );
    return totalAmount;
  }, [cart]);

  const placeOrder = async () => {
    setPaymentErr(false);
    if(payment == ""){
      alert('Please select payment method to proceed to place order')
      return setPaymentErr(true);
    }
    const OrderNumber = Math.floor(Math.random() * 10000);
    const items = cart.map((cartItem) => ({
      OrderNumber: OrderNumber,
      Address: user.Address,
      Email: user.Email,
      Name: user.Name,
      Address: user.Address,
      PhoneNum: user.PhoneNum,
      Date: new Date().toLocaleString(),
      ProdName: cartItem.ProdName,
      ImageURL: cartItem.ImageURL,
      Payment: payment,
      Status: "On Request",
      ProdID: cartItem.ProdID,
      Quantity: cartItem.Quantity,
      totalAmount: cartItem.Price * cartItem.Quantity,
    }));

    for (const order of items) {
      setLoading(true);
      await addDoc(orderCollectionRef, order);
    }

    // Remove item from cart if proceeded to checkout
    for (const cartItem of cart) {
      const cartDoc = doc(db, "MyCart", cartItem.id);
      await deleteDoc(cartDoc);
    }

    // Update quantity
    // mali need to fix this <------
    for (const cartItemm of cart) {
      const prodDoc = doc(db, "Product", cartItemm.ProdID);
      console.log(cartItemm)
      const originalItem = product.find((item) => item.id === cartItemm.ProdID)
      const updateQuantity = { Quantity: Number(originalItem.Quantity) - Number(cartItemm.Quantity) };
      await updateDoc(prodDoc, updateQuantity)
    }

    alert("Your order has been on process. Check on your Orderlist");
    setLoading(false);
    window.location.href = "/mypurchase";
  };

  if (user) {
    return (
      <div style={{ minHeight: "calc(100vh) - 100px", marginTop: "100px" }}>
        <Header />
        <Paper sx={{ width: "70%", margin: "auto" }} elevation={2}>
          <div>
            <Typography variant="Title">
              Delivery Address: <LocationOnIcon />{" "}
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography variant="h6">Name: {user.Name}</Typography>
              <Typography variant="h6">
                Phone Number: {user.PhoneNum}
              </Typography>
            </div>
            <div>
            <Typography variant="h6">Address: {user.Address}</Typography>
            <Typography variant="h6">Date: {new Date().toLocaleString()}</Typography>
            </div>
          </div>
        </Paper>

        <Paper sx={{ width: "70%", margin: "auto" }} elevation={2}>
          {cart.map((cart) => {
            return (
              <>
                <Paper className="cart-list" elevation={2}>
                  <div className="box-1">
                    <div className="image-container">
                      <img src={cart.ImageURL} alt="image" />
                    </div>
                  </div>
                  <div className="box-2">
                    <div className="box">
                      <label id="price">Name: {cart.ProdName}</label>
                    </div>
                    <div className="box">
                      <label id="price">Price: ₱ {cart.Price}</label>
                    </div>

                    <div className="box">
                      <Typography
                        sx={{
                          backgroundColor: "white",
                          padding: "2px",
                          margin: "0 2px",
                        }}
                        placeholder="0"
                        disabled
                      >
                        {" "}
                        Quantity: {cart.Quantity}{" "}
                      </Typography>
                    </div>

                    <div className="box">
                      <label id="totalprice">
                        {" "}
                        Total Price: ₱{" "}
                        {(cart.Price * cart.Quantity).toLocaleString()}
                      </label>
                    </div>
                  </div>
                </Paper>
              </>
            );
          })}{" "}
          <Paper
            elevation={5}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              padding: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" htmlFor="uncontrolled-native">
                Select Payment method
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="category"
                onChange={(e) => {
                  setPayment(e.target.value);
                }}
                required
                value={sumOfPrice > 4000 ? 'gcash' : payment}
                disabled={sumOfPrice.toLocaleString() > 4000}
                sx={{ marginRight: 5 }}
              >
                <MenuItem  value={"cod"} selected>Cash on Delivery</MenuItem >
                <MenuItem  value={"gcash"}>G-Cash</MenuItem >
              </Select>
            </FormControl>
            <Typography variant="caption" sx={{ color: "gray" }}>
              {" "}
              Shipping fee is not included to total amount.{" "}
            </Typography>
            <Typography variant="h5" sx={{ marginRight: 2 }}>
              {" "}
              Total Amount: ₱ {sumOfPrice.toLocaleString()}{" "}
            </Typography>
            <Button
              variant="contained"
              sx={{ background: '#0D0D0D', marginRight: 2, fontSize: 20, width: "20%" }}
              onClick={() => {placeOrder(product.id, product.Quantity)}}
              disabled={loading}
            >
              Place Order
            </Button>
          </Paper>
        </Paper>
        <Footer />
      </div>
    );
  }
}

export default Checkout;
