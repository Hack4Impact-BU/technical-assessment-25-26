import './welcome.css'

function Welcome () {
    return (
        <div className="welcome">
            <h2>
                Welcome!
            </h2>
            <p>
                This is a website to find the sunrise and sunset times from your location! 
            </p>
            <p>
                (If location services are off it is set to Los Angeles by default)
            </p>

        </div>
    )
}

export default Welcome