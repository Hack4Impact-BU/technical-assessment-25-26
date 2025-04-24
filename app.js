import express from 'express'





const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Basic test route
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
