import { useEffect, useState } from 'react';
import './History.css'

function History() {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        fetch('http://localhost:4000/logs')
            .then(res => res.json())
            .then(data => {
                let newMessages = []
                for (let i = 0; i < data.length; i++) { 
                    newMessages.push({coordinates: data[i].input, // coordinates
                                    response: data[i].response // gemini's response
                    }) // coordinates
                }
                setMessages(newMessages)
            })
        console.log("An update was performed")
    }, [])
    

    const [selected, setSelected] = useState(null)
    const [page, setPage] = useState(0) // 0,1,2,...

    const toggle = (i) => {
        if (selected === i) {
            return setSelected(null) // allows us to close everything else
        }
        setSelected(i)
    }


    return (
        <>
            <div className='wrapper'>
                
                <div className='accordion'>
                    <br></br>
                    <div className='page' >
                        <h2>
                            Page: {page} | Showing results {Math.min(messages.length, page*10+1)}-{Math.min((page)*10+10, messages.length)} of {messages.length} results
                            <button onClick={() => 
                                { if (page-1 >= 0) setPage(page-1) }            
                                } className='btn-link'> &lt; </button>
                            <button onClick={() =>            
                                { if( Math.min((page)*10+10, messages.length) != messages.length) setPage(page+1) }
                                
                                } className='btn-link'> &gt; </button>
                        </h2>
                    </div>
                    <br></br>
                    <hr color='black'></hr>
                {
                    // get n to n+10 results (slice 10 elements, go up to those 10 elements)
                    messages.slice(Math.min(messages.length, page*10), Math.min(page*10+10, messages.length)).map((text, index) => (
                   

                        <div key={index} className='item' onClick={() => toggle(index)}>
                            <div className='coordinates'>
                                <h2>{`${text.coordinates.lat}, ${text.coordinates.lng}`}</h2>
                                <span>{selected === index ? '-' : '+'}</span>
                            </div>

                            <div className={selected === index ? 'response show' : 'response'}>
                                <h1>
                                    {`${text.response.place}`}
                                </h1>
                                <h3>
                                    {`${text.response.interesting_fact}`}
                                </h3>
                            </div>
                        </div>
                    ))
                }
                </div>  
            </div>
        </>
    )
}

export default History