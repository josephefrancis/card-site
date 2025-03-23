import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Single state object for the form
  const [card, setCard] = useState({
    name: '',
    type: '',
    hp: '',
    attack: '',
    defense: '',
    specialAttack: '',
    specialDefense: '',
    speed: '',
    cardDesign: '',
    image: null
  });

  const [designs, setDesigns] = useState([]);
  const [preview, setPreview] = useState(null);

  // Load card and designs data
  useEffect(() => {
    console.log('EditCard mounted with ID:', id);
    if (!id) {
      console.error('No card ID provided in route');
      navigate('/gallery');
      return;
    }
    const fetchData = async () => {
      try {
        console.log('Fetching card data for ID:', id);
        const cardRes = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards/${id}`);
        const cardData = cardRes.data;
        console.log('Received card data:', cardData);
        
        console.log('Fetching designs');
        const designsRes = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs`);
        console.log('Received designs:', designsRes.data);
        
        // Set the card data
        const cardState = {
          name: cardData.name || '',
          type: cardData.type || '',
          hp: cardData.hp?.toString() || '',
          attack: cardData.attack?.toString() || '',
          defense: cardData.defense?.toString() || '',
          specialAttack: cardData.specialAttack?.toString() || '',
          specialDefense: cardData.specialDefense?.toString() || '',
          speed: cardData.speed?.toString() || '',
          cardDesign: cardData.cardDesign?._id || '',
          image: null
        };
        console.log('Setting card state:', cardState);
        setCard(cardState);

        // Set the designs
        setDesigns(designsRes.data);

        // Set image preview if exists
        if (cardData.image) {
          const imageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/files/${cardData.image}`;
          console.log('Setting image preview:', imageUrl);
          setPreview(imageUrl);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading card data');
        navigate('/gallery');
      }
    };

    fetchData();
  }, [id, navigate]);

  // Add effect to log card state changes
  useEffect(() => {
    console.log('Card state updated:', card);
  }, [card]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', name, value);
    setCard(prev => {
      const newState = {
        ...prev,
        [name]: value
      };
      console.log('New card state:', newState);
      return newState;
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCard(prev => ({
        ...prev,
        image: file
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(card).forEach(key => {
      if (key === 'image' && !card[key]) return;
      formData.append(key, card[key]);
    });

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      alert('Card updated successfully!');
      navigate('/gallery');
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Error updating card');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Pokémon Card
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={card.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={card.type}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="HP"
                name="hp"
                value={card.hp}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Attack"
                name="attack"
                value={card.attack}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Defense"
                name="defense"
                value={card.defense}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Special Attack"
                name="specialAttack"
                value={card.specialAttack}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Special Defense"
                name="specialDefense"
                value={card.specialDefense}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Speed"
                name="speed"
                value={card.speed}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Card Design</InputLabel>
                <Select
                  name="cardDesign"
                  value={card.cardDesign}
                  onChange={handleChange}
                  label="Card Design"
                  required
                >
                  {designs.map((design) => (
                    <MenuItem key={design._id} value={design._id}>
                      {design.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Change Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {preview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Update Card
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default EditCard; 