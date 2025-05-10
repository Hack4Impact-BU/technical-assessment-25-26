import Navbar from './components/navbar/navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;