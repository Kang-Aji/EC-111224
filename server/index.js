import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { initDb, getDb } from './db.js';
import { fetchNewsArticles } from './newsService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Enable CORS with specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// API endpoints
app.get('/api/articles', async (req, res, next) => {
  try {
    const articles = await fetchNewsArticles();
    res.json(articles || []);
  } catch (error) {
    next(error);
  }
});

app.get('/api/trending', async (req, res, next) => {
  try {
    const db = await getDb();
    const officials = await db.all(
      'SELECT * FROM officials ORDER BY mentions_count DESC LIMIT 5'
    );
    res.json(officials || []);
  } catch (error) {
    next(error);
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    await initDb();
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Update articles every 5 minutes
    setInterval(async () => {
      try {
        await fetchNewsArticles();
      } catch (error) {
        console.error('Error updating articles:', error);
      }
    }, 300000);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

startServer();