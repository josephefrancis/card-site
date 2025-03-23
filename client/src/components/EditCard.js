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
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchCard();
    fetchDesigns();
  }, [id]);

  const fetchCard = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards/${id}`);
      const card = response.data;
      setFormData({
        name: card.name,
        type: card.type,
        hp: card.hp,
        attack: card.attack,
        defense: card.defense,
        specialAttack: card.specialAttack,
        specialDefense: card.specialDefense,
        speed: card.speed,
        cardDesign: card.cardDesign?._id || '',
        image: null,
      });
      setCurrentImage(card.image);
      setPreview(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/files/${card.image}`);
    } catch (error) {
      console.error('Error fetching card:', error);
      alert('Error fetching card details. Please try again.');
      navigate('/gallery');
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
      if (key === 'image' && !formData[key]) {
        // If no new image is selected, keep the current image
        return;
      }
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cards/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Card updated successfully!');
      navigate('/gallery');
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Error updating card. Please try again.');
    }
  };

  const getCardStyle = () => {
    if (!selectedDesign) return {};
    
    const styles = selectedDesign.styles;
    return {
      background: styles.gradientColors.length > 1
        ? `linear-gradient(45deg, ${styles.gradientColors.join(', ')})`
        : styles.background,
      borderColor: styles.borderColor,
      borderWidth: `${styles.borderWidth}px`,
      borderStyle: styles.borderStyle,
      borderRadius: `${styles.borderRadius}px`,
      boxShadow: `0 0 ${styles.shadowBlur}px ${styles.shadowColor}`,
      padding: '20px',
      color: styles.textColor,
    };
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

            {selectedDesign && (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, ...getCardStyle() }}>
                  <Typography variant="h5" sx={{ color: selectedDesign.styles.titleColor }}>
                    Card Preview
                  </Typography>
                  <Box sx={{ mt: 2, bgcolor: selectedDesign.styles.statsBgColor, p: 2, borderRadius: '5px' }}>
                    <Typography>Name: {formData.name || 'Your Card Name'}</Typography>
                    <Typography>Type: {formData.type || 'Card Type'}</Typography>
                    <Typography>HP: {formData.hp || '0'}</Typography>
                    <Typography>Attack: {formData.attack || '0'}</Typography>
                    <Typography>Defense: {formData.defense || '0'}</Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

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