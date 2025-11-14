import { Router, Request, Response } from 'express';
import { portfolioService } from '../services/portfolioService';
import { InvestmentInput } from '../../../shared/types';

export const portfolioRouter = Router();

portfolioRouter.post('/calculate', (req: Request, res: Response) => {
  try {
    const input: InvestmentInput = req.body;
    
    // Validate input
    if (!input.investmentAmount || input.investmentAmount <= 0) {
      return res.status(400).json({ error: 'Invalid investment amount' });
    }
    
    if (!['Low', 'Moderate', 'High'].includes(input.riskLevel)) {
      return res.status(400).json({ error: 'Invalid risk level' });
    }
    
    if (![1, 2, 5, 10].includes(input.timeline)) {
      return res.status(400).json({ error: 'Invalid timeline' });
    }
    
    const result = portfolioService.calculatePortfolio(input);
    res.json(result);
  } catch (error) {
    console.error('Error calculating portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

