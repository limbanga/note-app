# NoteApp
<!--
Created by GPT 
#TODO: update this file to fit with my app 
-->

NoteApp is a web application designed to help users manage their notes efficiently and securely. The app allows users to create, edit, delete, and categorize notes with ease. It also supports user authentication, tag-based filtering, and note searching to make organization even simpler.

## Features

- **User Authentication**: Register, login, and logout functionalities with session management.
- **Note Management**: Create, edit, delete, and view notes with a user-friendly interface.
- **Tagging System**: Assign tags to notes for better organization and filtering.
- **Search Notes**: Quickly search notes by title or content.
- **Responsive Design**: Fully responsive design for desktop and mobile users.
- **Security**: Secure login and session handling.
- **Data Synchronization**: Sync your notes across multiple devices (if extended with real-time features).

## Technologies Used

- **Backend**: Node.js with Express.js framework for building the server.
- **Database**: MongoDB with Mongoose for data storage and retrieval.
- **Templating**: Pug.js for server-side rendering and templating.
- **Authentication**: Sessions and cookies for secure login management.
- **Styling**: Bootstrap 5 for responsive design and user interface components.
- **Logging**: Winston for logging application activity.
- **Icons**: Font Awesome for UI icons.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14+)
- **MongoDB** (local or cloud instance)
- **Git** (for version control)
- **npm** (Node Package Manager)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/noteapp.git
    cd noteapp
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file for environment variables:

    ```bash
    touch .env
    ```

4. Add the following environment variables in the `.env` file:

    ```env
    MONGODB_URI=mongodb://localhost:27017/noteapp
    SESSION_SECRET=yourSecretKey
    PORT=3000
    ```

5. Start MongoDB (if running locally):

    ```bash
    mongod
    ```

### Running the App

1. Start the server:

    ```bash
    npm start
    ```

2. Open your browser and navigate to:

    ```bash
    http://localhost:3000
    ```

### Development

For development mode with live-reload (using `nodemon`):

```bash
npm run dev
```

### Folder Structure

```bash
.
├── models             # Mongoose models for Notes, Users, and Tags
├── routes             # Express routes for authentication, notes, tags
├── views              # Pug templates for the UI
├── public             # Static files (CSS, JS, images)
├── controllers        # Controller logic for handling requests
├── middleware         # Custom middleware functions (e.g., authentication)
├── logs               # Log files
└── app.js             # Main server file
```

<!--
Future Enhancements
Real-time Syncing: Add WebSocket or Firebase for real-time syncing across devices.
User Profiles: Add profile management and settings customization.
Note Sharing: Enable users to share notes with other users or publicly.
-->