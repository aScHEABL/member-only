const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    membershipStatus: { type: String, required: true },
}, { collection: "account" })

AccountSchema.virtual("fullName").get(function() {
    return `${this.firstName}${this.lastName}`;
})

module.exports = mongoose.model("account", AccountSchema);