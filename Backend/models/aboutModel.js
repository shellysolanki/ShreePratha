import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, default: '/image/image3.png' },
    videoUrl: { type: String, default: '' },
    lines: { type: [String], default: [
      'We curate quality fashion and lifestyle products at fair prices.',
      'Our team handpicks every item to ensure comfort, style, and durability.',
      'Fast delivery, easy returns, and friendly support are our promises.',
      'Thanks for shopping with us and being part of our journey.'
    ] }
  },
  { timestamps: true }
);

// Single-document collection pattern
const About = mongoose.model('About', aboutSchema);
export default About;












