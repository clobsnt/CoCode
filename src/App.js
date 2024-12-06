import React from "react";
import "./App.css";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";


const App = () => {
    return (
        // <Router>
        //     <Routes>
        //         <Route path="/" element={<Login />} />
        //         <Route path="/login" element={<Login />} />
        //         <Route path="/register" element={<Register />} />
        //     </Routes>
        // </Router>

        <div className="App">
            <Login />
        </div>
    );
};

export default App;
