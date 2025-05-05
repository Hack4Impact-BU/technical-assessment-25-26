import styled from "styled-components";
import LocationPreview from "./LocationPreview.tsx";
const StyledMain = styled.main`
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    z-index: 30;
    display: flex;
    flex-wrap: wrap;
`;

export default function Locations(){
    return(
        <>
            <StyledMain>
                <LocationPreview />
                <LocationPreview />
                <LocationPreview />
                <LocationPreview />
                <LocationPreview />
                <LocationPreview />
            </StyledMain>
        </>
    )
}