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
})

module.exports = mongoose.model("Reclam", reclamSchema);