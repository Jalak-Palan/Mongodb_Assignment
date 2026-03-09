const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

/* MongoDB Connection */

mongoose.connect("mongodb+srv://jalakapalan:Jalak2007@cluster0.dqhwnjd.mongodb.net/Day-8")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});


/* Schema */

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is required"],
        minlength: [3,"Name must be at least 3 characters"],
        trim: true
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        lowercase: true,
        unique: true,
    },
    password:{
        type: String,
        required: [true,"Password is required"],
        minlength: [6,"Password must be at least 6 characters"],
    },
    role:{
        type: String,
        required: true,
        enum: ["user","admin"],
        default: "user"
    },
});


/* Model */

const User = mongoose.model("User", userSchema);


/* POST Route */

app.post("/users", async (req, res) => {

    try {

        const newUser = new User(req.body);

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User Created",
            data: savedUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Error",
            error: error.message
        });

    }

});

// GET Route

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Put Route

app.put("/users/:name", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete Route
app.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User Deleted" });
    } catch (err) {
        res.status(500).send(err);
    }
});

/* Server */

app.listen(3000, () => {
    console.log("Server running on port 3000");
});