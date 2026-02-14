const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");

const AddressSchema = new Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
});

const AddressBook = mongoose.model("AddressBook", AddressSchema, "addressbooks");

module.exports = { AddressSchema, AddressBook };