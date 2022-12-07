import {
  getUserByEmail,
  updateUserInfoByID,
} from "../repositories/user.repository";

export const updateUserInfoService = async (id, data) => {
  await updateUserInfoByID(id, data);
  alert("Information updated.");
};

export const getUserByIdService = async (email: string) => {
  return getUserByEmail(email);
};
