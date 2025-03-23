import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pokémon Card Creator
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Create Card
          </Button>
          <Button color="inherit" component={RouterLink} to="/gallery">
            Gallery
          </Button>
          <Button color="inherit" component={RouterLink} to="/design-editor">
            Card Designs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 