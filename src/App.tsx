import Nav from './components/page/Nav.tsx'
import Map from './components/page/Map.tsx'
import { createBrowserRouter, Routes, Route, RouterProvider} from 'react-router-dom';
import Locations from './components/page/Locations.tsx';
import styled from "styled-components";
import bgImage from './images/sunset.jpeg';

const StyledDiv = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    background-image: url(${bgImage});
    background-size: cover;
    background-position: center;
`;
const ParentDiv=styled.main`
    width: 100%;
    height: 70vh;
    margin: 20vh 5vw;
    margin-bottom: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    z-Index:50;
`;

function Root() {
  return (
    <>
        <StyledDiv>
            <Nav />
            <ParentDiv>
                <Routes>
                    <Route path="/*" element={<Map />}/>
                    <Route path="/locations/*" element={<Locations />}/>
                </Routes>
            </ParentDiv>
        </StyledDiv>
    </>
  )
}
const router = createBrowserRouter([{path:"*", Component : Root},]);
export default function App() {

    return (
        <>
            <RouterProvider router={router}/>
        </>
    );
}
