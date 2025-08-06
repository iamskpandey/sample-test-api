import Sample from '../models/Sample.model';
import type { ISample } from '../models/Sample.model';
import '../models/Hospital.model';
import { SampleStatus } from '../models/Sample.model';

export const createSample = async (sampleData: Partial<ISample>): Promise<ISample> => {
  try {
    const newSample = await Sample.create(sampleData);
    if (!newSample) {
      throw new Error('Sample creation failed.');
    }
    return newSample;
  } catch (error) {
    console.error('Error creating sample:', error);
    throw error; 
  }
};

export const getSamplesByAgent = async (agentId: string): Promise<ISample[]> => {
  try {
    const samples = await Sample.find({ assignedAgentId: agentId })
      .populate('hospitalId', 'name address contactPerson'); 

    return samples;
  } catch (error) {
    console.error('Error fetching samples by agent:', error);
    throw error;
  }
};

export const collectSample = async (sampleId: string): Promise<ISample> => {
  try {
    const sample = await Sample.findById(sampleId);

    if (!sample) {
      throw new Error('Sample not found.');
    }

    if (sample.status === SampleStatus.COLLECTED) {
      throw new Error('Sample has already been collected.');
    }

    sample.status = SampleStatus.COLLECTED;
    sample.collectionTime = new Date();
    
    await sample.save();

    return sample;
  } catch (error) {
    console.error('Error collecting sample:', error);
    throw error; 
  }
};