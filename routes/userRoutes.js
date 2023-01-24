"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controllers/userController"));
const userAuthCheck_1 = __importDefault(require("../middlewares/userAuthCheck"));
const router = express_1.default.Router();
router.post("/signup", userAuthCheck_1.default, userController.signUp);
router.post("/signin", userAuthCheck_1.default, userController.signin);
router.get("/status", userAuthCheck_1.default, userController.status);
router.post("/cartreplace", userAuthCheck_1.default, userController.cartChanger);
router.post("/cartdelete", userAuthCheck_1.default, userController.cartdeleter);
router.post("/checkouts", userAuthCheck_1.default, userController.orderhandler);
router.get("/orders", userAuthCheck_1.default, userController.fetchOrders);
router.post("/updateuser", userAuthCheck_1.default, userController.updateUser);
router.post("/changepassword", userAuthCheck_1.default, userController.changePassword);
router.post("/forgotpassword", userAuthCheck_1.default, userController.forgotUrlGen);
router.get("/forgotpassword/:forgotURL", userAuthCheck_1.default, userController.checkResetUrl);
router.post("/forgotpassword/:forgotURL", userAuthCheck_1.default, userController.forgotRrlReset);
exports.default = router;
