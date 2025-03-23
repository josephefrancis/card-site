const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://pokemon-card-creator.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
let gfs;
let gridfsBucket;

// Card Design Schema
const cardDesignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  styles: {
    background: String,
    borderColor: String,
    borderWidth: Number,
    borderStyle: String,
    borderRadius: Number,
    titleColor: String,
    textColor: String,
    statsBgColor: String,
    gradientColors: [String],
    shadowColor: String,
    shadowBlur: Number,
    customCSS: String,
    titleFontWeight: {
      type: String,
      default: 'normal'
    },
    titleAlignment: {
      type: String,
      default: 'left'
    },
    titleSize: {
      type: String,
      default: '24px'
    },
    textFontWeight: {
      type: String,
      default: 'normal'
    },
    textSize: {
      type: String,
      default: '16px'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Card Schema
const cardSchema = new mongoose.Schema({
  name: String,
  image: String,
  type: String,
  hp: Number,
  attack: Number,
  defense: Number,
  specialAttack: Number,
  specialDefense: Number,
  speed: Number,
  cardDesign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardDesign'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Initialize models
const Card = mongoose.model('Card', cardSchema);
const CardDesign = mongoose.model('CardDesign', cardDesignSchema);

// Configure multer for GridFS storage
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

const upload = multer({ storage });

// API Routes
// Card Design Routes
app.post('/api/card-designs', async (req, res) => {
  try {
    console.log('Received card design creation request:', req.body);
    const design = new CardDesign(req.body);
    await design.save();
    console.log('Card design saved successfully:', design);
    res.status(201).json(design);
  } catch (error) {
    console.error('Error saving card design:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/card-designs', async (req, res) => {
  try {
    console.log('Fetching all card designs');
    const designs = await CardDesign.find().sort({ createdAt: -1 });
    console.log('Found designs:', designs.length);
    console.log('Designs:', JSON.stringify(designs, null, 2));
    res.json(designs);
  } catch (error) {
    console.error('Error fetching card designs:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/card-designs/:id', async (req, res) => {
  try {
    console.log('Updating card design:', req.params.id);
    console.log('Update data:', req.body);
    const design = await CardDesign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log('Card design updated successfully:', design);
    res.json(design);
  } catch (error) {
    console.error('Error updating card design:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/card-designs/:id', async (req, res) => {
  try {
    const design = await CardDesign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Card Routes
app.post('/api/cards', upload.single('image'), async (req, res) => {
  try {
    console.log('Received card creation request:', req.body);
    console.log('File:', req.file);
    
    const cardData = {
      ...req.body,
      image: req.file ? req.file.filename : null
    };
    
    const card = new Card(cardData);
    await card.save();
    console.log('Card saved successfully:', card);
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/cards', async (req, res) => {
  try {
    console.log('Fetching all cards');
    const cards = await Card.find().populate('cardDesign').sort({ createdAt: -1 });
    console.log('Found cards:', cards.length);
    console.log('Cards:', JSON.stringify(cards, null, 2));
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single card by ID
app.get('/api/cards/:id', async (req, res) => {
  try {
    console.log('Fetching card with ID:', req.params.id);
    console.log('Request headers:', req.headers);
    console.log('Request query:', req.query);
    
    const card = await Card.findById(req.params.id)
      .populate({
        path: 'cardDesign',
        select: 'name styles' // Explicitly select the fields we need
      });
    
    if (!card) {
      console.log('Card not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Card not found' });
    }
    
    console.log('Found card:', JSON.stringify(card, null, 2));
    console.log('Card design:', JSON.stringify(card.cardDesign, null, 2));
    
    // Set CORS headers explicitly for this route
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Delete the image from GridFS if it exists
    if (card.image) {
      const file = await gfs.files.findOne({ filename: card.image });
      if (file) {
        await gridfsBucket.delete(file._id);
      }
    }

    await card.remove();
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a card
app.put('/api/cards/:id', upload.single('image'), async (req, res) => {
  try {
    const cardId = req.params.id;
    const updateData = { ...req.body };
    
    // If a new image is uploaded, update the image field
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      updateData,
      { new: true }
    ).populate('cardDesign');

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ message: 'Error updating card' });
  }
});

// Serve files from GridFS
app.get('/api/files/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    const downloadStream = gridfsBucket.openDownloadStream(file._id);
    res.set('Content-Type', file.contentType);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize MongoDB connection and start server
const initializeServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB successfully');

    // Initialize GridFS
    const conn = mongoose.connection;
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('GridFS initialized successfully');

    // Start server after successful connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Initialize the server
initializeServer();

// Serve static files from React build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} 