import './navbar.css';
import {Link} from "react-router";

import styled from "styled-components";

const StyledTitle = styled.h1`
font-size: 65px

`



 function Navbar() {


    return( 
        <div id = "navbar">
            <StyledTitle> FindMySunset</StyledTitle>

            <Link to="/">Map</Link>
            <Link to={"/history"}>History</Link>




        </div> 
            
    )
}
export default Navbar;