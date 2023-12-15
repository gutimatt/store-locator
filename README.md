# Google Maps Project

This is a proof of concept API in which Starbucks store locations are stored in a MongoDB to provide location and information of the store in the following zip codes: 90036, 90048, 80015, and 85255.

## What I Learned:
* Creating API server using express.
* Using Mongoose Schema to connect to MongoDB
* Axios to connect to Google Maps API

## Future Improvements 
* This could be converted to a MVC implementation.  Right now the API is seperate from client however controller and view are coupled.
* Unit testing API
* There is no error handling on the front end for unresolved zipcodes nor connecting to server.

## API Setup

Clone the repository into a folder

    git clone https://github.com/gutimatt/store-locator.git

To create your own server create a file named .env at the root directory.
In the env file the following will need to be included 
``` 
GOOGLE_MAPS_API=<google maps api key to project>
DB_USER=<mongo db username>
DB_PASSWORD=<mondo db password>
```
To start the server:
```
pwj-google-maps-app-api

api-exercise

npm install
```

Run `nodemon app.js`
This will start listening on your local port 3000
