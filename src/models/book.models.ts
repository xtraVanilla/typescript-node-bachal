import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";

export interface BookSchema {
  id: string;
  title: string;
  author: string;
  quantity: number;
  available: number;
}

class Book extends Document {
  id: string;
  title: string;
  author: string;
  quantity: number;
  available: number;
}

export const bookSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    available: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  }
);

export default dynamoose.model<Book>("Book", bookSchema);
