import React, { useEffect, useState } from "react";
import "./Style.css";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { verifyToken } from "../utils/verifyToken";
import Create from "../components/Create";

function CreateProject() {
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
    }, [navigate]);

    return (
        <div className="page-container">
            <Menu email={email} />
            <div className="container-body">
                <h2>Create New Project</h2>
                <button className="container-button" onClick={() => navigate("/projects")}>View All Projects</button>
                <Create />
            </div>
        </div>
    );
}

export default CreateProject;