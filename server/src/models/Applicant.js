import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const schema = new Schema({
  session_id: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  code: String,
  session_timestamp: Date,
  status: String,
  person_info: Object,
  location: Object,
  communication: Object,
  tx1_id: String,
  tx2_id: String,
  tx1_record_id: String,
  tx2_record_id: String,
  fe_tx_id: String,
  result1: Object,
  result2: Object,
  verify1_begin_timestamp: Date,
  verify1_end_timestamp: Date,
  verify2_begin_timestamp: Date,
  verify2_end_timestamp: Date,
  old_session_id: String
});
schema.index({code: 1, old_session_id: 1}, {unique: true});
schema.index({tx1_id: 1}, {unique: false});
schema.index({tx2_id: 1}, {unique: false});
schema.index({verify2_begin_timestamp: 1, status: 1, tx2_id: 1}, {unique: false});

export const Applicant = model('Applicant', schema);
