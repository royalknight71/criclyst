/**
 * User model definition.
 * Stores registered application users with hashed credentials and provides
 * a password-comparison instance method for authentication.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
    // Display name of the user (min length 2)
    name:{
        type: String,
        required: true,
        trim: true,
        minlength:2
    },
    // Unique, lowercased login email
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase:true,
        unique:true
    },
    // bcrypt-hashed password (min length 8)
    password:{
        type: String,
        required: true,
        trim: true,
        minlength:8
    },
    // Player favorites (watchlist) - stores only references to Player collection
    favorites:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        }],
        default: []
    }
},{
    timestamps: true
})

/**
 * Compares a plaintext candidate password against the stored hash.
 * @param {string} password - Plaintext password to verify.
 * @returns {Promise<boolean>} True if the password matches.
 */
userSchema.methods.comparePassword=async function(password){
    return bcrypt.compare(password,this.password)
}

const User=mongoose.model('User',userSchema);

export default User;