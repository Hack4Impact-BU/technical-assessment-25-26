import './welcome.css'

function Welcome () {
    return (
        <div className="welcome">
            <h2>
                Welcome!
            </h2>
            <p>
                This is a website to find the sunrise and sunset times from your location! (If location services are off it is set to Boston by default)
            </p>

        </div>
    )
}

export default Welcome