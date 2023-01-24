"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const app = (0, express_1.default)();
app.set('trust proxy', true);
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://ecom-captcha781.netlify.app", "https://keystore.ml", "http://keystore.ml", "http://ecom-captcha781.netlify.app", "https://www.keystore.ml"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, connect_timeout_1.default)("60000"));
app.use("/user", userRoutes_1.default);
app.use("/product", productRoutes_1.default);
app.get("/check/internal", (req, res) => {
    res.json({ header: req.headers });
});
mongoose_1.default.connect(process.env.MONGO_URI, () => {
    app.listen(process.env.PORT || "5000", () => {
        console.log("Server runs on port " + process.env.PORT + "...");
    });
});
