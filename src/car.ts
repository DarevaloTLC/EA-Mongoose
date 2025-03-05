import { Schema, model } from 'mongoose';

// 1. Create an interface representing a TS object.
export interface ICar {
  brand: string;
  model: string;
  description?: string;
  _id?: string;
}

// 2. Create a Schema corresponding to the document in MongoDB.
const carSchema = new Schema<ICar>({
  brand: { type: String, required: true },
  model: { type: String, required: true },
});

// 3. Create a Model.
export const CarModel = model('Car', carSchema);