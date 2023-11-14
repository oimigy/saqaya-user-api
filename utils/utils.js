import crypto from "crypto";
import jwt from "jsonwebtoken";

export const createResponse = (res,  success, message, data, status = 200) => {
    const payload = {success: success};
    if (message) payload.message = message;
    if (data) payload.data = data;
    return res.status(status).json(payload, status, success);
}

export const hashSha1 = (data) => {
    const sha1 = crypto.createHmac("sha1", process.env.SHA1_SALT);
    sha1.update(data);
    return sha1.digest("hex");
}

export const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
}