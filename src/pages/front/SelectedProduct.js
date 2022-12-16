import React from "react";
import { useState, useEffect } from "react";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Link, useParams } from "react-router-dom";

//components
import Header from "../../components/frontend/Header";

// image
import gcash from "../../image/gcash.png";
import cod from "../../image/cash-on-delivery.png";
import beefpro from "../../image/beefpro.jpg";

// styles
import "../../styles/selectedproduct.css";

// icons
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Stack from "@mui/material/Stack";
import { Divider, Input, styled } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { withTheme } from "styled-components";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "../../components/frontend/Footer";

const SelectedProduct = () => {
  const hoverStyle = {
    backgroundColor: "white",
    color: "black",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      border: "1px white solid",
    },
  };

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [quantityCount, setQuantityCount] = useState(1);

  const increment = () => {
    setQuantityCount(quantityCount + 1);
  };
  const decrement = () => {
    setQuantityCount(quantityCount - 1);
  };

  const [product, setProduct] = useState(null);

  const productCollectionRef = collection(db, "Product");

  const params = useParams();

  useEffect(() => {
    const getProduct = async () => {
      const data = await getDocs(productCollectionRef);
      const prod = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .find((product) => product.id === params.id);
      setProduct(prod);
      console.log(prod);
      console.log(product);
    };
    getProduct();
  }, []);

  const cartCollectionRef = collection(db, "MyCart");

  const submitAddToCart = async () => {
    if (!sessionStorage.getItem("email")) {
      alert("Please login first");
      return (window.location.href = "/signup");
    }

    const data = await getDocs(cartCollectionRef);
    const cartItems = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    if (
      cartItems.find(
        (cartItems) =>
          cartItems.ProdID === params.id &&
          cartItems.Email === sessionStorage.getItem("email")
      )
    ) {
      return alert("Item already existing in cart.");
    }
    try {
      await addDoc(cartCollectionRef, {
        ProdID: params.id,
        Email: sessionStorage.getItem("email"),
        ImageURL: product.ImageURL,
        Price: product.Price,
        ProdName: product.ProdName,
        Quantity: quantityCount,
      });
      alert("Item added to cart successfully.");
    } catch (e) {
      console.log(e);
    }
  };

  if (product) {
    return (
      <div className="main">
        <Header />
        <div className="product-container">
          <div className="product-image">
            <div className="product-image-container">
              <img src={product.ImageURL} alt="product" />
            </div>
            <div className="product-description">
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                sx={{ marginTop: "20px" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Description
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{product.Description}</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
          <div className="availability-container">
            <h1>{product.ProdName}</h1>
            <p>
              Price:
              {Number(product.Price).toLocaleString()}
            </p>
            <p>
              <Typography variant="caption" sx={{ color: "gray" }}>
                Maximum quantity is 10*{" "}
              </Typography>
              <Stack direction="row" alignItems="center">
                {" "}
                Quantity:
                <IconButton
                  aria-label="minus"
                  onClick={decrement}
                  disabled={quantityCount == 1}
                >
                  <RemoveIcon fontSize="small" sx={hoverStyle} />
                </IconButton>
                <Input
                  sx={{ backgroundColor: "white" }}
                  placeholder="0"
                  value={quantityCount}
                ></Input>
                <IconButton
                  aria-label="add"
                  onClick={increment}
                  disabled={quantityCount == 10}
                >
                  <AddIcon fontSize="small" sx={hoverStyle} />
                </IconButton>
                <IconButton variant="contained" endIcon={<AddIcon />} />
              </Stack>
            </p>
            <div className="button">
              <Button
                variant="contained"
                type="submit"
                endIcon={<ShoppingCartIcon />}
                sx={{ backgroundColor: "white", color: "black" }}
                onClick={submitAddToCart}
              >
                Add to cart
              </Button>
            </div>
            {/* Ididisplay ko din dito yung available stock */}
            <div className="payment-method">
              <h3>Payment method</h3>
              <div className="payment-container">
                <div className="payment">
                  <img src={cod} alt="CashonDelivery" />
                </div>
                <div className="payment">
                  <img src={gcash} alt="G-cash" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

export default SelectedProduct;
