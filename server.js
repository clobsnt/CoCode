const express = require("express"); 
const bodyParser = require("body-parser"); // parses incoming request bodies
const mongoose = require("mongoose"); // MongoDB connection
const bcrypt = require("bcryptjs"); // hashing password
const jwt = require("jsonwebtoken"); // generate authentication tokens
const cors = require("cors"); // enable cross-origin resource sharing
require("dotenv").config(); // manage environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database connection error: ", err))

// Define User schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// User Register Route
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "User registered failed" });
    }
});

// User Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) 
            return res.status(404).json({ error: "User not found" });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) 
            return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

// Connect to server
const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
