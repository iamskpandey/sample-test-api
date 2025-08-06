import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import Agent from '../models/Agent.model';
import type { IAgent } from '../models/Agent.model';


interface DecodedAgentPayload extends JwtPayload {
  agent: {
    id: string;
    name: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      agent?: IAgent;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token:string;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;
      if (typeof jwtSecret !== 'string' || !jwtSecret.trim()) {
        throw new Error('JWT Secret not found or invalid');
      }

      if (!jwtSecret) {
        throw new Error('JWT Secret not found or invalid');
      }
      const decoded = jwt.verify(token, jwtSecret) as unknown as DecodedAgentPayload;

      if (decoded && typeof decoded === 'object' && 'agent' in decoded) {
        req.agent = await Agent.findById(decoded.agent.id).select('-password');
        
        if (!req.agent) {
          return res.status(401).json({ success: false, message: 'Not authorized, agent not found' });
        }
        
        next();
      } else {
        throw new Error('Invalid token payload');
      }

    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};