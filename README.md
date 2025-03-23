# Pokémon Card Creator

A web application that allows users to create custom Pokémon cards with different designs (normal, special, and shiny) and view them in a gallery.

## Features

- Create custom Pokémon cards with:
  - Name and type
  - Stats (HP, Attack, Defense, Special Attack, Special Defense, Speed)
  - Custom image upload
  - Different card designs (normal, special, shiny)
- View all created cards in a gallery
- Filter cards by design type
- Responsive design for all screen sizes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd pokemon-card-creator
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/pokemon-cards
PORT=5000
```

5. Create an `uploads` directory in the root folder:
```bash
mkdir uploads
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
npm run client
```

3. Open your browser and navigate to `http://localhost:3000`

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Multer (for file uploads)

## Project Structure

```
pokemon-card-creator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.js         # Main App component
│   └── package.json
├── uploads/               # Directory for uploaded images
├── server.js             # Express backend server
├── package.json          # Backend dependencies
└── README.md
``` 