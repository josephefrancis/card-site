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

  const getCardStyle = (design) => {
    if (!design) return {};
    return {
      background: design.styles.background,
      border: `${design.styles.borderWidth}px ${design.styles.borderStyle} ${design.styles.borderColor}`,
      borderRadius: `${design.styles.borderRadius}px`,
      color: design.styles.textColor,
      boxShadow: `0 0 ${design.styles.shadowBlur}px ${design.styles.shadowColor}`,
      '& .MuiCardMedia-root': {
        borderTopLeftRadius: `${design.styles.borderRadius}px`,
        borderTopRightRadius: `${design.styles.borderRadius}px`,
      },
      '& .card-title': {
        color: design.styles.titleColor,
        fontWeight: design.styles.titleFontWeight,
        textAlign: design.styles.titleAlignment,
        fontSize: design.styles.titleSize,
      },
      '& .card-text': {
        fontWeight: design.styles.textFontWeight,
        fontSize: design.styles.textSize,
      },
      '& .stats-container': {
        backgroundColor: design.styles.statsBgColor,
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
              <Card sx={getCardStyle(card.cardDesign)}>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    zIndex: 1,
                    display: 'flex',
                    gap: 1,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    borderRadius: '4px',
                    p: 0.5
                  }}>
                    <IconButton
                      onClick={() => handleEditClick(card)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(card)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {card.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/files/${card.image}`}
                      alt={card.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                  )}
                </Box>
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    {card.name}
                  </Typography>
                  <Typography variant="body2" className="card-text">
                    Type: {card.type}
                  </Typography>
                  <Box className="stats-container" sx={{ mt: 2, p: 2, borderRadius: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2">HP: {card.hp}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Attack: {card.attack}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Defense: {card.defense}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Speed: {card.speed}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Sp. Atk: {card.specialAttack}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Sp. Def: {card.specialDefense}</Typography>
                      </Grid>
                    </Grid>
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
          Are you sure you want to delete this card?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Gallery; 