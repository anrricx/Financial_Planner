import { Router, Request, Response } from 'express';
import { allocationService } from '../services/allocationService';
import { returnCalculator } from '../services/returnCalculator';

export const planRouter = Router();

interface PlanRequest {
  amount: number;
  riskScore: number;
  monthlyContribution?: number;
  expectedReturn?: number;
  timeHorizon?: number;
}

// Helper function to ensure JSON response is always sent
const sendJsonResponse = (res: Response, status: number, data: any): void => {
  try {
    res.status(status).json(data);
  } catch (jsonError) {
    // If JSON.stringify fails, send a safe error response
    console.error('Failed to send JSON response:', jsonError);
    try {
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to format response'
      });
    } catch (fallbackError) {
      // Last resort - this should never happen, but ensures we don't crash silently
      console.error('Critical: Failed to send any response', fallbackError);
    }
  }
};

planRouter.post('/', (req: Request, res: Response): void => {
  // Wrap everything in try-catch to prevent silent crashes
  try {
    // Ensure we always send JSON response
    if (!req.body || typeof req.body !== 'object') {
      return sendJsonResponse(res, 400, { 
        error: 'Request body is required',
        message: 'Please provide amount and riskScore in the request body'
      });
    }

    const { amount, riskScore }: PlanRequest = req.body;
    
    // Validate amount
    if (amount === undefined || amount === null) {
      return sendJsonResponse(res, 400, { 
        error: 'Invalid request',
        message: 'Amount is required'
      });
    }

    if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount) || amount <= 0) {
      return sendJsonResponse(res, 400, { 
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      });
    }
    
    // Validate riskScore
    if (riskScore === undefined || riskScore === null) {
      return sendJsonResponse(res, 400, { 
        error: 'Invalid request',
        message: 'Risk score is required'
      });
    }

    if (typeof riskScore !== 'number' || isNaN(riskScore) || !isFinite(riskScore)) {
      return sendJsonResponse(res, 400, { 
        error: 'Invalid risk score',
        message: 'Risk score must be a number'
      });
    }

    if (riskScore < 1 || riskScore > 10 || !Number.isInteger(riskScore)) {
      return sendJsonResponse(res, 400, { 
        error: 'Invalid risk score',
        message: 'Risk score must be an integer between 1 and 10'
      });
    }

    // Map riskScore to risk level: 1-3 = low, 4-7 = moderate, 8-10 = high
    let normalizedRisk: 'low' | 'moderate' | 'high';
    if (riskScore <= 3) {
      normalizedRisk = 'low';
    } else if (riskScore <= 7) {
      normalizedRisk = 'moderate';
    } else {
      normalizedRisk = 'high';
    }
    
    // Step 1: Get portfolio allocation
    let allocations;
    try {
      allocations = allocationService.getPortfolioAllocation(
        amount,
        normalizedRisk as 'low' | 'moderate' | 'high'
      );
    } catch (allocError) {
      console.error('Error getting allocations:', allocError);
      return sendJsonResponse(res, 500, {
        error: 'Failed to calculate allocations',
        message: allocError instanceof Error ? allocError.message : 'Unknown allocation error'
      });
    }
    
    // Step 2: Compute weighted expected return
    let weightedReturnRate;
    try {
      const allocationForWeighted = allocations.map(alloc => ({
        ticker: alloc.ticker,
        percentage: alloc.percentage
      }));
      
      weightedReturnRate = returnCalculator.calculateWeightedReturnRate(allocationForWeighted);
    } catch (weightedError) {
      console.error('Error calculating weighted return:', weightedError);
      return sendJsonResponse(res, 500, {
        error: 'Failed to calculate weighted return',
        message: weightedError instanceof Error ? weightedError.message : 'Unknown weighted return error'
      });
    }
    
    // Step 3: Get yearly projections
    let projections;
    try {
      projections = returnCalculator.getYearlyProjections(amount, weightedReturnRate);
    } catch (projectionError) {
      console.error('Error calculating projections:', projectionError);
      return sendJsonResponse(res, 500, {
        error: 'Failed to calculate projections',
        message: projectionError instanceof Error ? projectionError.message : 'Unknown projection error'
      });
    }
    
    // Step 4: Calculate monthly contribution projections if provided
    let monthlyContributionResult = null;
    if (req.body.monthlyContribution && req.body.monthlyContribution > 0 && 
        req.body.expectedReturn !== undefined && req.body.timeHorizon !== undefined) {
      try {
        const monthlyContribution = req.body.monthlyContribution;
        const expectedReturnPercent = req.body.expectedReturn;
        const timeHorizon = req.body.timeHorizon;

        if (typeof expectedReturnPercent !== 'number' || isNaN(expectedReturnPercent) || 
            expectedReturnPercent < 0 || expectedReturnPercent > 100) {
          return sendJsonResponse(res, 400, {
            error: 'Invalid expected return',
            message: 'Expected return must be a number between 0 and 100'
          });
        }

        const expectedReturn = expectedReturnPercent / 100; // Convert percentage to decimal

        if (timeHorizon < 1 || timeHorizon > 50 || !Number.isInteger(timeHorizon)) {
          return sendJsonResponse(res, 400, {
            error: 'Invalid time horizon',
            message: 'Time horizon must be an integer between 1 and 50 years'
          });
        }

        monthlyContributionResult = returnCalculator.calculateWithMonthlyContributions(
          amount,
          monthlyContribution,
          expectedReturn,
          timeHorizon
        );
      } catch (monthlyError) {
        console.error('Error calculating monthly contributions:', monthlyError);
        return sendJsonResponse(res, 500, {
          error: 'Failed to calculate monthly contribution projections',
          message: monthlyError instanceof Error ? monthlyError.message : 'Unknown monthly contribution error'
        });
      }
    }

    // Step 5: Return response - always JSON with exact structure
    const response: any = {
      allocations,
      expectedReturns: {
        1: projections['1yr'],
        2: projections['2yr'],
        5: projections['5yr'],
        10: projections['10yr']
      }
    };

    if (monthlyContributionResult) {
      response.monthlyContribution = monthlyContributionResult;
    }
    
    return sendJsonResponse(res, 200, response);
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error('Unexpected error in plan route:', error);
    
    // Always send JSON response, even on unexpected error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return sendJsonResponse(res, 500, { 
      error: 'Internal server error',
      message: errorMessage
    });
  }
});

