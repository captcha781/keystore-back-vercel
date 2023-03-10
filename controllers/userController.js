"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotRrlReset = exports.checkResetUrl = exports.forgotUrlGen = exports.changePassword = exports.updateUser = exports.fetchOrders = exports.orderhandler = exports.cartdeleter = exports.cartChanger = exports.status = exports.signin = exports.signUp = void 0;
const userValidations_1 = require("./Validation/userValidations");
const userModel_1 = __importDefault(require("../models/userModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const forgotModel_1 = __importDefault(require("../models/forgotModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const sendMail = (mailObject) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, subject } = mailObject;
    const tranpsort = nodemailer_1.default.createTransport({
        service: "sendinblue",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        }
    }).sendMail(mailObject)
        .then(mailResponse => {
        // console.log(mailResponse);
    })
        .catch(err => {
        console.log(err);
    });
});
const signUp = (req, res) => {
    const { username, fname, lname, email, password, conpassword, phonenumber } = req.body;
    userValidations_1.userSignupSchema.validateAsync(req.body)
        .then(() => {
        return userModel_1.default.find({ $or: [{ email: email }, { username: username }] });
    })
        .then((findResponse) => {
        if (password !== conpassword) {
            return res.json({ auth: false, message: "Password and Confirm password didn't match" });
        }
        if (findResponse.length > 0) {
            return res.json({ auth: false, message: "User already exists" });
        }
        bcryptjs_1.default.hash(password, 15)
            .then((hashresult) => {
            let id = new mongoose_1.default.Types.ObjectId();
            return userModel_1.default.create({ _id: id, username, fname, lname, email, password: hashresult, phonenumber })
                .then((createResponse) => {
                let token;
                if (process.env.JWT_SECRET) {
                    token = jsonwebtoken_1.default.sign({ id: createResponse._id }, process.env.JWT_SECRET, {
                        expiresIn: 3600,
                    });
                }
                if (createResponse.password) {
                    createResponse.password = "";
                }
                sendMail({ from: process.env.NODEMAILER_USER, to: createResponse.email, subject: "Account Created Successfully!", text: `Mr./Ms. ${createResponse.fname} ${createResponse.lname} , your account is created sucessfully in KeyStone on ${moment_1.default.utc().format('MMMM Do YYYY, h:mm:ss A')} UTC.` });
                return res.json({
                    auth: true,
                    message: "Resgistration Successful",
                    user: createResponse,
                    token,
                });
            });
        })
            .catch((err) => res.json({ auth: false, message: err.message }));
    })
        .catch(err => {
        res.json({ message: "error" });
    });
};
exports.signUp = signUp;
const signin = (req, res) => {
    const { email, password } = req.body;
    userValidations_1.userSignInSchema.validateAsync({ email, password })
        .then((result) => {
        return userModel_1.default.findOne({ email });
    })
        .then((findResponse) => {
        if (!findResponse) {
            res.status(404).json({ auth: false, message: "No user found with this email" });
            return;
        }
        req.user = findResponse;
        bcryptjs_1.default.compare(password, req.user.password)
            .then(matchRes => {
            if (!matchRes) {
                return res.status(406).json({ auth: false, message: "Passwords doesn't match" });
            }
            let token = jsonwebtoken_1.default.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
            req.user.password = "";
            // sendMail({ from: process.env.NODEMAILER_USER as string, to: req.user.email, subject: "Login Alert", text: `Hello ${findResponse.fname}, Your account is logged into KeyStone on ${moment.utc().format('MMMM Do YYYY, h:mm:ss A')} UTC` })
            res.status(201).json({ auth: true, user: req.user, token, message: "Login Successful" });
        })
            .catch((err) => res.json(500).json({ message: err.message }));
    })
        .catch((err) => res.status(500).json({ message: err.message }));
};
exports.signin = signin;
const status = (req, res) => {
    if (!req.user) {
        return res.status(403).json({
            user: null,
            message: "You're not logged in , so get out...",
            auth: false
        });
    }
    return res.status(200).json({
        auth: true,
        user: req.user,
        message: "You're logged in don't worry!!!",
    });
};
exports.status = status;
const cartMerger = (stayscart, userscart, decline) => {
    let newarr = [];
    if (!stayscart) {
        return userscart;
    }
    let staycart = [...stayscart];
    let usercart = [...userscart];
    if (usercart.length > 0) {
        for (let i = 0; i < usercart.length; i++) {
            let filter = staycart.filter((value, index) => {
                return String(value.product._id) === String(usercart[i].product._id);
            });
            if (filter.length > 0) {
                let findex = staycart.findIndex(value => String(value.product._id) === String(usercart[i].product._id));
                if (staycart.length === 0) {
                    break;
                }
                let newItem = { product: usercart[i].product, quantity: (decline ? staycart[findex].quantity : staycart[findex].quantity + usercart[i].quantity) };
                staycart = staycart.filter(value => String(value.product._id) !== String(staycart[findex].product._id));
                newarr.push(newItem);
            }
            else {
                newarr.push(usercart[i]);
            }
        }
        newarr = [...newarr, ...staycart];
    }
    else {
        newarr = [...staycart];
    }
    return newarr;
};
const cartChanger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let staycart = req.body.cart;
    let usercart = req.user.cart;
    let decline = req.body.decline;
    let newcart = cartMerger(staycart, usercart, decline);
    setTimeout(() => {
        userModel_1.default.findByIdAndUpdate(req.user._id, { cart: newcart })
            .then(updateCartResponse => {
            userModel_1.default.findById(req.user._id).then(response => {
                res.json({ cart: response === null || response === void 0 ? void 0 : response.cart });
            });
        })
            .catch(err => {
            console.log(err);
            res.json({ message: "Cannot update cart", error: err });
        });
    }, 20);
});
exports.cartChanger = cartChanger;
const cartdeleter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body.product;
    const cart = req.user.cart;
    let newcart = cart.filter((item) => String(item.product._id) !== String(product._id));
    setTimeout(() => {
        userModel_1.default.findByIdAndUpdate(req.user._id, { cart: newcart })
            .then(updateCartResponse => {
            userModel_1.default.findById(req.user._id)
                .then(userResponse => res.json({ cart: userResponse === null || userResponse === void 0 ? void 0 : userResponse.cart }))
                .catch(err => res.json({ message: "User Error", error: err }));
        })
            .catch(err => {
            console.log(err);
            res.json({ message: "Cannot update cart", error: err });
        });
    }, 20);
});
exports.cartdeleter = cartdeleter;
const orderhandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { checkout, cart, payable } = req.body;
    const user = req.user;
    if (cart.length <= 0) {
        return res.status(406).json({ message: "Cart should not be empty" });
    }
    userModel_1.default.findById(req.user._id)
        .then(userResponse => {
        const obj = {
            payableAmount: payable,
            products: cart,
            address: {
                buildingNo: checkout.buildingNo,
                street: checkout.street,
                loaclity: "",
                city: checkout.city,
                state: checkout.state,
                country: checkout.country,
                pincode: checkout.pincode
            },
            paymentdetails: {
                cardname: checkout.cardname,
                cardnumber: checkout.cardnumber,
                cardexp: checkout.cardexp,
                cardccv: checkout.cardccv
            },
            user: userResponse,
            deliverIn: (0, moment_1.default)(Date.now() + 60 * 60 * 24 * 5).format('MMMM Do YYYY')
        };
        orderModel_1.default.create(obj)
            .then(createRes => {
            userModel_1.default.findByIdAndUpdate(req.user._id, { cart: [] })
                .then(response => {
                // console.log(response);
                // sendMail({ from: process.env.NODEMAILER_USER as string, to: req.user.email, subject: "Account Created Successfully!", text: `Mr./Ms. ${req.user.fname} ${req.user.lname} , Your order with reference id ${createRes._id} has been placed. The total payable amount is $ ${payable}/- only. Your order is paid with credit card ending with xxxxxxxx${checkout.cardnumber.slice(13)}....` })
                return res.json({ message: "Order successfully placed." });
            })
                .catch(err => {
                return res.status(406).json({ message: "Something went wrong...." });
            });
        })
            .catch(err => {
            return res.status(406).json({ message: err.message, error: err });
        });
    })
        .catch(err => {
        res.status(406).json({ message: err.message, error: err });
    });
});
exports.orderhandler = orderhandler;
const fetchOrders = (req, res) => {
    orderModel_1.default.find({ "user.username": req.user.username }, { paymentdetails: 0 })
        .then(orderResponse => {
        res.json({ orders: orderResponse });
    })
        .catch(err => {
        return res.json({ message: "Something went wrong" });
    });
};
exports.fetchOrders = fetchOrders;
const updateUser = (req, res) => {
    if (req.body.password) {
        return res.status(403).json({ message: "Cannot update password from here." });
    }
    const { email, fname, lname, phonenumber, username } = req.body;
    userValidations_1.userUpdateSchema.validateAsync({ email, fname, lname, phonenumber, username })
        .then(() => {
        userModel_1.default.find({ email: req.user.email === req.body.email ? "email@email.com" : req.body.email, username: req.user.username === req.body.username ? "sam12" : req.body.usernme })
            .then(response => {
            console.log(response);
            if (response.length > 0) {
                return res.status(403).json({ message: "Username / email already exists" });
            }
            userModel_1.default.updateOne({ _id: req.user._id }, { email: email, fname, lname, phonenumber, username })
                .then(updateresponse => {
                console.log(updateresponse);
                return res.json({ message: "Updated the profile successfully" });
            })
                .catch(err => {
                return res.status(406).json({ message: err.message, error: err });
            });
        })
            .catch(err => {
            return res.status(406).json({ message: err.message, error: err });
        });
    })
        .catch(err => {
        return res.status(406).json({ message: err.message, error: err });
    });
};
exports.updateUser = updateUser;
const changePassword = (req, res) => {
    const { oldPassword, newPassword, confNewPassword } = req.body;
    if (newPassword !== confNewPassword) {
        return res.status(406).json({ message: "Passwords didn't match" });
    }
    userModel_1.default.findById(req.user._id)
        .then(userFindResponse => {
        bcryptjs_1.default.compare(newPassword, userFindResponse === null || userFindResponse === void 0 ? void 0 : userFindResponse.password)
            .then(prevpassuseCheck => {
            if (prevpassuseCheck) {
                return res.json({ message: "Your old password cannot be your new password" });
            }
            bcryptjs_1.default.compare(oldPassword, userFindResponse === null || userFindResponse === void 0 ? void 0 : userFindResponse.password)
                .then(passCompare => {
                if (!passCompare) {
                    return res.status(406).json({ message: "Your previous password is incorrect !!!" });
                }
                bcryptjs_1.default.hash(newPassword, 15)
                    .then(hashedPass => {
                    userModel_1.default.updateOne({ _id: req.user._id }, { password: hashedPass })
                        .then(response => {
                        return res.json({ message: "Your Password is updated successfully..." });
                    })
                        .catch(err => {
                        return res.status(406).json({ message: "Something happened." });
                    });
                })
                    .catch(err => {
                    return res.status(406).json({ message: "Something happened.." });
                });
            })
                .catch(err => {
                return res.status(406).json({ message: "Something happened..." });
            });
        })
            .catch(err => {
            return res.status(406).json({ message: "Something happened...." });
        });
    })
        .catch(err => {
        return res.status(406).json({ message: "Something happened....." });
    });
};
exports.changePassword = changePassword;
function makeUrl(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const forgotUrlGen = (req, res) => {
    const { email } = req.body;
    userModel_1.default.findOne({ email: email })
        .then(userResponse => {
        if (!userResponse) {
            return res.status(404).json({ message: "No user found with this email..." });
        }
        const url = makeUrl(13);
        const creationTime = Date.now();
        const expiration = creationTime + (15 * 60 * 1000);
        forgotModel_1.default.create({ email: email, url: url, urlCreation: creationTime, urlExpiration: expiration })
            .then(creationResponse => {
            const mailObj = {
                from: process.env.NODEMAILER_USER,
                to: creationResponse.email,
                subject: "Password Reset Link",
                text: `
            Your password reset link is \n
              https://ecom-captcha781.netlify.app/forgotpassword/${creationResponse.url}
            `,
            };
            sendMail(mailObj).then((mailres) => {
                // console.log(mailres);
                res.json({
                    message: "Your Password Reset Link is sent to your registered email",
                    redirection: null,
                });
                return;
            });
            // res.json({ url: creationResponse.url, redirection: null })
            // return
        })
            .catch(err => {
            return res.status(406).json({ message: err.message, redirection: null });
        });
    })
        .catch(err => {
        return res.status(406).json({ message: "Something went wrong." });
    });
};
exports.forgotUrlGen = forgotUrlGen;
const checkResetUrl = (req, res) => {
    const url = req.params.forgotURL;
    forgotModel_1.default.findOne({ url: url })
        .then((response_geturl) => {
        if (!response_geturl) {
            return res.status(406).json({ message: "Your Password reset link is not valid...", valid: false });
        }
        const time = Date.now();
        if (time > Number(response_geturl.urlExpiration)) {
            forgotModel_1.default.deleteOne({ url: url })
                .then(delete_response_if_condition => {
                res.status(406).json({ message: "Your Password link is expired...", valid: false });
                return;
            })
                .catch(err => {
                res.status(406).json({ message: "Some Error Occurred... Please try after sometime", valid: false });
                return;
            });
        }
        else {
            return res.json({ valid: true });
        }
    });
};
exports.checkResetUrl = checkResetUrl;
const forgotRrlReset = (req, res) => {
    const url = req.params.forgotURL;
    forgotModel_1.default.findOne({ url: url })
        .then((response_geturl) => {
        const time = Date.now();
        if (time > Number(response_geturl.urlExpiration)) {
            forgotModel_1.default.deleteOne({ url: url })
                .then(delete_response_if_condition => {
                res.status(406).json({ message: "Your Password link is expired...", redirection: null });
                return;
            })
                .catch(err => {
                res.status(406).json({ message: "Some Error Occurred... Please try after sometime", redirection: null });
                return;
            });
        }
        const password = req.body.password.trim();
        const confPassword = req.body.confPassword.trim();
        if (password === confPassword) {
            bcryptjs_1.default.hash(password, 15)
                .then(updated_password => {
                userModel_1.default.updateOne({ email: response_geturl.email }, { password: updated_password })
                    .then(update_response => {
                    forgotModel_1.default.findByIdAndDelete(response_geturl._id)
                        .then(() => {
                        const date_now = new Date();
                        const mailObj = {
                            from: process.env.NODEMAILER_USER,
                            to: response_geturl.email,
                            subject: "Your Password has been successfully updated!!!",
                            text: `
                                                Your Password has been successfully updated on ${date_now.getHours()}:${date_now.getMinutes()}:${date_now.getSeconds()} UTC.
                                                from IP ${req.ip.split(":")[3]}.
                                                `,
                        };
                        sendMail(mailObj).then((mailres) => {
                            // console.log(mailres);
                            res.json({
                                message: "Your Password has been updated",
                                redirection: null,
                            });
                            return;
                        });
                        // res.status(406).json({ message: "Password updated successfully...", redirection: "/signin" })
                        // return
                    })
                        .catch(err => {
                        console.log(err);
                        return res.json({ message: "Something went wrong" });
                    });
                })
                    .catch(err => {
                    res.status(406).json({ message: err.message, redirection: "test 1" });
                    return;
                });
            });
        }
        else {
            res.status(406).json({ message: "Your Passwords didn't match...", redirection: null });
        }
    })
        .catch(err => {
        console.log("errhere");
        res.status(406).json({ message: err.message, redirection: null });
    });
};
exports.forgotRrlReset = forgotRrlReset;
