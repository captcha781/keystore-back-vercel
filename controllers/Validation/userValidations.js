"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChangeSchema = exports.userUpdateSchema = exports.userSignInSchema = exports.userSignupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSignupSchema = joi_1.default
    .object({
    username: joi_1.default.string().alphanum().required().lowercase(),
    fname: joi_1.default.string().alphanum().required(),
    lname: joi_1.default.string().alphanum().required(),
    email: joi_1.default
        .string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
    password: joi_1.default
        .string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"))
        .required(),
    conpassword: joi_1.default
        .string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"))
        .required(),
    phonenumber: joi_1.default
        .string()
        .min(10)
        .max(13)
        .required()
});
exports.userSignInSchema = joi_1.default.object({
    email: joi_1.default
        .string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
    password: joi_1.default
        .string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"))
        .required(),
});
exports.userUpdateSchema = joi_1.default
    .object({
    username: joi_1.default.string().alphanum().required().lowercase(),
    fname: joi_1.default.string().alphanum().required(),
    lname: joi_1.default.string().alphanum().required(),
    email: joi_1.default
        .string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
    phonenumber: joi_1.default
        .string()
        .min(10)
        .max(13)
        .required()
});
exports.passwordChangeSchema = joi_1.default
    .object({
    oldPassword: joi_1.default
        .string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"))
        .required(),
    newPassword: joi_1.default
        .string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"))
        .required(),
    confNewPassword: joi_1.default
        .string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"))
        .required()
});
