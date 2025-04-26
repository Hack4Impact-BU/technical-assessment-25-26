import './navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div id="navbar">
            <h1 id = "Label">SETRISE</h1>
            <Link to="/history" className = "NavText">HISTORY</Link>
            <Link to="/" className = "NavText">MAP</Link>
        </div>
    )
}

export default Navbar
