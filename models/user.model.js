import mongoose, { Schema } from 'mongoose';


const userSchema = new Schema({
    username: {
        type: 'string',
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: ["password is required"],
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

// when save password
userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next();
})

//compare the password
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}

//access token  
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// refresh token  
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model('User', userSchema);