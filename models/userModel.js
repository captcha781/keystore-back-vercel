"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.cartSchema = exports.productSchema = exports.addressSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//     buildingNo: string,
//     street: string,
//     locality: string,
//     city: string,
//     state: string
//     country: string
exports.addressSchema = new mongoose_1.default.Schema({
    buildingNo: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
});
exports.productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});
exports.cartSchema = new mongoose_1.default.Schema({
    product: exports.productSchema,
    quantity: {
        type: Number,
        required: true
    }
});
exports.UserModel = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: [exports.cartSchema],
        default: []
    },
    addressList: {
        type: [exports.addressSchema],
        default: []
    },
    phonenumber: {
        type: Number,
        required: true
    }
});
exports.default = mongoose_1.default.model("user", exports.UserModel);
