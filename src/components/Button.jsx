import React from 'react'
const Button = ({title, onClick, isActive}) => {
  return (
    <div>
      <button
        style={{
          maxWidth: "140px",
          minWidth: "80px",
          height: "30px",
          marginRight: "5px"
        }}
        className={`tab-button ${isActive ? 'active' : ''}`} 
        onClick={onClick}
      >
        {title}
      </button>
    </div>
  )
}
export default Button
