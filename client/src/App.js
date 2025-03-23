import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import CreateCard from './components/CreateCard';
import Gallery from './components/Gallery';
import DesignEditor from './components/DesignEditor';

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
            <Route path="/" element={<CreateCard />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/design-editor" element={<DesignEditor />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 