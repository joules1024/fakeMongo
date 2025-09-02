import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';

const port = process.env.PORT || 3001;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', sandbox: process.env.USE_FAKE_DB === "true" });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 API ejecutándose en http://localhost:${port}`);
});
