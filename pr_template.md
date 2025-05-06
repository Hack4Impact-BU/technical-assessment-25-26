# Eddie Lu's Submission
**Date**: 4/22/24

**BU Email**: adefifp@bu.edu

**Class Year**: 2027

**Favorite Hobby**: Volleyball

## Requirements
Please check off which features you have implemented:
- [✅] A catchy name and title with a cool font!
- [✅] An interactive, pretty world map that spans most of the home page, using the [React Leaflet](https://react-leaflet.js.org/) library.
- [✅] An [event](https://react-leaflet.js.org/docs/example-events/) that places a marker at your current location with a popup that displays the sunrise and sunset times of your location using the [Sunrise Sunset JS](https://www.npmjs.com/package/sunrise-sunset-js) library.
- [✅] The popup should also display information about a place in a totally different part of the world with similar sunrise and sunset times. You should use the Google Gemini API for this, leveraging both system instructions and your individual queries to get the best result possible.
- [✅] A separate history page that keeps track of locations you've tapped. This should include latitude, longitude, and some information about Google Gemini's response. You can include the whole response if you want, but making another call to Google Gemini to extract just the location to put on there would be extra cool! You can display this information in whatever format you want. Make sure you can get between your home and history pages by clicking on an icon, text, etc.
- [✅] Deploy the frontend and backend if you can using some of the free deployment tools we talked about in the workshops!

## Screen Recording 
**Link**: [https://drive.google.com/file/d/1DJjX8XDO_Kv80VXn8fMKecRCI1N1uZ0f/view?usp=sharing]
## Written Portion
1. **How did the project go? What parts of it did you most enjoy / find yourself good at?**

[The project mostly went pretty smoothly for the most part. The most enjoyable part was just learning to implement and use technologies I didn't have experience with before. This was my first project with MongoDB and NodeJS and I also didn't have much experience using pre-existing libraries such as sunset-sunrise-js before. Learning to use new technologies, although enjoyable, comes with reading a lot of documentation. However, when I was learning the fundamentals for HTML, CSS, and Javascript, a lot of it was done through the Odin Project and that's made me get used to and get good at reading through documentation and resources to figure out how to use something. Also, using prompting and system instructions for the Gemini API was really interesting to learn too. I feel like it's something I would want to use in future projects.]

2. **Was this technical assessment what you expected? If you had another two weeks to work on it, what would you add or change?**

[I wasn't too sure what to expect in terms of a technical assessment but if I did have more time to work on it without finals season breathing down my neck, I think I definitely could've made the UI a lot more attractive. Right now, it's mostly barebones and I mostly focused on making the functions very obvious and transparent for any user. It doesn't have a lot of attractiveness from a visual standpoint in my opinion. There was also a very niche error where in some parts of Africa, when I marked down a location, it would return back to me the longitude and latitude for a body of water. I couldn't figure out why it would do this, despite getting proper coordinates.]