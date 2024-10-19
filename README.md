# LinkedX
LinkedX is a social platform for professional networking and job seeking made with MERN Stack. Some of it's key features are: 
* User Roles: Two users roles are created - Freelancer (Job Seekers) and Producer (Job Provider)
* Authentication: JWT Token based Authentication is implemented.
* Routes Protection: Routes are secured based on different user types.
* Dashboard: Separate for both user types. For producers, allows CRUD, applicants managment. For Freelancers, allows apply operations and view access.
* Post Detail View: Visible to only the creater of the post. Allows editing and changes.
* Profile Detail View: Users can create/customize their profiles.
* Connection: Users can connect with one another.
* Chat Utility: Realtime Chat facility between Connected Users.
## Video Demonstration
* Click [here](https://drive.google.com/drive/u/1/folders/17kwOJhitKxr9VGdQJ9nJJ9H_0BxGjjHD) for the video demonstration
## Frontend
### Technologies used
* [ReactJS](https://react.dev/): React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript.
* [Material UI](https://mui.com/material-ui/) is an open-source React component library that implements Google's Material Design
* [React Router Dom](https://reactrouter.com/en/main) is used to build single-page applications i.e. applications that have many pages or components but the page is never refreshed instead the content is dynamically fetched based on the URL.
### Installation
* First ensure you have NodeJS installed in your computer. If not, you can get [here](https://nodejs.org/en/)).
* Clone The Repository on your local machine: 
    ```bash
    $ git clone https://github.com/sajji18/social-media-app.git
    ```
* #### Dependencies
    1. Install all the npm packages. Go into the project folder and type the following command to install all npm packages
        ```bash
            $ npm install
        ```
    2. In order to run the application, Type the following command
        ```bash
            $ npm run dev
        ```
* #### Run It
    You can now access the file api service on your browser by using
    ```
        http://localhost:5173/
    ```
## Backend
### Technologies Used
* [Node.js](https://nodejs.org/en) is an open-source, cross-platform JavaScript runtime environment.
* [Express.js](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [MongoDB](https://www.mongodb.com/) MongoDB is a source-available, cross-platform, document-oriented database program.
* [Socket.io](https://socket.io/) Allows Bidirectional and low-latency communication across Platforms.
### Installation
* First ensure you have NodeJS installed in your computer. If not, you can get [here](https://nodejs.org/en/)).
* Clone The Backend-Repository on your local machine: 
    ```bash
    $ git clone https://github.com/sajji18/social-media-app.git
    ```
* #### Dependencies
    1. First change the current directory to the root directory which consists of the index.js
        ```bash
            $ cd backend/
        ```
    2. Install all the npm packages. Go into the project    folder and type the following command to install all npm packages
        ```bash
            $ npm install
        ```
    3. Set up .env file according to the .env.example (Enter a Jwt_secret, port on which server will run, Your mongodb-url and node_env = development)
* #### Run It
    You can start the backend server using the following command on localhost:3000 - 
    ```bash
        $ node index.js
    ```
