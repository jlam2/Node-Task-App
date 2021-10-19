# Node-Task-App
Backend REST API for a Task app.

Database Storage with MongoDB using Mongoose.

User Authentication with Json Web Tokens.

Email notifications with SendGrid.

Testing with Jest.

## Setup

1. Make sure to have NodeJS installed. https://nodejs.org/en/download/
2. Clone this git repository. `git clone https://github.com/jlam2/Node-Task-App.git`
3. Install local npm dependencies. `npm install`
4. Replace environmental variable with your own. There are 4 variables to be need to be replaced.

   I reccomend using an a .env file and using the dot-nev library if only using locally. https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs
    * MONGO_STRING - Connection URL for your MongoDB Database.
    * SENDGRID_KEY - API key for using SendGrid.
    * MY_EMAIL - Email used to send notifications.
    * JWT_SECRET - Used for encrypting tokens. Can be any string.
    
## Using the App
 
1. Start the app. `npm run start`
2. Create user by send a http POST request to localhost:3000 with the Name, Email, and Password in the body in JSON format.   
I reccomend using Postman to send requests. https://www.postman.com/
3. From there you can send requests the other endpoints defined in the src/routers folder to login, create tasks, upload avatar, etc.
