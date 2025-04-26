import './home.css'
import Button from '@mui/material/Button';
import React, { useState } from 'react'
import Map from '../map/map.jsx'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => { setAnchorEl(event.currentTarget); }
  const handleClose = () => { setAnchorEl(null) }

  // Warns user of delteting history and posts to server to delete history
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete all history?')) return
    try {
      const res = await fetch('http://localhost:4000/positions/data', { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      console.error(err)
      alert(err)
    }
  }
  return (
    <div className='home'>

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
      <h1>
        <span>Oh, The Places You Want To Go!</span>
      </h1>

      <Map />

      <br></br>

      <div>
        <Accordion className="history-accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Welcome! Press here for introduction!</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <h3 id='instruction'>Welcome to Tim's sunsetting fun fact generator, where you love to learn something new everyday!
              When you click on the map, the marker will move to where you clicked, hit the marker and it will have information
              about the sunset time. The marker will then tell you another location at another part of the world with that similar sunset time
              and tell you a fun fact! If you ever want to re-look at what you've previously clicked on, click on menu and press history!
              To clear what you've previously clicked on, click on menu and press clear history! Have fun exploring the world!
            </h3>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}
export default Home