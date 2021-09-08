import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  memberId: { type: Number, required: true },
  availSpins: { type: Number, default: 0 },
  usedSpins: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
});

const Spins = mongoose.model('Spin', schema);

export default Spins;
