import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";

export interface UserSchema {
  id: string;
  type: string;
  checkedoutBooks: string[];
}

class User extends Document {
  id: string;
  type: string;
  checkedoutBooks: string[];
}

export const userSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    checkedoutBooks: {
      type: Set,
      schema: [String],
      default: [],
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  }
);

export default dynamoose.model<User>("User", userSchema);
