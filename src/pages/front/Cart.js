import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";

// image
import beefpro from "../../image/beefpro.jpg";

// Styles
import "../../styles/cart.css";
import Footer from "../../components/frontend/Footer";

// component
import Header from "../../components/frontend/Header";
import { Paper, Input, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Stack from "@mui/material/Stack";
import useAuthentication from "../../hooks/auth/authenticate-user";

const Cart = () => {
  useAuthentication("User");

  const buttonStyle = {
    color: "black",
    "&:hover": {
      backgroundColor: "white",
      color: "white",
    },
  };

  const [quantityCount, setQuantityCount] = useState(0);

  const [prodName, setProdName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cart, setCart] = useState([]);
  const [emptyCart, setEmptyCart] = useState(false);

  const cartCollectionRef = collection(db, "MyCart");

  // Read all the product
  const getCart = async () => {
    // per cart item product should be existing else dont fetch
    const data = await getDocs(cartCollectionRef);
    setCart(
      data.docs
        .map((doc) => ({ ...doc.data(), isSelected: false, id: doc.id }))
        .filter(
          (cartItem) => cartItem.Email === sessionStorage.getItem("email")
        )
    );
  };

  const disableCheckout = () => {
    if(getCart.length == 0){
      return setEmptyCart(true);
    }
    return setEmptyCart(false);
  }

  useEffect(() => {
    
    
    getCart();
  }, []);

  const increment = useCallback(
    (id) => {
      setCart((cartItems) => {
        for (let cartItem of cartItems) {
          if (cartItem.id === id) {
            cartItem.Quantity += 1;
            console.log(cartItem.Quantity);
          }
        }
        return [...cartItems];
      });
    },
    [cart]
  );

  const decrement = useCallback(
    (id) => {
      setCart((cartItems) => {
        for (let cartItem of cartItems) {
          if (cartItem.id === id && cartItem.Quantity > 1) {
            cartItem.Quantity -= 1;
            console.log(cartItem.Quantity);
          }
        }
        return [...cartItems];
      });
    },
    [cart]
  );

  const removeFromCart = async (id) => {
    const cartDoc = doc(db, "MyCart", id);
    await deleteDoc(cartDoc);
    alert("Item remove from cart");
  };

  const sumOfPrice = useMemo(() => {
    let totalAmount = 0;
    const selectedItem = cart.filter((cartItem) => cartItem.isSelected);
    if (selectedItem.length > 0) {
      selectedItem.forEach(
        (cartItem) => (totalAmount += cartItem.Price * cartItem.Quantity)
      );
    } else {
      cart.forEach(
        (cartItem) => (totalAmount += cartItem.Price * cartItem.Quantity)
      );
    }

    return totalAmount;
  }, [cart]);

  const checkout = async () => {
    setEmptyCart(false);
    if(cart.length == 0){
      alert('Your cart is empty. Please place a product to your cart before proceeding to checkout')
      return setEmptyCart(true);
    }
    for (const cartItem of cart) {
      await setDoc(doc(db, "MyCart", cartItem.id), {
        ...cartItem,
        Quantity: cartItem.Quantity,
      });
    }
    const selectedItem = cart.filter((cartItem) => cartItem.isSelected);
    if (selectedItem.length > 0) {
      return (window.location.href =
        "/checkout?selected=" + selectedItem.map((cartItem) => cartItem.id));
    }
    window.location.href =
      "/checkout?selected=" + cart.map((cartItem) => cartItem.id);
  };

  const changeCheckbox = useCallback(
    (id) => {
      setCart((cartItems) => {
        for (let cartItem of cartItems) {
          if (cartItem.id === id) {
            cartItem.isSelected = !cartItem.isSelected;
          }
        }
        return [...cartItems];
      });
    },
    [cart]
  );

  return (
    <>
      <Header />
      <div className="cart-container">
        <Paper className="cart-header">
          <div className="select-all"></div>
          <div className="details">
            <div className="box">
              <h4>Name</h4>
            </div>
            <div className="box">
              <h4>Unit Price</h4>
            </div>
            <div className="box">
              <h4>Quantity</h4>
            </div>
            <div className="box">
              <h4>Total Price</h4>
            </div>
            <div className="box">
              <h4>Action</h4>
            </div>
          </div>
        </Paper>
        {cart.map((cart) => {
          return (
            <>
              <Paper className="cart-list" elevation={2}>
                <div className="box-1">
                  <input
                    type="checkbox"
                    name="checkbox"
                    id="checkbox"
                    checked={cart.isSelected}
                    onChange={() => changeCheckbox(cart.id)}
                  />
                  <div className="image-container">
                    <img src={cart.ImageURL} alt="image" />
                  </div>
                </div>
                <div className="box-2">
                  <div className="box">
                    <label id="name">{cart.ProdName}</label>
                  </div>
                  <div className="box">
                    <label id="price"> ₱ {cart.Price}</label>
                  </div>
                  {/* aayusin yung pag increase ng quantity */}
                  <div className="box">
                    <Typography variant="caption">
                      Maximum quantity is 10*{" "}
                    </Typography>
                    <div>
                      <IconButton
                        aria-label="minus"
                        onClick={() => decrement(cart.id)}
                        disabled={cart.Quantity == 1}
                        className="quantitybtn"
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Input
                        sx={{
                          backgroundColor: "white",
                          padding: "2px",
                          margin: "0 2px",
                        }}
                        placeholder="0"
                        value={cart.Quantity}
                      />
                      <IconButton
                        aria-label="add"
                        onClick={() => increment(cart.id)}
                        disabled={cart.Quantity == 10}
                        className="quantitybtn"
                      >
                        <AddIcon endIcon={<AddIcon />} />
                      </IconButton>
                    </div>
                  </div>
                  <div className="box">
                    <label id="totalprice">
                      {" "}
                      ₱ {(cart.Price * cart.Quantity).toLocaleString()}
                    </label>
                  </div>
                  <div className="box">
                    <Button
                      onClick={() => {
                        removeFromCart(cart.id);
                        getCart();
                      }}
                    >
                      Remove
                    </Button>
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
          <Typography variant="h5" sx={{ marginRight: 2 }}>
            {" "}
            Total Price: ₱ {sumOfPrice.toLocaleString()}{" "}
          </Typography>
          <Button
            variant="contained"
            sx={{ marginRight: 2, fontSize: 20, width: "20%" }}
            onClick={checkout}
            error={emptyCart}
          >
            CheckOut
          </Button>
        </Paper>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
