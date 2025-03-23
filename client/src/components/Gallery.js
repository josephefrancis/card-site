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
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Gallery() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsResponse, designsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards`),
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs`)
        ]);

        setCards(Array.isArray(cardsResponse.data) ? cardsResponse.data : []);
        setDesigns(Array.isArray(designsResponse.data) ? designsResponse.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load cards and designs');
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (card) => {
    setCardToDelete(card);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards/${cardToDelete._id}`);
      setCards(cards.filter(card => card._id !== cardToDelete._id));
      setDeleteDialogOpen(false);
      setCardToDelete(null);
    } catch (error) {
      console.error('Error deleting card:', error);
      setError('Failed to delete card');
    }
  };

  const handleEditClick = (card) => {
    navigate(`/edit-card/${card._id}`);
  };

  const filteredCards = cards.filter((card) => {
    if (filter === 'all') return true;
    return card.cardDesign && card.cardDesign._id === filter;
  });

  const getCardStyle = (card) => {
    if (!card.cardDesign?.styles) return {};
    
    const styles = card.cardDesign.styles;
    return {
      background: styles.gradientColors?.length > 1
        ? `linear-gradient(45deg, ${styles.gradientColors.join(', ')})`
        : styles.background || '#ffffff',
      border: `${styles.borderWidth || 2}px ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000000'}`,
      borderRadius: `${styles.borderRadius || 8}px`,
      boxShadow: `0 0 ${styles.shadowBlur || 4}px ${styles.shadowColor || 'rgba(0,0,0,0.2)'}`,
      padding: '20px',
      color: styles.textColor || '#000000',
      '& .card-title': {
        color: styles.titleColor || '#000000',
        fontWeight: styles.titleFontWeight || 'normal',
        textAlign: styles.titleAlignment || 'left',
        fontSize: styles.titleSize || '24px',
      },
      '& .card-text': {
        fontWeight: styles.textFontWeight || 'normal',
        fontSize: styles.textSize || '16px',
      },
      '& .stats-container': {
        backgroundColor: styles.statsBgColor || '#f5f5f5',
      },
    };
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

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
              {Array.isArray(designs) && designs.map((design) => (
                <MenuItem key={design._id} value={design._id}>
                  {design.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {Array.isArray(filteredCards) && filteredCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card._id}>
              <Card sx={{ ...getCardStyle(card) }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/files/${card.image}`}
                  alt={card.name}
                />
                <CardContent>
                  <Typography className="card-title" variant="h5" gutterBottom>
                    {card.name}
                  </Typography>
                  <Typography className="card-text" variant="body1" gutterBottom>
                    Type: {card.type}
                  </Typography>
                  <Box className="stats-container" sx={{ mt: 2, p: 2, borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography className="card-text">HP: {card.hp}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className="card-text">Attack: {card.attack}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className="card-text">Defense: {card.defense}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className="card-text">Speed: {card.speed}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className="card-text">Sp. Atk: {card.specialAttack}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography className="card-text">Sp. Def: {card.specialDefense}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton onClick={() => handleEditClick(card._id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(card)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Card</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this card?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Gallery; 