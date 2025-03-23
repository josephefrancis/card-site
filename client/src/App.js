import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import CreateCard from './components/CreateCard';
import Gallery from './components/Gallery';
import DesignEditor from './components/DesignEditor';
import EditCard from './components/EditCard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#ffd700',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/create" element={<CreateCard />} />
            <Route path="/edit-card/:id" element={<EditCard />} />
            <Route path="/design-editor" element={<DesignEditor />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 