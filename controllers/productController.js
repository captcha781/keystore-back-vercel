"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProduct = exports.getAllProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const getAllProducts = (req, res) => {
    const { rangestart, rangeend, sortby, page, search } = req.query;
    const category = req.body.category;
    let findQueryWithSearch;
    let findQueryWithoutSearch;
    if (sortby !== "relevance") {
        let sortorder = sortby === "lth" ? 1 : -1;
        if (category.length >= 1) {
            findQueryWithSearch = [{ $match: { $text: { $search: search }, price: { $gte: Number(rangestart), $lte: Number(rangeend) }, category: { $in: category } } }, { $sort: { price: sortorder } }];
            findQueryWithoutSearch = [{ $match: { price: { $gte: Number(rangestart), $lte: Number(rangeend) }, category: { $in: category } } }, { $sort: { price: sortorder } }];
        }
        else {
            findQueryWithSearch = [{ $match: { $text: { $search: search }, price: { $gte: Number(rangestart), $lte: Number(rangeend) } } }, { $sort: { price: sortorder } }];
            findQueryWithoutSearch = [{ $match: { price: { $gte: Number(rangestart), $lte: Number(rangeend) } } }, { $sort: { price: sortorder } }];
        }
        productModel_1.default.aggregate(search ? findQueryWithSearch : findQueryWithoutSearch).count("price")
            .then((count) => {
            productModel_1.default.aggregate(search ? findQueryWithSearch : findQueryWithoutSearch).skip(Number(page) * 16 - 16).limit(16)
                .then(response => {
                return res.json({ products: response, count: count[0].price });
            })
                .catch(err => {
                return res.json({ message: err });
            });
        });
    }
    else {
        if (sortby === "relevance" && category.length <= 0) {
            findQueryWithSearch = { price: { $gte: rangestart, $lte: rangeend }, $text: { $search: search } };
            findQueryWithoutSearch = { price: { $gte: rangestart, $lte: rangeend } };
        }
        else {
            findQueryWithSearch = { price: { $gte: rangestart, $lte: rangeend }, category: category, $text: { $search: search } };
            findQueryWithoutSearch = { price: { $gte: rangestart, $lte: rangeend }, category: category };
        }
        productModel_1.default.find(search ? findQueryWithSearch : findQueryWithoutSearch).count()
            .then(count => {
            productModel_1.default.find(search ? findQueryWithSearch : findQueryWithoutSearch).skip(Number(page) * 16 - 16).limit(16)
                .then(response => {
                return res.json({ products: response, count });
            })
                .catch(err => {
                return res.json({ message: err });
            });
        });
    }
};
exports.getAllProducts = getAllProducts;
const searchProduct = (req, res) => {
    const { id } = req.params;
    productModel_1.default.findById(id)
        .then(foundResponse => {
        return res.json({ product: foundResponse });
    })
        .catch(err => {
        return res.json({ message: err });
    });
};
exports.searchProduct = searchProduct;
