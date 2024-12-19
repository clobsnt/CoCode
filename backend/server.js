/** Main server file */
const express = require("express");
const mongoose = require("mongoose"); // For connecting MongoBD
const cors = require("cors"); // For cross-origin resource sharing
const dotenv = require("dotenv"); // For managing environment variables
const bcrypt = require("bcrypt"); // For hashing password
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const { error } = require("ajv/dist/vocabularies/applicator/dependencies");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

/** DATABASE SCHEMA AND MODEL  */
// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Project Schema 
const projectSchema = new mongoose.Schema({
    owner: { type: String, required: true }, 
    projectName: { type: String, required: true },
    description: { type: String, required: false },
    htmlCode: { type: String, required: false },
    cssCode: { type: String, required: false },
    jsCode: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    collaborator: [{ type: String, default: [] }], // List of collaborator emails
});
// allows users to have projects with the same name, 
// but only if the owner is different
// projectSchema.index({ owner: 1, projectName: 1 }, { unique: true });
const Project = mongoose.model("Project", projectSchema);


/** HANDLE JWT */
// Serect for JWT
const JWT_SECRET = process.env.JWT_SECRET || "my_secret";

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
};


/** MISC FUNCTIONS */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


/** HANDLE API ROUTES */
// User Register 
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate user email existed or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return res.json({ success: true, message: "Registration successful" });
    
    } catch (err) {
        console.error("Error registering user: ", err);
        return res.json({ success: false, message: "Error during registration" });
    }
});

// User Login 
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Sign the token with user's INFO, secret key, expiration
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        
        res.json({ success: true, message: "Login successful", token });

    } catch (err) {
        console.error("Error user login: ", err);
        return res.json({ success: false, message: "Error during user login" });
    }
});

// Protected Route 
app.get("/api/protected", authenticateJWT, (req, res) => {
    return res.json({ 
        message: "You have access to protected route",
        email: req.user.email, 
    });
});

// Project - Create New Project
app.post("/api/projects/create", authenticateJWT, async (req, res) => {
    // const { projectName, description, collaborator } = req.body;
    const { projectName, description, collaborator } = req.body;

    try {
        // Check if project name is provided
        if (!projectName || projectName.trim() === "") {
            return res.status(400).json({
                error: "Project name is required and cannot be empty",
            });
        }

        // Check if the project name already exists
        const existingProject = await Project.findOne({ projectName });
        if (existingProject) {
            return res.status(400).json({
                error: "A project with this name already exists",
            });
        }

        // Handle collaborator array
        let collaboratorArray = [];
        try {
            // Validate email format
            const invalidEmails = collaborator.filter(
                (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );

            if (invalidEmails.length > 0) {
                return res.status(400).json({
                    error: `Invalid email(s): ${invalidEmails.join(", ")}`,
                });
            }

            // Check if all emails exist in the database
            const users = await User.find({ email: {$in: collaborator} });
            const validEmails = users.map((user) => user.email);

            if (validEmails.length != collaborator.length) {
                const invalidUsers = collaborator.filter(
                    (email) => !validEmails.includes(email)
                );
                return res.status(400).json({
                    error: `One or more collaborator emails do not exist: ${invalidUsers.join(", ")}`,
                });
            }

            collaboratorArray = collaborator; // Assign validated collaborator
        } catch (error) {
            console.error("Error validating collaborators:", error);
            return res.status(500).json({ error: "Error validating collaborators." });
        }

        // Create the project
        const newProject = new Project({
            owner: req.user.email, // Extracted from JWT token
            projectName: projectName.trim(),
            description: description ? description.trim() : "",
            htmlCode: "",
            cssCode: "",
            jsCode: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            collaborator: collaboratorArray,
        });
        await newProject.save();
        res.status(201).json({ message: "Project saved successfully", newProject });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "Project name must be unique" });
        } 
        console.error(error);
        res.status(500).json({ error: "Failed to create project" });
    }
});


/** HANDLE FETCHING DATA */
// Fetch the lastest project of the user
app.get("/api/projects/latest", authenticateJWT, async (req, res) => {
    try {
        const latestProject = await Project.findOne({ owner: req.user.email })
            .sort({ updatedAt: -1 })
            .select("projectName description collaborator updatedAt")
            .lean();
        if (!latestProject) {
            return res.status(200).json({ message: "User has no project" });
        }
        // console.log("Fetched Project Latest: ", latestProject); // check log
        // res.json(latestProject);
        res.json(latestProject);
    } catch (error) {
        console.error("Error fetching latest project: ", error);
        res.status(500).json({ error: "Failed to fetch latest project" });
    }
});

// Fetch all project of the user
app.get("/api/projects/all", authenticateJWT, async (req, res) => {
    try {
        const myProjects = await Project.find({ owner: req.user.email }).lean();
        const sharedProjects = await Project.find({ 
            collaborator: { $regex: `(^|,)${req.user.email}($|,)`, $options: "i" }, 
        }).lean();

        // Check if both lists are empty
        if (!myProjects.length && !sharedProjects.length) {
            return res.status(200).json({ message: "User has no projects" });
        }
        res.json({ myProjects, sharedProjects });
    } catch (error) {
        console.error("Error fetching all project: ", error);
        res.status(500).json({ error: "Failed to fetch all projects" });
    }
});

// Fetch project by project id 
app.get("/api/projects/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project
            .findById(id)
            .select("owner projectName description collaborator htmlCode cssCode jsCode createdAt updatedAt");

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Ensure only owner or collaborator can access the project
        if (project.owner !== req.user.email && !project.collaborator.includes(req.user.email)) {
            return res.status(403).json({ error: "You are not authorized to view this project" });
        }

        res.status(200).json(project);
    } catch (err) {
        console.log("Error fetching project: ", err);
        res.status(500).json({ error: "Error fetching project" });
    }
});

// Update project
app.put("/api/projects/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { description, collaborator, htmlCode, cssCode, jsCode } = req.body;

    try {
        // Handle collaborator array
        let collaboratorArray = [];
        try {
            // Validate email format
            const invalidEmails = collaborator.filter(
                (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );

            if (invalidEmails.length > 0) {
                return res.status(400).json({
                    error: `Invalid email(s): ${invalidEmails.join(", ")}`,
                });
            }

            // Check if all emails exist in the database
            const users = await User.find({ email: {$in: collaborator} });
            const validEmails = users.map((user) => user.email);

            if (validEmails.length != collaborator.length) {
                const invalidUsers = collaborator.filter(
                    (email) => !validEmails.includes(email)
                );
                return res.status(400).json({
                    error: `One or more collaborator emails do not exist: ${invalidUsers.join(", ")}`,
                });
            }

            collaboratorArray = collaborator; // Assign validated collaborator
        } catch (error) {
            console.error("Error validating collaborators:", error);
            return res.status(500).json({ error: "Error validating collaborators." });
        }

        // Update project
        const updatedProject = await Project.findOneAndUpdate(
            { _id: id, owner: req.user.email }, // Ensure user is the owner
            {
                description: description ? description.trim() : "",
                htmlCode: htmlCode ? htmlCode.trim() : "",
                cssCode: cssCode ? cssCode.trim() : "",
                jsCode: jsCode ? jsCode.trim() : "",
                updatedAt: new Date(),
                collaborator: collaboratorArray,
            },
            { new: true },
        );

        if (!updatedProject) {
            return res.status(404).json({ error: "Project not found or you are not the owner" });
        }

        res.status(200).json({ message: "Project updated successfullt" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating project" });
    }
});


// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));