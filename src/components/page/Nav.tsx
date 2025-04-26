import styled from "styled-components";
import {Link} from "react-router-dom";
// Create the styled components
const StyledNav = styled.header`
    align-items: center;
    height: 10vh;
    padding: 0 2rem; 
    background-color: #f7f7f7;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;  
    z-index: 100;
    display: flex;
`;

const StyledH2 = styled.h2`
    font-family: Garamond, sans-serif;
    color: black;  
    font-size: calc(5px + 2.5vw);
    font-weight: 600;
    padding: 1rem;
`;
const StyledUl = styled.ul`
    font-family: Garamond, sans-serif;
    list-style: none;
    display: flex;
    justify-content: space-between;
`;
const StyledLink = styled(Link)`
    font-family: Garamond, sans-serif;
    color: black;
    font-size: 1.7rem;
    font-weight: 600;
    padding: 1rem;
`;

export default function Nav(){
    return(
        <StyledNav>
            <StyledH2>Here Comes the Sun~!🌅🌇</StyledH2>
                <StyledUl>
                    <li><StyledLink to={`/`}>Home</StyledLink></li>
                    <li><StyledLink to={`/locations`}>Locations</StyledLink></li>
                </StyledUl>
        </StyledNav>
    );
}