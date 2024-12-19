import React, { useState } from "react";
import "./Editor.css";

const Create = () => {
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [collaborator, setCollabotator] = useState(""); // Comma-separated emails
    const [error, setErrorMessage] = useState("");
    const [success, setSuccessMessage] = useState("");

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    // Handle Save Project
    const handleSave = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!projectName.trim()) {
            setErrorMessage("Project name is required");
            return;
        }

        if (!description.trim()) {
            setErrorMessage("Project description is required");
            return;
        }

        // Validate collaborator emails (if provided)
        let collaboratorArray = [];
        if (collaborator) {
            collaboratorArray = String(collaborator).split(",").map((email) => email.trim()).filter((email) => email);

            // Validate each email in correct type
            const invalidEmails = collaboratorArray.filter((email) => !isValidEmail(email));
            if (invalidEmails.length > 0) {
                setErrorMessage(`Invalid email(s): ${invalidEmails.join(", ")}`);
                return;
            }
        }

        try {
            const projectData = {
                projectName: projectName.trim(),
                description: description.trim(),
                collaborator: collaboratorArray,
            };

            const response = await fetch("http://localhost:4000/api/projects/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(projectData),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Failed to save the project");
            } else {
                setSuccessMessage("Project created successfullt");
                // Reset form fields
                setProjectName("");
                setDescription("");
                setCollabotator("");
            }
        } catch (error) {
            console.error("Error during project saving", error);
            setErrorMessage("An error occurred. Please try again.");
        }
        
    };

    return (
        <div className="editor-container">
            <div className="form-container">
                <input 
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <textarea
                    placeholder="Project Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <input
                    type="text"
                    placeholder="Collaborator Emails (comma-separated)"
                    value={collaborator}
                    onChange={(e) => setCollabotator(e.target.value)}
                />
                <button onClick={handleSave}>Create Project</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}  
            </div>
        </div>
    );
};

export default Create;