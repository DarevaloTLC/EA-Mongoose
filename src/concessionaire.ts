import { Schema, Types, model } from 'mongoose';

// 1. Create an interface representing a TS object.
export interface IConcessionaire {
  name: string;
  email: string;
  direction: string;
  cars?: Types.ObjectId[];
  _id?: string;
}

// 2. Create a Schema corresponding to the document in MongoDB.
const concessionaireSchema = new Schema<IConcessionaire>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    direction: { type: String, required: true },
    cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }] // Definición de la lista de coches
  });

// 3. Create a Model.
export const ConcessionaireModel = model('Concessionaire', concessionaireSchema);