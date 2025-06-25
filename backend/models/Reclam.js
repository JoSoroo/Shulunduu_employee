const mongoose = require("mongoose");
const reclamSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String,
    },
    title: {
        type: String,
        required: true,
    },
    video: {
        data: Buffer,
        contentType: String,
    },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Reclam", reclamSchema);