// Import mongoose and create a Schema
const mongoose = require("mongoose");
// Get the Schema object from mongoose
const Schema = mongoose.Schema;


// Schema of Launch document
const LaunchFileSchema = new Schema({
    mission_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    flight_number: {
        type: Number,
        required: true,
        min: 0
    },
    launch_library_2_id: {
        type: String,
        required: true,
        min: 0 
    },
    remark: String,
    raw_path: String,
    analysed_path: String,
    events_path: String
});


// Schema of Company document
const CompanySchema = new Schema({
    company_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lsp: {
        type: Number,
        required: false
    },
    launches: [LaunchFileSchema]
}, { collection: "companyV2"});


const Company = mongoose.model("companyV2", CompanySchema);
module.exports = Company;
