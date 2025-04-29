# AJ Hardimon's Submission
**Date**: [date here]

**BU Email**: ajh756@bu.edu

**Class Year**: 2027

**Favorite Hobby**: D&D

## Requirements
Please check off which features you have implemented:
- [X] A catchy name and title with a cool font!
- [X] An interactive, pretty world map that spans most of the home page, using the [React Leaflet](https://react-leaflet.js.org/) library.
- [X] An [event](https://react-leaflet.js.org/docs/example-events/) that places a marker at your current location with a popup that displays the sunrise and sunset times of your location using the [Sunrise Sunset JS](https://www.npmjs.com/package/sunrise-sunset-js) library.
- [X] The popup should also display information about a place in a totally different part of the world with similar sunrise and sunset times. You should use the Google Gemini API for this, leveraging both system instructions and your individual queries to get the best result possible.
- [ ] A separate history page that keeps track of locations you've tapped. This should include latitude, longitude, and some information about Google Gemini's response. You can include the whole response if you want, but making another call to Google Gemini to extract just the location to put on there would be extra cool! You can display this information in whatever format you want. Make sure you can get between your home and history pages by clicking on an icon, text, etc.
- [ ] Deploy the frontend and backend if you can using some of the free deployment tools we talked about in the workshops!

## Screen Recording 
**Link**: https://youtu.be/BGOcgvjG5iw

## Written Portion
1. **How did the project go? What parts of it did you most enjoy / find yourself good at?**

The project went fairly well, although I had to rush as my capstone was due the same day. I enjoyed more about react components, learned to sperate functions into different files more often, and learned more about how to find/call/tweak API calls.

2. **Was this technical assessment what you expected? If you had another two weeks to work on it, what would you add or change?**

I expected some kind of website with API calls but the map portion was unexpected. If I had more time I could clean up the code, add the history page, and deploy the website. Other things that I wanted to add were:
- making the sunrise/sunset times for the other location in that location's time zone
- place a second marker where the new location is and zoom out the map to see both
- try and find a way to pull up a photograph of what a sunrise in a certain city would look like and display it under the map
- add a city search feature instead of just gemini calls