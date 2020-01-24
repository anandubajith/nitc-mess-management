import mongoose from 'mongoose';

const Due = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      uppercase: true,
      required: [true, 'Please enter roll number'],
    },

    message: {
      type: String,
      required: [true, 'Enter message'],
    },

    amount: Number,
  },
  { timestamps: true },
);

export default mongoose.model<mongoose.Document>('Due', Due);
