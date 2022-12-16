import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const orderCollection = collection(db, "Orders");

const email = sessionStorage.getItem("email");

const parseDocs = (data) => {
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

const parseDoc = async (data) => {};

export const updateStatusByID = (id, data) => {
  return setDoc(doc(db, "Orders", id), data);
};

export const getOrderByID = async (id) => {
  const data = await getDoc(doc(db, "Orders", id));
  return data.exists() ? data.data() : null;
};

export const getOrdersByEmail = async (Email) => {
  const myOrders = await getAllOrders();
  return myOrders.filter((order) => order.Email === Email);
};

export const getAllOrders = async () => {
  const data = await getDocs(orderCollection);
  return parseDocs(data);
};

export const getOrdersByOrderNumber = async (OrderNumber, Status?: string) => {
  const orders = await getAllOrders();
  return orders.filter((order) => order.OrderNumber === OrderNumber);
};
