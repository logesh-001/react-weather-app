import React from 'react'
import "../assets/Weather.css"
import clear from "src\assets\sun.png";
    
export const Weather = () => {
    return (<>
        <div className="container">
            <div className="input-container">
                <input type="text" placeholder='Search city' />
                <img src="src\assets\loupe.png" alt="" />
            </div>
    </div>
    </>
  )
}
