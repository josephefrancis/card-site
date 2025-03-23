import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Slider,
  InputLabel,
  IconButton,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { SketchPicker } from 'react-color';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

function DesignEditor() {
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [previewCard] = useState({
    name: 'Preview Card',
    type: 'Example Type',
    hp: 100,
    attack: 80,
    defense: 70,
    specialAttack: 90,
    specialDefense: 85,
    speed: 75,
  });

  const [formData, setFormData] = useState({
    name: '',
    styles: {
      background: '#ffffff',
      borderColor: '#000000',
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 10,
      titleColor: '#000000',
      textColor: '#000000',
      statsBgColor: '#f5f5f5',
      gradientColors: ['#ffffff', '#f0f0f0'],
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 10,
      customCSS: '',
      titleFontWeight: 'normal',
      titleAlignment: 'left',
      titleSize: '24px',
      textFontWeight: 'normal',
      textSize: '16px'
    }
  });

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs`);
      setDesigns(response.data);
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Starting to save design...');
      const dataToSend = {
        ...formData,
        styles: {
          ...formData.styles,
          titleSize: formData.styles.titleSize.toString().includes('px') 
            ? formData.styles.titleSize 
            : `${formData.styles.titleSize}px`,
          textSize: formData.styles.textSize.toString().includes('px') 
            ? formData.styles.textSize 
            : `${formData.styles.textSize}px`,
          titleFontWeight: formData.styles.titleFontWeight || 'normal',
          textFontWeight: formData.styles.textFontWeight || 'normal',
          titleAlignment: formData.styles.titleAlignment || 'left'
        }
      };
      console.log('Data to send:', dataToSend);
      console.log('API URL:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs`);

      if (selectedDesign) {
        console.log('Updating existing design...');
        await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs/${selectedDesign._id}`, dataToSend);
      } else {
        console.log('Creating new design...');
        const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs`, dataToSend);
        console.log('Response:', response.data);
      }
      console.log('Design saved successfully');
      fetchDesigns();
      resetForm();
    } catch (error) {
      console.error('Error saving design:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/card-designs/${id}`);
      fetchDesigns();
    } catch (error) {
      console.error('Error deleting design:', error);
    }
  };

  const resetForm = () => {
    setSelectedDesign(null);
    setFormData({
      name: '',
      styles: {
        background: '#ffffff',
        borderColor: '#000000',
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 10,
        titleColor: '#000000',
        textColor: '#000000',
        statsBgColor: '#f5f5f5',
        gradientColors: ['#ffffff', '#f0f0f0'],
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowBlur: 10,
        customCSS: '',
        titleFontWeight: 'normal',
        titleAlignment: 'left',
        titleSize: '24px',
        textFontWeight: 'normal',
        textSize: '16px'
      }
    });
  };

  const getPreviewStyle = () => ({
    background: formData.styles.gradientColors.length > 1
      ? `linear-gradient(45deg, ${formData.styles.gradientColors.join(', ')})`
      : formData.styles.background,
    borderColor: formData.styles.borderColor,
    borderWidth: `${formData.styles.borderWidth}px`,
    borderStyle: formData.styles.borderStyle,
    borderRadius: `${formData.styles.borderRadius}px`,
    boxShadow: `0 0 ${formData.styles.shadowBlur}px ${formData.styles.shadowColor}`,
    padding: '20px',
    margin: '20px 0',
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Card Design Editor
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Design Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>Background Colors</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {formData.styles.gradientColors.map((color, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <SketchPicker
                          color={color}
                          onChange={(color) => {
                            const newColors = [...formData.styles.gradientColors];
                            newColors[index] = color.hex;
                            handleChange('gradientColors', newColors);
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            const newColors = formData.styles.gradientColors.filter((_, i) => i !== index);
                            handleChange('gradientColors', newColors);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    {formData.styles.gradientColors.length < 4 && (
                      <IconButton
                        onClick={() => {
                          handleChange('gradientColors', [...formData.styles.gradientColors, '#ffffff']);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <InputLabel>Border Color</InputLabel>
                  <SketchPicker
                    color={formData.styles.borderColor}
                    onChange={(color) => handleChange('borderColor', color.hex)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InputLabel>Border Width</InputLabel>
                  <Slider
                    value={formData.styles.borderWidth}
                    onChange={(_, value) => handleChange('borderWidth', value)}
                    min={0}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InputLabel>Border Radius</InputLabel>
                  <Slider
                    value={formData.styles.borderRadius}
                    onChange={(_, value) => handleChange('borderRadius', value)}
                    min={0}
                    max={30}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InputLabel>Shadow Blur</InputLabel>
                  <Slider
                    value={formData.styles.shadowBlur}
                    onChange={(_, value) => handleChange('shadowBlur', value)}
                    min={0}
                    max={30}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Title Styling
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.styles.titleFontWeight === 'bold'}
                          onChange={(e) => handleChange('titleFontWeight', e.target.checked ? 'bold' : 'normal')}
                        />
                      }
                      label="Bold Title"
                    />
                    <FormControl fullWidth>
                      <InputLabel>Title Alignment</InputLabel>
                      <Select
                        value={formData.styles.titleAlignment}
                        onChange={(e) => handleChange('titleAlignment', e.target.value)}
                        label="Title Alignment"
                      >
                        <MenuItem value="left">Left</MenuItem>
                        <MenuItem value="center">Center</MenuItem>
                        <MenuItem value="right">Right</MenuItem>
                      </Select>
                    </FormControl>
                    <Box>
                      <InputLabel>Title Size</InputLabel>
                      <Slider
                        value={parseInt(formData.styles.titleSize)}
                        onChange={(_, value) => handleChange('titleSize', `${value}px`)}
                        min={16}
                        max={48}
                        step={1}
                        marks={[
                          { value: 16, label: '16px' },
                          { value: 24, label: '24px' },
                          { value: 32, label: '32px' },
                          { value: 48, label: '48px' },
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Text Styling
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.styles.textFontWeight === 'bold'}
                          onChange={(e) => handleChange('textFontWeight', e.target.checked ? 'bold' : 'normal')}
                        />
                      }
                      label="Bold Text"
                    />
                    <Box>
                      <InputLabel>Text Size</InputLabel>
                      <Slider
                        value={parseInt(formData.styles.textSize)}
                        onChange={(_, value) => handleChange('textSize', `${value}px`)}
                        min={12}
                        max={24}
                        step={1}
                        marks={[
                          { value: 12, label: '12px' },
                          { value: 16, label: '16px' },
                          { value: 20, label: '20px' },
                          { value: 24, label: '24px' },
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Custom CSS"
                    value={formData.styles.customCSS}
                    onChange={(e) => handleChange('customCSS', e.target.value)}
                    placeholder="Enter additional CSS rules"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    {selectedDesign ? 'Update Design' : 'Save Design'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Preview
            </Typography>
            <Box sx={getPreviewStyle()}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: formData.styles.titleColor,
                  fontWeight: formData.styles.titleFontWeight,
                  fontSize: formData.styles.titleSize,
                  textAlign: formData.styles.titleAlignment,
                }}
              >
                {previewCard.name}
              </Typography>
              <Typography 
                sx={{ 
                  color: formData.styles.textColor,
                  fontWeight: formData.styles.textFontWeight,
                  fontSize: formData.styles.textSize,
                }}
              >
                Type: {previewCard.type}
              </Typography>
              <Box sx={{ mt: 2, bgcolor: formData.styles.statsBgColor, p: 2, borderRadius: '5px' }}>
                {[
                  { label: 'HP', value: previewCard.hp },
                  { label: 'Attack', value: previewCard.attack },
                  { label: 'Defense', value: previewCard.defense },
                  { label: 'Sp. Attack', value: previewCard.specialAttack },
                  { label: 'Sp. Defense', value: previewCard.specialDefense },
                  { label: 'Speed', value: previewCard.speed }
                ].map((stat, index) => (
                  <Typography 
                    key={index}
                    sx={{ 
                      color: formData.styles.textColor,
                      fontWeight: formData.styles.textFontWeight,
                      fontSize: formData.styles.textSize,
                    }}
                  >
                    {stat.label}: {stat.value}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Saved Designs
            </Typography>
            <Grid container spacing={2}>
              {designs.map((design) => (
                <Grid item xs={12} key={design._id}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  >
                    <Typography>{design.name}</Typography>
                    <Box>
                      <Button
                        onClick={() => {
                          setSelectedDesign(design);
                          setFormData(design);
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(design._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DesignEditor; 