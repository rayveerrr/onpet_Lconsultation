import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";

const userCollection = collection(db, "users");

const parseDocs = (data) => {
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

const parseDoc = (data) => {
  return {
    ...data.data(),
    id: data.id,
  };
};

export const updateUserInfoByID = (id, data) => {
  console.log(data);
  return setDoc(doc(db, "users", id), data);
};

export const getAllUsers = async () => {
  const data = await getDocs(userCollection);
  return parseDocs(data);
};

export const getUserByEmail = async (email: string) => {
  const users = await getAllUsers();
  return users.find((user) => user.Email === email);
};
