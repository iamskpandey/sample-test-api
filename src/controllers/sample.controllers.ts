import type { Request, Response } from 'express';
import * as sampleService from '../services/sample.services';

export const addSample = async (req: Request, res: Response) => {
  try {
    const sampleData = req.body;
    
    const newSample = await sampleService.createSample(sampleData);

    res.status(201).json({
      success: true,
      message: 'Sample added successfully!',
      data: newSample,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add sample.',
      error: error,
    });
  }
};

export const getAgentSamples = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID is required.',
      });
    }

    const samples = await sampleService.getSamplesByAgent(agentId);

    if (!samples || samples.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No samples found for this agent.',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: samples,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch samples.',
      error: error
    });
  }
};

export const markSampleAsCollected = async (req: Request, res: Response) => {
  try {
    const { sampleId } = req.params;
    if (!sampleId) {
      return res.status(400).json({
        success: false,
        message: 'Sample ID is required.',
      });
    }

    const updatedSample = await sampleService.collectSample(sampleId);

    res.status(200).json({
      success: true,
      message: 'Sample marked as collected.',
      data: updatedSample,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Sample not found.') {
      return res.status(404).json({ success: false, message: error});
    }
    if (error instanceof Error && error.message === 'Sample has already been collected.') {
      return res.status(409).json({ success: false, message: error });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update sample.',
      error: error,
    });
  }
};