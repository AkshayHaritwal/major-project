const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // yaha humne passprt-local-mongoose ko require kar liya hai 

const userSchema = new Schema({  // yaha humne user ke liye schema define kiya hai isme hum 3 field denge email , username, password  email ko humne define kar diya hai baaki username and password field passport-local-mongoose khud hii add kar deta hai  
    email:{
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose); // yaha humne passportLocalMongoose ko as plugIn isliye use kiya hai kyuki ye username password and salting khud hii add kar dega 

module.exports = mongoose.model("User" , userSchema);
