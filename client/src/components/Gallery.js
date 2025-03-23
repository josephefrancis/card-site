import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function Gallery() {
  const [cards, setCards] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    fetchCards();
    fetchDesigns();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const fetchDesigns = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs`);
      setDesigns(response.data);
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  const handleDeleteClick = (card) => {
    setCardToDelete(card);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cardToDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards/${cardToDelete._id}`);
      setCards(cards.filter(card => card._id !== cardToDelete._id));
      setDeleteDialogOpen(false);
      setCardToDelete(null);
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error deleting card. Please try again.');
    }
  };

  const filteredCards = cards.filter((card) => {
    if (filter === 'all') return true;
    return card.cardDesign?._id === filter;
  });

  const getCardStyle = (design) => {
    if (!design?.styles) return {};
    
    const styles = design.styles;
    return {
      background: styles.gradientColors.length > 1
        ? `linear-gradient(45deg, ${styles.gradientColors.join(', ')})`
        : styles.background,
      borderColor: styles.borderColor,
      borderWidth: `${styles.borderWidth}px`,
      borderStyle: styles.borderStyle,
      borderRadius: `${styles.borderRadius}px`,
      boxShadow: `0 0 ${styles.shadowBlur}px ${styles.shadowColor}`,
      height: '100%',
      color: styles.textColor,
      position: 'relative',
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Card Gallery</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Design</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter by Design"
            >
              <MenuItem value="all">All Cards</MenuItem>
              {designs.map((design) => (
                <MenuItem key={design._id} value={design._id}>
                  {design.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {filteredCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card._id}>
              <Card sx={getCardStyle(card.cardDesign)}>
                <Box sx={{ position: 'relative' }}>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                    onClick={() => handleDeleteClick(card)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {card.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${card.image}`}
                      alt={card.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                  )}
                </Box>
                <CardContent>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="div"
                    sx={{ 
                      color: card.cardDesign?.styles?.titleColor || 'inherit',
                      fontWeight: card.cardDesign?.styles?.titleFontWeight || 'normal',
                      fontSize: card.cardDesign?.styles?.titleSize || '24px',
                      textAlign: card.cardDesign?.styles?.titleAlignment || 'left',
                    }}
                  >
                    {card.name}
                  </Typography>
                  <Box sx={{ 
                    bgcolor: card.cardDesign?.styles?.statsBgColor || 'rgba(0,0,0,0.1)', 
                    p: 2, 
                    borderRadius: '5px',
                    mt: 2
                  }}>
                    <Typography 
                      variant="body2"
                      sx={{
                        fontWeight: card.cardDesign?.styles?.textFontWeight || 'normal',
                        fontSize: card.cardDesign?.styles?.textSize || '16px',
                      }}
                    >
                      Type: {card.type}
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      {[
                        { label: 'HP', value: card.hp },
                        { label: 'Attack', value: card.attack },
                        { label: 'Defense', value: card.defense },
                        { label: 'Speed', value: card.speed },
                        { label: 'Sp. Attack', value: card.specialAttack },
                        { label: 'Sp. Defense', value: card.specialDefense },
                      ].map((stat) => (
                        <Grid item xs={6} key={stat.label}>
                          <Typography 
                            variant="body2"
                            sx={{
                              fontWeight: card.cardDesign?.styles?.textFontWeight || 'normal',
                              fontSize: card.cardDesign?.styles?.textSize || '16px',
                            }}
                          >
                            {stat.label}: {stat.value}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2, 
                      fontStyle: 'italic',
                      fontWeight: card.cardDesign?.styles?.textFontWeight || 'normal',
                      fontSize: card.cardDesign?.styles?.textSize || '16px',
                    }}
                  >
                    Design: {card.cardDesign?.name || 'Default'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Card</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{cardToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Gallery; 