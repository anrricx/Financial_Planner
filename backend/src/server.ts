import express from 'express';
import cors from 'cors';
import { portfolioRouter } from './routes/portfolio';
import { planRouter } from './routes/plan';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - order matters
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRouter);
app.use('/api/plan', planRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

