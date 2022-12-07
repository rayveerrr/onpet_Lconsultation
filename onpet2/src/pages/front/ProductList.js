import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

//components
import Header from "../../components/frontend/Header";

// styles
import "../../styles/productlist.css";

// Icons
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

// MUI
import {
  Card,
  CardContent,
  CardHeader,
  ListItem,
  List,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Footer from "../../components/frontend/Footer";
import { WindowSharp } from "@mui/icons-material";

const ProductList = () => {
  const hoverProduct = {
    margin: "5px",
    padding: '1em',
    "&:hover": {
      boxShadow: 8,
    },
  };

  const productCollectionRef = collection(db, "Product");

  const [product, setProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const params = useParams();

  // Read all the product

  useEffect(() => {
    const getProduct = async () => {
      const data = await getDocs(productCollectionRef);
      setProduct(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter((prodCategory) => prodCategory.Category === category || prodCategory.Category == params.category))
      
    };
    getProduct();
  }, [category]);



  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Header />
      <div className="product-container">
        <Paper className="category-container" elevation={2}>
          <h3>Category:</h3>
          <div sx={{ display: "grid" }}>

            <Button onClick={() => setCategory('food')}>
              <Link to={'/productlist/' + 'food'}>
                <Divider />
                Pet Food
                <ArrowRightIcon />
              </Link>
            </Button>
            
            <Button onClick={() => setCategory('supplement')}>
              <Link to={'/productlist/' + 'supplement '}>
                <Divider />
                Pet Supplement
                <ArrowRightIcon />
              </Link>
            </Button>

            <Button onClick={() => setCategory('accessories')}>
              <Link to={'/productlist/' + 'accessories'}>
                <Divider />
                Pet Accessories
                <ArrowRightIcon />
              </Link>
            </Button>

            <Button onClick={() => setCategory('cage')}>
              <Link to={'/productlist/' + 'cage'}>
                <Divider />
                Pet Cage
                <ArrowRightIcon />
              </Link>
            </Button>

            <Button onClick={() => setCategory('feeders')}>
              <Link to={'/productlist/' + 'feeders'}>
                <Divider />
                Bowls and Feeders
                <ArrowRightIcon />
              </Link>
            </Button>

            <Button onClick={() => setCategory('treats')}>
              <Link to={'/productlist/' + 'treats'}>
                <Divider />
                Pet Treats
                <ArrowRightIcon />
              </Link>
            </Button>

          </div>
        </Paper>
        <div className="allproduct">
          <Paper className="productheader" elevation={2}>
            <Typography variant='h3'><b>Product List</b></Typography>
          </Paper>
          <div
            component="form"
            style={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: 'whitesmoke', border: '1px #404040 solid' , borderRadius: '5px', margin: '10px 0' }}
            >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search a product..."
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={(e) => {setSearch(e.target.value)}}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" >
                <SearchIcon />
            </IconButton>
          </div>
          <div className="product-list">
            {product.filter((prod) => {
              if(search == ''){
                return prod;
              }else if (prod.ProdName.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                return prod;
              }
            }).map((prod) => {
              
              return (
                <Card key={prod.id} className="product" sx={hoverProduct}>
                  <Link to={"/product/" + prod.id}>
                    <div className="img-container">
                      <img src={prod.ImageURL} alt="Product-image" />
                    </div>
                    <Typography variant="title">
                      <b>{prod.ProdName}</b>
                    </Typography>
                    <Typography variant="subtitle1">
                      ₱ {prod.Price.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle2">
                      In Stock, {prod.Quantity} Unit
                    </Typography>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductList;
