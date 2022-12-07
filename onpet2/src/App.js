import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/front/Login";
import SignUp from "./pages/front/SignUp";
import HomePage from "./pages/front/Homepage";
import ProductList from "./pages/front/ProductList";
import SelectedProduct from "./pages/front/SelectedProduct";
import Cart from "./pages/front/Cart";
import MyAccount from "./pages/front/MyAccount";
import MyPurchase from "./pages/front/MyPurchase";
import MyPurchaseHistory from "./pages/front/MyPurchaseHistory";
import Layout from "./components/frontend/Sidebar";
import EditAdmin from "./pages/back/EditAdmin";
import Orders from "./pages/back/Orders";
import Supplies from "./pages/back/Supplies";
import PetHistory from "./pages/back/PetHistory";
import AddNewEmployee from "./pages/back/AddNewEmployee";
import Transaction from "./pages/back/Transaction";
import Navbar from "./components/Navbar";
import Feedback from "./pages/front/Feedback";
import FBComment from "./pages/back/FBComment";
import Checkout from "./pages/front/Checkout";
import NotFound from "./pages/front/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/productlist/:category" element={<ProductList />}/>
        <Route path="/product/:id" element={<SelectedProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/mypurchase" element={<MyPurchase />} />
        <Route path="/mypurchase/:id" element={<MyPurchaseHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/editAdmin" element={<EditAdmin />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/supplies" element={<Supplies />} />
        <Route path="/pethistory" element={<PetHistory />} />
        <Route path="/addnewemployee" element={<AddNewEmployee />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/fbcomment" element={<FBComment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
