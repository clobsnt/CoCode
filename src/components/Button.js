import React from "react";

const Button = ({ onClick, label, isActive }) => {
    return (
        <button
            onClick={onClick}
            style={{
                maxWidth: "140px",
                minWidth: "80px",
                height: "30px",
                marginRight: "5px"
            }}
            className={`tab-button ${isActive ? 'active' : ''}`}
        >
            {label}
        </button>
    );
};

export default Button;