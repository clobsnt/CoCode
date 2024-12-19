import React, { useEffect, useState } from "react";
import "./Style.css";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { verifyToken } from "../utils/verifyToken";

function Home() {
    const [latestProject, setLatestProject] = useState(null);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

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

        // Fetch latest project
        const fetchLatestProject = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/projects/latest", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const result = await response.json();
                if (response.ok) {
                    if (result.message) { // no projects found
                        setMessage(result.message);
                    } else {
                        setLatestProject(result);
                    }
                } else {
                    console.error(result.error);
                }
            } catch (error) {
                console.error("Failed to fetch latest projects: ", error);
            }
        };
        // Fetch latest project
        fetchLatestProject();
    }, [navigate]);

    return (
        <div className="page-container">
            <Menu email={email} />
            <div className="container-body">
                <h2>Welcome to CoCode</h2> 
                <button className="container-button"  onClick={() => navigate("/create")}>Create New Project</button>
                <button className="container-button"  onClick={() => navigate("/projects")}>View All Projects</button>

                {message ? (
                    <p>{message}</p>
                ) : latestProject ? (
                    <div className="table-two" style={{ padding: "20px" }}>
                        <div className="table-two-left">
                            <p><b>Your Latest Project</b></p>
                            <p>Project Name: {latestProject.projectName}</p>
                            <p>Collaborators: {latestProject.collaborator.join(", ") || []}</p>
                            <p>Last Updated: {new Date(latestProject.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="table-two-right">
                            <button className="container-button"  onClick={() => navigate(`/editor/${latestProject._id}`)}>Open Project</button>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

            </div>
        </div>
    );
}

export default Home;
