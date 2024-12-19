import React, { useEffect, useState } from "react";
import "./Style.css";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import Editor from "../components/Editor";
import { verifyToken } from "../utils/verifyToken";

function EditorPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { id } = useParams(); // Fetch projectID from URL
    const [project, setProject] = useState(null);
    const [description, setDescription] = useState("");
    const [collaborator, setCollaborator] = useState("");
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [jsCode, setJsCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        // Verify if user is authenticated with token
        const authenticateUser = async () => {
            const { authenticated, email } = await verifyToken();
            if (!authenticated) {
                navigate("/login");
                return;
            }
            setEmail(email);
        };
        authenticateUser();

        // Fetch project information
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch project data");
                }

                const data = await response.json();
                setProject(data);
                setDescription(data.description || "");
                setCollaborator(data.collaborator.join(", ") || "");
                setHtmlCode(data.htmlCode || "");
                setCssCode(data.cssCode || "");
                setJsCode(data.jsCode || "");
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message);
            }
        };
        fetchProject();

    }, [navigate, id]);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    // Save project changes
    const handleSaveProject = async () => {
        // Validate collaborator emails (if provided)
        let collaboratorArray = [];
        if (collaborator) {
            collaboratorArray = String(collaborator).split(",").map((email) => email.trim()).filter((email) => email);

            const invalidEmails = collaboratorArray.filter((email) => !isValidEmail(email));
            if (invalidEmails.length > 0) {
                setErrorMessage(`Invalid email(s): ${invalidEmails.join(", ")}`);
                return;
            }
        }

        try {
            const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    description: description.trim(),
                    collaborator: collaboratorArray,
                    htmlCode: htmlCode.trim(),
                    cssCode: cssCode.trim(),
                    jsCode: jsCode.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save project");
            }

            setSuccessMessage("Project saved successfully");
            setErrorMessage("");
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    if (!project) {
        return <p>Loading project...</p>;
    }
    
    return (
        <div className="page-container">
            <Menu email={email} />
            <div className="container-body">
                <h2>Project Name: {project.projectName}</h2>
                <button onClick={handleSaveProject} className="container-button">Save Project</button>
                
                <Editor />
                <div className="project-info">
                    <div>
                        <label>Description:</label><br/>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter project description"
                        />
                    </div>
                    <div>
                        <label>Collaborators:</label><br/>
                        <textarea
                            value={collaborator}
                            onChange={(e) => setCollaborator(e.target.value)}
                            placeholder="Enter collaborator emails (comma-separated)"
                        />
                    </div>
                </div>
                
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
        </div>    
    );
}

export default EditorPage;
