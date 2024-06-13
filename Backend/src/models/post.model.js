import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import {User} from "./user.model.js";

const postSchema = new mongoose.Schema({
    postFile:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    likes:{
        type: Number,
        default: 0
    },
    dislike:{
        type: Number,
        default: 0
    },
    owner:{
    type: String,
    },
    publicId:{
        type: String
    }
}, {timestamps: true});

postSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model('Post', postSchema);