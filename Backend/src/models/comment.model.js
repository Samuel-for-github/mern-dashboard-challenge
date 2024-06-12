import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {timestamps: true});


export const Comment = mongoose.model('Comment', commentSchema);