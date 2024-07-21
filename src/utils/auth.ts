import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const JWT_SECRET = process.env.JWT_SECRET || "moonsecret";

export const getUserFromToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};
