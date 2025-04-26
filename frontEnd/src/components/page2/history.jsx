import './history.css'
import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';


function History() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => { setAnchorEl(event.currentTarget); }
  const handleClose = () => { setAnchorEl(null) }

  useEffect(() => {
    fetchData()
  }, [])

  // Fetches data from the server to use in lists
  function fetchData() {
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/positions')

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
  }


  // Warns user of delteting history and posts to server to delete history
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete all history?')) return
    try {
      const res = await fetch('http://localhost:4000/positions/data', { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchData()
    } catch (err) {
      console.error(err)
      alert(err)
    }
  }

  // Loads in order to fetch data from the server
  if (loading) return <p>Loading…</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className='history'>
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Dashboard
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}><Button id='menu' href='/'><h2>Map Menu</h2></Button></MenuItem>
          <MenuItem onClick={handleClose}><Button id='menu' href="/history"><h2>History</h2></Button></MenuItem>
          <MenuItem onClick={handleDelete}><Button id='menu'><h2>Clear history</h2></Button></MenuItem>
        </Menu>
      </div>

      <h1>Prevously Clicked Locations!</h1>

      <div>
        {data.map(({ lat, lng, when, result }) => (
          <Accordion className="history-accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">lat: {lat} | lng: {lng} | {when}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <h3>{result}</h3>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  )
}

export default History