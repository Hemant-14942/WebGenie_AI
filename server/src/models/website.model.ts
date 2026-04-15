import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    role:{type: String, enum: ["user", "ai"], required: true},
    content:{type: String, required: true},
    createdAt:{type: Date, default: Date.now},
});

const websiteSchema = new mongoose.Schema({
    title :{type: String, default: "Untitled Website",trim: true},
    deployed:{type: Boolean, default: false},
    deployedUrl :{type: String,unique: true,sparse: true},
    code :{type: String, default: ""},
    userId :{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    isActive :{type: Boolean, default: true},
    conversation:[
        messageSchema
    ],
    slug:{type: String, unique: true, sparse: true},
}, {
    timestamps: true,
});


export const Website = mongoose.model("Website", websiteSchema) || mongoose.models.Website;
