import React, { useEffect, useState } from "react";
import "./Style.css";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { verifyToken } from "../utils/verifyToken";

function Projects() {
    const [projects, setProjects] = useState({ myProjects: [], sharedProjects: [] });
    const [filter, setFilter] = useState("myProjects");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Verify if the user if authenticated with token
        const authenticateUser = async () => {
            const { authenticated, email, message } = await verifyToken();
            if (!authenticated) {
                navigate("/login");
                return;
            }
            setEmail(email);
            setMessage(message);
        };
        authenticateUser();

        // Fetch all projects
        const fetchProjects = async () => {
            setLoading(true); // show loading indicator
            try {
                const response = await fetch("http://localhost:4000/api/projects/all", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const result = await response.json();
                if (response.ok) {
                    if (result.message) { // no projects found
                        setMessage(result.message);
                    } else {
                        setProjects(result);
                        setMessage(""); // clear any previous message
                    }
                } else {
                    console.error(result.error);
                    setMessage("Failed to fetch all projects");
                }
            } catch (error) {
                console.error("Failed to fetch all projects: ", error);
                setMessage("An error occurred while fetching projects");
            } finally {
                setLoading(false); // hide loading indicator
            }
        };
        fetchProjects();
    }, [navigate]);

    // Fetch and render the approriate project list based on filter
    const renderProjects = () => {
        const currentProjects = projects[filter];

        if (loading) {
            return <p>Loading...</p>;
        }

        if (message) {
            return <p>{message}</p>;
        }

        if (!currentProjects.length) {
            return (
                <p>
                    {filter === "myProjects"
                        ? "You have not create any projects"
                        : "No projects shared with you"}
                </p>
            );
        }

        return (
            <ul>
                {currentProjects.map((project) => (
                    <li key={projects._id} className="table-two">
                        <div className="table-two-left">
                            <p>Project Name: {project.projectName}</p>
                            <p>Project Description: {project.description}</p>
                            <p>Last Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                            <p>Collaborators: {project.collaborator.join(", ")}</p>
                        </div>
                        <div className="table-two-right">
                            <button className="container-button" onClick={() => navigate(`/editor/${project._id}`)}>
                                Open Project
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="page-container">
            <Menu email={email} />
            <div className="container-body">
                <h2>Projects</h2>
                <button className="container-button"  onClick={() => navigate("/create")}>Create New Project</button>
                <div style={{ padding: "20px" }}>
                    <p><b>All Projects</b></p>
                    {/* <button
                        onClick={() => setFilter("myProjects")}
                        className={filter === "myProjects" ? "active" : ""}
                    >
                        My Projects
                    </button>
                    <button
                        onClick={() => setFilter("sharedProjects")}
                        className={filter === "sharedProjects" ? "active" : ""}
                    >
                        Shared with Me
                    </button> */}
                    {renderProjects()}
                </div>                
            </div>
        </div>
    );
}

export default Projects;