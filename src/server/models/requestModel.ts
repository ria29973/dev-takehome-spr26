import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  requestorName: {
    type: String, 
    required: true,
  },
  itemRequested: { 
    type: String, 
    required: true, 
  },
  createdDate: { 
    type: Date, default: () => new Date()
  },
  lastEdited: {
     type: Date, default: () => new Date() 
    },
  status: { 
    type: String, enum : ["pending", "completed", "approved", "rejected"], default: "pending" }
});


const requestModel = mongoose.models.requests || mongoose.model("requests", requestSchema);
export default requestModel;