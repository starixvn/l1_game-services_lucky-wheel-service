import mongoose from 'mongoose';
import { MongooseAutoIncrementID } from 'mongoose-auto-increment-reworked';

const schema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  result: { type: Number, required: true },
  memberId: { type: Number },
  siteId: { type: String },
  time: { type: Date, default: new Date() },
});

schema.plugin(MongooseAutoIncrementID.plugin, {
  modelName: 'Spin_result',
  field: 'id',
});

const SpinResult = mongoose.model('Spin_result', schema);

export default SpinResult;
