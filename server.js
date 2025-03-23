const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://pokemon-card-creator.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log('Connected to database:', process.env.MONGODB_URI.split('/').pop());
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Connection string:', process.env.MONGODB_URI);
  });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)){
      fs.mkdirSync(uploadsDir);
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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

const Card = mongoose.model('Card', cardSchema);
const CardDesign = mongoose.model('CardDesign', cardDesignSchema);

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
    const designs = await CardDesign.find();
    console.log('Found designs:', designs.length);
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
    await CardDesign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Card Routes
app.post('/api/cards', upload.single('image'), async (req, res) => {
  try {
    const card = new Card({
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find()
      .populate('cardDesign')
      .sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Delete the image file if it exists
    if (card.image) {
      const imagePath = path.join(__dirname, card.image);
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Serve static files from React build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 