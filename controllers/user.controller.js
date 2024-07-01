import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req, res) => {
    //Get details from frontside
    //validation
    //check if user already exists :username and email
    // check for images and avatar
    //upload them to cloudinary
    //create user object -create entry in db
    //remove password and refresh token fields
    //check for user creation
    //return Response

    const { fullname, email } = req.body
    console.log(fullname, email);

    if ([username, fullname, email, password].some((field) =>
        field?.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = User.create({
        username: username,
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url,

    })

    const createdUser = User.findById(user.id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while register a new user")
    }
    return res.status(201).json(
        new ApiResponse(200, "User registred successfully")
    )

})

export { registerUser }