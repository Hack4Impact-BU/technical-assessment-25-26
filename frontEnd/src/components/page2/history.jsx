import './history.css'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



function History() {
    const [data, setData] = useState([])       // ↙ holds the fetched array
    const [loading, setLoading] = useState(true)
    const [error, setError]   = useState(null)
  
    // fetch once after mount
    useEffect(() => {
      (async () => {
        try {
          const res  = await fetch('http://localhost:4000/positions')
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const json = await res.json()
          setData(json)
        } catch (err) {
          console.error(err)
          setError('Could not load data')
        } finally {
          setLoading(false)
        }
      })()
    }, [])

    if (loading) return <p>Loading…</p>
    if (error)   return <p style={{ color: 'red' }}>{error}</p>

    return (
        <section className="click-history">
          <h2>All Saved Clicks</h2>
          <div>
          <Link to="/">Go back to the map</Link>
          </div>

          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date / Time</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ _id, lat, lng, when }, i) => (
                <tr key={_id}>
                  <td>{i + 1}</td>
                  <td>{new Date(when).toLocaleString()}</td>
                  <td>{lat.toFixed(5)}</td>
                  <td>{lng.toFixed(5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )
}


export default History