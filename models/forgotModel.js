"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Forget = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    urlExpiration: {
        type: String,
        required: true
    },
    urlCreation: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model("forgoturl", Forget);
