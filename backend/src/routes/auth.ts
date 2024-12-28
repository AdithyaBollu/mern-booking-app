import express, {Request, Response} from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/login", [
    check("email", "Email is required").isEmail(), 
    check("password", "Password with 6 or more characters required").isLength({
        min:6,
    }),

], async (req: Request, resp: Response) => {
    const errors = validationResult(req)
    // Checks if any fields have not met the requirements
    if (!errors.isEmpty()) {
        return resp.status(400).json({message: errors.array()});
    }

    const { email, password} = req.body;

    try {
        // checks if there is a user email
        const user = await User.findOne({ email });
        // User does not match/exist
        if(!user) {
            return resp.status(400).json( {message: "Invalid Credentials"} );
        }

        // checks if passwords are the same, by hashing it
        const isMatch = await bcrypt.compare(password, user.password);
        // Password does not match/exist
        if(!isMatch) {
            return resp.status(400).json( {message: "Invalid Credentials"} );
        }

        const token = jwt.sign(
            {userId: user.id}, 
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "1d",
            }
        );

        resp.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86_400_000,
        });
        resp.status(200).json({userId: user._id})
    } catch (err) {
        console.log(err);
        resp.status(500).json({message: "Something went wrong"});
    }
});

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({userId: req.userId})
});

router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});

export default router;