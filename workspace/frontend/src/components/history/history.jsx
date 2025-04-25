import {useEffect, useState} from "react";
import  "./history.css";


{/*
This is the component that displays the history of where the user has clicked on the map
It uses a useEffect to stay up-to-date and fetches data from the backend db using /logs

Once the data from the db has been fetched, the messages useState is used hold all the history data

Then in the return statement, All the information from each location marker is displayed

There is also a deleteHistory function that clears the history tab and clears the mongodb as well

*/}


export default function History () {

    const [messages, setMessages] = useState([]);       //store locations




    useEffect(() => {

        //fetch each log from database via backend
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


    // delete history by clearing messages and calling the delete in backend to clear DB
    function deleteHistory(){
        let newMessages = []

        fetch('http://localhost:4000/delete', {
            method: 'POST',

        })
        setMessages(newMessages)
        console.log("successfully deleted all messages")
    }


    {/*
    Sun times are displayed in users local time
    Gemini response is styled to maintain spacing

    */}

    return(
        <div className="history">
            {<button className = "x" onClick={()=>deleteHistory()}>Clear History</button>}
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