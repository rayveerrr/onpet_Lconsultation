import { idID } from "@mui/material/locale";
import {
  getAllOrders,
  getOrderByID,
  getOrdersByEmail,
  updateStatusByID,
  getOrdersByOrderNumber,
} from "../repositories/orders.repository";

export const placeOrder = () => {};

export const orderUpdateStatusService = async (OrderNumber, newStatus) => {
  const myOrdersToBeUpdate = await getOrdersByOrderNumber(OrderNumber);
  if (myOrdersToBeUpdate.length == 0) {
    return alert("Error: order maybe deleted, please try again.");
  }
  for (const orderToBeUpdate of myOrdersToBeUpdate) {
    await updateStatusByID(orderToBeUpdate.id, {
      ...orderToBeUpdate,
      Status: newStatus,
    });
  }
};

export const getMyOrdersService = async () => {
  const getEmail = sessionStorage.getItem("email");
  return getOrdersByEmail(getEmail);
};

export const getAllOrdersService = async () => {
  return getAllOrders();
};
