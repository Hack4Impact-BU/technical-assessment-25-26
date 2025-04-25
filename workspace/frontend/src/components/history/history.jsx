import {useEffect, useState} from "react";
import  "./history.css";

export default function History () {

    const [messages, setMessages] = useState([]);




    useEffect(() => {
        fetch('http://localhost:4000/logs')
            .then(res => res.json())
            .then(data => {
                let newMessages = []
                for (let i = 0; i < data.length; i++) {
                    newMessages.push(data[i].input)

                }
                console.log("successfully retrieved messages from server: ")
                setMessages(newMessages)
            })
    }, [])

    function deleteSingleTab(){
        let newMessages = []

        fetch('http://localhost:4000/delete', {
            method: 'POST',

        })
        setMessages(newMessages)
        console.log("successfully deleted all messages")
    }




    return(
        <div className="history">
            {<button className = "x" onClick={()=>deleteSingleTab()}>Clear History</button>}
            <br/>
            {
                messages.map((log, index)=>(
                    <div key ={index} className='logbox'>

                        <h1><strong>Location</strong> {index}</h1>
                        <p><strong>Latitude:</strong> {log.latitude}</p>
                        <p><strong>Longitude:</strong> {log.longitude}</p>
                        <p><strong>Sunrise:</strong> {new Date(log.suntimes[0]).toLocaleTimeString()}</p>
                        <p><strong>Sunset:</strong> {new Date(log.suntimes[1]).toLocaleTimeString()}</p>
                        <p style={{ whiteSpace: 'pre-wrap' }}><strong>Gemini Match:</strong> {log.gemini}</p>

                    </div>
                ))
            }

        </div>
    )
}