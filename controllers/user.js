import comments from "../models/comments.js";
// import { posts } from "../models/post.js"
import user from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import orders from "../models/orders.js";

export const sign_in = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        req.user = await user.findOne({ email });
        if (!req.user) {
            console.log("User does not exist");
            return res.render("user_sign_in", {
                error: "User does not exist",
                email,
            });
        }

        const isValidPassword = await bcrypt.compare(
            password,
            req.user.password
        );

        if (isValidPassword) {
            const token = jwt.sign(
                { _id: req.user._id },
                process.env.SECRET_KEY
            );
            res.cookie("token", token);

            req.flash("success", "SIGN-IN succesfully");

            return res.redirect("/");
        } else {
            console.log("Incorrect password");
            return res.render("user_sign_in", {
                error: "Incorrect password",
                email,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(505).json({
            messege: "internal server error",
        });
    }
};
export const sign_up = async (req, res, next) => {
    try {
        // console.log(req.file)
        const { name, email, password } = req.body;
        let User = await user.findOne({ email });
        if (User) {
            return res.render("user_sign_up", { error: "user already exist" });
        }
        if (req.file)
            User = await user.create({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                avatar: `/uploads/users/${req.file.filename}`,
            });
        else
            User = await user.create({
                name,
                email,
                password: await bcrypt.hash(password, 10),
            });
        const token = jwt.sign({ _id: User._id }, process.env.SECRET_KEY);

        req.flash("success", "SIGN-UP succesfully");

        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(505).json({
            messege: "internal server error",
        });
    }
};
export const sign_out = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        req.flash("success", "SIGN-OUT succesfully");

        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(505).json({
            messege: "internal server error",
        });
    }
};

export const profile = async (req, res) => {
    try {
        const friend = await user.findById(req.params.id);
        if (!friend) {
            return res.status(200).json({ messege: "friend not found" });
        }
        res.render("profile", { user: friend });
    } catch (error) {
        console.log(error);
        res.status(500).json({ messege: "INTERNAL SERVER ERROR" });
    }
};

export const update_user = async (req, res) => {
    try {
        let object=req.body
        for(let x in object ){
            if(object[x]) continue
            else delete object[x]
        }
        // Use a different variable name for the result of findByIdAndUpdate
        let updatedUser = await user.findByIdAndUpdate(
            req.user._id,
            object
        );

        if (req.file) {
            // Check if a file is uploaded
            const img_path = path.join(
                path.resolve(),
                "public",
                updatedUser.avatar
            );
            if (
                fs.existsSync(img_path) &&
                User.avatar != "uploads/fixed_images/downloaded.png"
            )
                fs.unlinkSync(img_path);
            updatedUser.avatar = `/uploads/users/${req.file.filename}`;
        }
        // Save the changes to the updatedUser document
        await updatedUser.save();

        const token = jwt.sign(
            { _id: updatedUser._id },
            process.env.SECRET_KEY
        );
        return res.cookie("token", token).redirect("/about");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

export const delete_user = async (req, res) => {
    try {
        const User = await user.findById(req.user._id);

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            User.password
        );
        if (!isValidPassword) {
            return res.redirect("back");
        }
        const img_path = path.join(path.resolve(), "public", User.avatar);

        if (
            fs.existsSync(img_path) &&
            User.avatar != "uploads/fixed_images/downloaded.png"
        )
            fs.unlinkSync(img_path);
        await orders.deleteMany({ user_id: User.id });
        await user.findByIdAndDelete(User.id);
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        req.flash("success", "USER-DELETED succesfully");

        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};


// dark_web authentication
export const dark_web_register= async (req, res, next) => {
    try {
        const { dToken } = req.body;

        if (dToken==req.cookies.token) {
            // const dtoken = jwt.sign(
            //     { _id: req.user._id },
            //     process.env.SECRET_KEY
            // );
            res.cookie("sub_token", dToken);

            req.flash("success", "Dark-IN succesfully");

            return res.redirect("/darkL1");
        } else {
            console.log("Incorrect token");
            return res.render("token_reg", {
                error: "Incorrect token",
                dToken,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(505).json({
            messege: "internal server error",
        });
    }
};
