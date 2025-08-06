import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAgent extends Document {
  name: string;
  email: string;
  password?: string; 
  phone: string;
  comparePassword(password: string): Promise<boolean>;
}

const AgentSchema = new Schema<IAgent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, 
  phone: { type: String, required: true },
}, 
{ timestamps: true });

AgentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

AgentSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Agent = model<IAgent>('Agent', AgentSchema);
export default Agent;