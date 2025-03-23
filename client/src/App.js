import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CreateCard from './components/CreateCard';
import Gallery from './components/Gallery';
import DesignEditor from './components/DesignEditor';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<CreateCard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/design-editor" element={<DesignEditor />} />
          <Route path="/edit-card/:id" element={<CreateCard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 