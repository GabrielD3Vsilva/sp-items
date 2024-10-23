const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://gabriel:1981abcd.@cluster0.ueibw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(( )=>console.log('mongoDb Connected'))
.catch((error)=>console.log(error));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    tel: Number,
    cnpj: Number,
    address: String,
    number: Number,
    profileImage: String,
    isPremium: Boolean,
    bairro: String,
    isPay: Boolean,
    pix: String,
    items: [{
        nameItem: String,
        descriptionItem: String,
        image: String,
        year: String,
        model: String,
        price: String,
        tel: Number
    }]
});

module.exports = {
    User: mongoose.model('User', UserSchema)
}