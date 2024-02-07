const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    account: { type: Schema.Types.ObjectId, ref: "account", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
}, { collection: "message" })

module.exports = mongoose.model("message", MessageSchema);