import styled from 'styled-components';

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem;
  width: 300px;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h2`
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #555;
`;

const Subtitle = styled.h3`
  font-size: 1rem;
  margin: 0.25rem 0;
  color: #555;
`;

const FunFact = styled.p`
  margin-top: 1rem;
  font-style: italic;
  color: #777;
`;

const Coords = styled.p`
  font-size: 0.9rem;
  color: #333;
  margin-top: 0.5rem;
`;


export default function LocationPreview() {
    return(
        <Card>
            <Title>Location: Boston, USA</Title>
            <Subtitle>Sunrise: 5:26AM</Subtitle>
            <Subtitle>Sunset: 7:30PM</Subtitle>
            <Coords>Latitude: 42.350876, Longitude: -71.106918</Coords>
            <FunFact>🌍 Fun Fact! </FunFact>
        </Card>
    )
}
