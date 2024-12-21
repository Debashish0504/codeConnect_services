const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://namastedev:0CpwCdcJ53kteqcz@namastedev.eikas.mongodb.net/devTinder")
}

module.exports = connectDB