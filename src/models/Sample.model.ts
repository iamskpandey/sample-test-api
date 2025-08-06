import { Schema, model, Document, Types } from 'mongoose';

export enum SampleStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  COLLECTED = 'Collected',
  DELAYED = 'Delayed'
}

export enum SamplePriority {
  ROUTINE = 'Routine',
  URGENT = 'Urgent',
  STAT = 'STAT' 
}

export interface ISample extends Document {
  patientName: string;
  hospitalId: Types.ObjectId; 
  sampleType: string;
  priority: SamplePriority;
  status: SampleStatus;
  assignedAgentId?: Types.ObjectId; 
  collectionTime?: Date;
  delayReason?: string;
}

const SampleSchema = new Schema<ISample>({
  patientName: { type: String, required: true, trim: true },
  hospitalId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true 
  },
  sampleType: { type: String, required: true },
  priority: { 
    type: String, 
    enum: Object.values(SamplePriority), 
    default: SamplePriority.ROUTINE 
  },
  status: { 
    type: String, 
    enum: Object.values(SampleStatus), 
    default: SampleStatus.PENDING 
  },
  assignedAgentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Agent' 
  },
  collectionTime: { type: Date },
  delayReason: { type: String },
}, { timestamps: true });

const Sample = model<ISample>('Sample', SampleSchema);
export default Sample;