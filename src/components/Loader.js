import React from 'react'
import '../styles/Loader.css'
function Loader() {
    return (
        <div className="Loader__container">
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>
    )
}

export default Loader