import {validateEmail, validateUserName} from "../../../utils/validator.js";
import {PrismaClient} from "@prisma/client";
import {createResponse, generateToken, hashSha1} from "../../../utils/utils.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    const {firstName, lastName, email, marketingConsent} = req.body;

    if (!validateUserName(firstName) || !validateUserName(lastName) || !validateEmail(email)) {
        return createResponse(res, false, "Invalid input", null, 400);
    }

    const prisma = new PrismaClient();
    const exist = await prisma.users.findUnique({where: {email: email}});
    if (exist) {
        prisma.$disconnect();
        return createResponse(res, false, "User already exists", null, 422);
    }

    const user = await prisma.users.create({
        data: {
            id: hashSha1(email),
            firstName: firstName,
            lastName: lastName,
            email: email,
            marketingConsent: marketingConsent
        }
    });
    prisma.$disconnect();
    return res.status(201).json({id: user.id, accessToken: generateToken(user)});
}

export const getUser = async (req, res) => {
    const {hash} = req.params;
    const token = req.get("Authorization");

    if (!token) return createResponse(res, false, "Authorization header missing", null, 401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const prisma = new PrismaClient();
        const user = await prisma.users.findUnique({where: {id: hash, email: decoded.email}});
        prisma.$disconnect();
        if (!user) return createResponse(res, false, "User not found", null, 404);
        if (!user.marketingConsent) delete user.email;

        return res.status(200).json(user);
    } catch (e) {
        return createResponse(res, false, "Invalid token", null, 401);
    }
}