import React, { useEffect, useState } from 'react';
import darkToggle from '../../assets/darktoggle.png';
import logoImage from '../../assets/d2dlogo.png';
import './logo.css';

function Logo() {
    
    useEffect(() => {
        const updateLogoBackground = () => {
            const bodyBackgroundColor = getComputedStyle(document.body).backgroundColor;

            // set the logo background color to match the body
            const logoElement = document.querySelector('.logo');
            if (logoElement) {
                logoElement.style.backgroundColor = bodyBackgroundColor;
            }
        };

        // initial update
        updateLogoBackground();

        // create a MutationObserver to watch for changes to the body class
        const observer = new MutationObserver(() => {
            updateLogoBackground();
        });

        // observe changes to the body element's class attribute
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // cleanup the observer when the component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);
    
    return (
        <div className="logo">
            <img src={logoImage} alt="logo" width="650vh" height="auto"/>
        </div>
    );   
}

export default Logo;