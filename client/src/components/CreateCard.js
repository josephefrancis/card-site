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

function CreateCard() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    hp: '',
    attack: '',
    defense: '',
    specialAttack: '',
    specialDefense: '',
    speed: '',
    cardDesign: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs`);
      setDesigns(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError('Failed to load card designs');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'cardDesign') {
      const design = designs.find(d => d._id === value);
      setSelectedDesign(design);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards`, formDataToSend);
      alert('Card created successfully!');
      setFormData({
        name: '',
        type: '',
        hp: '',
        attack: '',
        defense: '',
        specialAttack: '',
        specialDefense: '',
        speed: '',
        cardDesign: '',
        image: null,
      });
      setPreview(null);
      setSelectedDesign(null);
    } catch (error) {
      console.error('Error creating card:', error);
      setError('Failed to create card');
    }
  };

  const getCardStyle = () => {
    if (!selectedDesign?.styles) return {};
    
    const styles = selectedDesign.styles;
    return {
      background: styles.background || '#ffffff',
      border: `${styles.borderWidth || 2}px ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000000'}`,
      borderRadius: `${styles.borderRadius || 8}px`,
      boxShadow: `0 0 ${styles.shadowBlur || 4}px ${styles.shadowColor || 'rgba(0,0,0,0.2)'}`,
      padding: '20px',
      color: styles.textColor || '#000000',
    };
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Your Pokémon Card
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
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
                value={formData.hp}
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
                value={formData.attack}
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
                value={formData.defense}
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
                value={formData.specialAttack}
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
                value={formData.specialDefense}
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
                value={formData.speed}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Card Design</InputLabel>
                <Select
                  name="cardDesign"
                  value={formData.cardDesign}
                  onChange={handleChange}
                  label="Card Design"
                  required
                >
                  {Array.isArray(designs) && designs.map((design) => (
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
                Upload Image
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
                Create Card
              </Button>
            </Grid>
          </Grid>
        </form>

        {selectedDesign && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Paper elevation={3} sx={{ p: 3, ...getCardStyle() }}>
              <Typography variant="h5" gutterBottom>
                {formData.name || 'Card Name'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Type: {formData.type || 'Type'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>HP: {formData.hp || '0'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Attack: {formData.attack || '0'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Defense: {formData.defense || '0'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Speed: {formData.speed || '0'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Sp. Atk: {formData.specialAttack || '0'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Sp. Def: {formData.specialDefense || '0'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default CreateCard; 