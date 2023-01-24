"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = require("./userModel");
const paymentSchema = new mongoose_1.default.Schema({
    cardname: {
        type: String,
        required: true
    },
    cardnumber: {
        type: String,
        required: true
    },
    cardexp: {
        type: String,
        required: true
    },
    cardccv: {
        type: String,
        required: true
    }
});
const orderSchema = new mongoose_1.default.Schema({
    payableAmount: {
        type: String,
        required: true
    },
    products: {
        type: [userModel_1.cartSchema],
        required: true
    },
    address: {
        type: userModel_1.addressSchema,
        required: true
    },
    paymentdetails: {
        type: paymentSchema,
        required: true
    },
    deliverIn: {
        type: String,
        required: true
    },
    user: {
        type: userModel_1.UserModel,
        required: true
    }
});
exports.default = mongoose_1.default.model("order", orderSchema);
