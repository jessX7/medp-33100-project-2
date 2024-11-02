# Using the Express app for your Project

This is a simple Express app that you can use as a starting point for your project.

## Getting Started
1. Merge this branch into your `main` branch.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start the Express server.
4. Visit `http://localhost:3000` to see the app running.

## Project Structure
- `public/` this is where you put your static files like stylesheets, images, and client-side JavaScript.
- `views/` this is the folder with the templates. To attach additional stylesheets or javascript files, add it to the `head` section of the `layout.hbs` file. To put content in the `<body>` of the page, add it to the `index.hbs` file.

You won't need to change any of the other files for this project.

## API Keys
If you want to protect your API keys, you can call your API from the server by making a request to the API from routes. This way, the API key is never exposed to the client. You can use the `node-fetch` package to make requests to the API from the server.
Example of adding a route to make a request to an API from the server:
```javascript
const fetch = require('node-fetch');
router.get('/data', async (req, res) => {
    fetch('https://api.example.com?key=${API_KEY}')
        .then(res => res.json())
        .then(data => {
            res.json(data);
        });
});
```
