const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    msg: { type: String, required: true },
    timestamp: { type: String, required: true },
}, { collection: "message" })

module.exports = mongoose.model("message", MessageSchema);