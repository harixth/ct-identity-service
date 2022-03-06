import { model, Schema } from "mongoose";

export const MONGODB_URL =
  "mongodb+srv://altruist:XWQvOM56LJB49Iqd@user.xk1ho.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// 1. Create an interface representing a document in MongoDB.
export interface Identity {
  email?: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  password: string;
  authToken: string;
  authCode: number;
  verifyExpiry: string;
}

// 2. Create a Schema corresponding to the document interface.
const IdentitySchema = new Schema<Identity>({
  email: { type: "String", unique: true },
  emailVerified: { type: "Boolean", default: false },
  phone: { type: "String", unique: true },
  phoneVerified: { type: "Boolean", default: false },
  password: String,
  authToken: String,
  authCode: Number,
  verifyExpiry: String,
});

// 3. Create a Model.
const IdentityModel = model<Identity>("Identity", IdentitySchema);

export default IdentityModel;
