"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
let envSecret = process.env.JWT_SECRET;
const userMiddleware = (req, res, next) => {
    const token = req.headers['jwt-token'];
    if (token && envSecret) {
        try {
            let verify = jsonwebtoken_1.default.verify(token, envSecret);
            let decoder = jsonwebtoken_1.default.decode(token);
            if (req.path !== "/signin" && req.path !== "/signup" && req.path !== "/forgotpassword" && req.path !== "/forgotpassword/:reseturl") {
                userModel_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(decoder.id) })
                    .then((response) => {
                    // console.log(response);
                    if (response === null || response === void 0 ? void 0 : response.password) {
                        response.password = "";
                    }
                    req.user = response;
                    next();
                });
            }
            else {
                return res.status(401).json({ message: "Hey Buddy, you're already logged in", auth: true });
            }
        }
        catch (error) {
            if (req.path === "/signin" || req.path === "/signup" || req.path === "/forgotpassword" || req.path.startsWith("/forgotpassword")) {
                return next();
            }
            return res.status(403).json({ auth: false, message: "Authorization token is invalid or expired" });
        }
    }
    else {
        if (req.path === "/signin" || req.path === "/signup" || req.path === "/forgotpassword" || req.path.startsWith("/forgotpassword")) {
            next();
        }
        else {
            res.json({ auth: false, user: null });
        }
    }
};
exports.default = userMiddleware;
