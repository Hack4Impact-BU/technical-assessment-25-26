// import statements for app componenets and css
import Background from '../components/background/background';
import Logo from '../components/logo/logo';
import '../App.css';
import React from 'react';

function Home(){
    function darkMode() {
        const element = document.body;
        element.classList.toggle("dark-mode");
    }

    return (
        <>
            <Background />
            <Logo />
            <h1 id="info">drag the pin to any location you’d like, and click<br /> 
            to see the sunrise and sunset time for that area!!</h1>
        </>
    );
}

export default Home;