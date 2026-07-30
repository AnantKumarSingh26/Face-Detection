const mongoose = require('mongoose');
const  userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [40, "Name should be under 40 characters"],
        unique: [   true, "Name should be unique"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"], 
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [2, "Password should be atleast 6 characters long"],
        select: false // Exclude the password field from the response
    }
})

const userModel = mongoose.model("Users_Mood", userSchema, "users_moods");
module.exports = userModel;

// userSchema.pre('save', async function(next) {
//     if(!this.isModified('password')) {
//         return next();
//     }})
// userSchema.post('save', function(doc, next) {
//     console.log('New user created:', doc);
//     next();
//   });    