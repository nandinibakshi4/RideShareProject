import User from  "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Get user details
export const getUser = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id).populate('ridesCreated ridesJoined').lean();
    const {email, password, updatedAt, ...detail} = user
    res.status(200).json(detail); 
  }catch(err){
    next(err);
  }
}

export const getAllUsers = async(req, res, next)=>{
  try{
    const users = await User.find()
    res.status(200).json(users)
  }catch(err){
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { name, phoneNumber, profilePicture, age, profile } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          phoneNumber,
          profilePicture,
          age,
          profile
      }},
      {new:true, select: '-password'}    
    )
    res.status(200).json(updatedUser)
  }catch (err) {
    next(err)
  }
}
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    // 5. Send response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    // ✅ Add this block to see error details
    console.error("Register Error:", err);
    next(err);
  }
};


export const deleteUser = async (req, res, next) => {
  try{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User has been deleted.")
  }catch (err) {
  console.error("Delete User Error:", err);
  next(err);
}

}