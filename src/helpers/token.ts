import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET

if (!SECRET) {
  throw new Error("No JWT secret provided");
}

if (!REFRESH_TOKEN) {
  throw new Error("No JWT refresh secret provided");
}

export const generateToken = async (payload: JwtPayload) => {
  return await jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

export const verifyToken = async (token: any) => {
    try {
        const decoded = await jwt.verify(token, SECRET);
        return decoded;
    } catch (error) {
        console.log("Error, TOKEN NOT VERIFIED.\n",error);
    }
}

export const refreshToken = async (payload: JwtPayload) => {
    try {
        const refreshToken = await jwt.sign(payload, SECRET, { expiresIn: "7d" });
        return refreshToken;
    } catch (error) {
        console.log("Error, TOKEN NOT REFRESHED.\n",error);
    }
}