import type { Request, Response } from 'express';
import Agent from '../models/Agent.model';
import jwt from 'jsonwebtoken';

export const registerAgent = async (req: Request, res: Response) => {
  const { name, employeeId, email, password, phone } = req.body;

  try {
    let agent = await Agent.findOne({ email });
    if (agent) {
      return res.status(400).json({ success: false, message: 'Agent with this email already exists.' });
    }

    agent = new Agent({ name, employeeId, email, password, phone });
    await agent.save();
    
    res.status(201).json({ success: true, message: 'Agent registered successfully.' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error});
  }
};


export const loginAgent = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const agent = await Agent.findOne({ email }).select('+password');
    if (!agent) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await agent.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const payload = {
      agent: {
        id: agent.id, 
        name: agent.name
      },
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('WT_SECRET is not defined.');
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '8h' }, 
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ success: true, token });
      }
    );

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: error });
  }
};