import { Schema, model, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  address: string;
  contactPerson: string;
}

const HospitalSchema = new Schema<IHospital>({
  name: { 
    type: String, 
    required: [true, 'Hospital name is required'], 
    trim: true 
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'] 
  },
  contactPerson: { 
    type: String, 
    required: [true, 'Contact person is required'] 
  },
}, {
  timestamps: true 
});

const Hospital = model<IHospital>('Hospital', HospitalSchema);
export default Hospital;