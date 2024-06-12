import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
}, {timestamps: true});

postSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model('Post', postSchema);