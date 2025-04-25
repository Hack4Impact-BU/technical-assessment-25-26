# Josh Ilano's Submission
**Date**: 4/25/2025

**BU Email**: jilano1@bu.edu

**Class Year**: 2027

**Favorite Hobby**: Traveling

## Requirements
Please check off which features you have implemented:
- [x] A catchy name and title with a cool font!
- [x] An interactive, pretty world map that spans most of the home page, using the [React Leaflet](https://react-leaflet.js.org/) library.
- [x] An [event](https://react-leaflet.js.org/docs/example-events/) that places a marker at your current location with a popup that displays the sunrise and sunset times of your location using the [Sunrise Sunset JS](https://www.npmjs.com/package/sunrise-sunset-js) library.
- [x] The popup should also display information about a place in a totally different part of the world with similar sunrise and sunset times. You should use the Google Gemini API for this, leveraging both system instructions and your individual queries to get the best result possible.
- [x] A separate history page that keeps track of locations you've tapped. This should include latitude, longitude, and some information about Google Gemini's response. You can include the whole response if you want, but making another call to Google Gemini to extract just the location to put on there would be extra cool! You can display this information in whatever format you want. Make sure you can get between your home and history pages by clicking on an icon, text, etc.
- [x] Deploy the frontend and backend if you can using some of the free deployment tools we talked about in the workshops!

## Screen Recording 
**Link**: [paste it here]

## Written Portion
1. **How did the project go? What parts of it did you most enjoy / find yourself good at?** I believe the project went very well. I really enjoyed playing around with the UI, especially when it came to overriding the map's initial configurations and customizing the Popup component. Since I had experience with the Requests library from Python, I found working myself with the backend much easier than I anticpated, most notably because I am familiar with the aspects of working with network calls, handling promises, and catching exceptions. Specifically, I found myself most skilled with managing MongoDB and also the SessionStorage, as I knew how such saved data gets stored and how to parse it as a JSON object. In general, I enjoyed the React Framework the most. I found it really simple to work with the UI and the functionality behind it, and it honestly made web development seem that much less intimidating. 

2. **Was this technical assessment what you expected? If you had another two weeks to work on it, what would you add or change?**
The technical assessment was what I roughly expected. I used the foundational logic involved with creating the personal website and transferred it over to this technical assessment. The most difficult part for me honestly came from fine-tuning and handling potential
edge cases. For example, transitioning from the history page to the map page would trigger another complete refresh (it would
generate another AI response and reset the position), so in order to resolve this issue, I made use of the session storage to
preserve user state. Another issue just came from if user clicked out of bounds and Gemini refusing to accept any invalid coordinates, but I fixed it by ensuring these coordinates were within range. If I had another two weeks to work on it, I would probably make the history page more intuitive. For example, I could add a feature where clicking any given coordinates in the list would take you back to the map. I would also optimize the UI for mobile devices. Currently, on a phone, the Navbar would be squished, and the map would not use all of the map real-estate, so given more time, I would definitely develop another set of UI compatible with such devices.
