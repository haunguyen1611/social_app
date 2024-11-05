import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
// Signup User
const signupUser = async(req,res) => {
    try {
        const {name,email,username,password} = req.body;
        const user = await User.findOne({$or:[{email},{username}]});

        if(user){
            return res.status(400).json({message:"User already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        })
        await newUser.save();

        if(newUser){

            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username
            })
        } else{
            res.status(400).json({message:"Invalid user data"})
        }
    } catch (error) {
        res.status(500).json({message : error.message})
        console.log("Error in signupUser: ", error.message )
    }
}

// Login User
const loginUser = async(req,res) =>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect) return res.status(400).json({message: "Invalid username or password"});

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        })
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in loginUser ",error.message);
    }
}

// Logout User
const logoutUser = async(req,res) =>{
    try {
        res.cookie("jwt","",{maxAge: 1});
        res.status(200).json({message: "User Logged out successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in logoutUser ",error.message);
    }
}


// Follow, Unfollow User
const followUnfollowUser = async(req,res) =>{
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id == req.user._id.toString) return res.status(400).json({message: "You cannot follow yourself !"});

        if(!userToModify || !currentUser) return res.status(404).json({message: "User not found !"});

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            // Unfollow User
            // Modify current user following, modify followers of userTomodify
            await User.findByIdAndUpdate(req.user._id,{$pull: { following: id }});
            await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id }});
            res.status(200).json({message:"User Unfollowed Successfully"});
        }else{
            // Follow User
            await User.findByIdAndUpdate(req.user._id,{$push: {following:id}});
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            res.status(200).json({message:"User Followed Successfully"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in followUnfollowUser ",error.message);
    }
}

// Update User
const updateUser = async(req,res) =>{
    const {name,email,username,password,profilePic,bio} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({message: "User not found!"});

        if(req.params.id !== userId.toString()) return res.status(400).json({message: "You cannot update other user's profile"})

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        
        user = await user.save();

        res.status(200).json({message:"Profile updated successfully",user});
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in updateUser ",error.message);
    }
}

// Get User Profile
const getUserProfile = async(req,res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt")
        if(!user) return res.status(400).json({message: "User not found"});

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in getUserProfile ",error.message);
    }
}
export {signupUser,loginUser, logoutUser, followUnfollowUser, updateUser , getUserProfile};