const mongoose = require('mongoose');
const ITEM_GENRES = require('./genres');
const ITEM_TYPES = require('./types');
const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    poster: {
        type: String

    },
    genre: {
      type: [String],
      enum: ITEM_GENRES,
      required: [true, 'Genre is required']
    },
    year: {
      type: Number,
      required: [true, 'Year is required']
    },
    rate: {
      type: Number,
      min: [0, 'Min is 0'],
      max: [5, 'Max is 5']
    },
    plot: {
      type: String,
      required: [true, 'Plot is required']
    },
    type: {
      type: String,
      enum: ITEM_TYPES
    },
    actors: {
      type: [String]
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
 });

 const Item = mongoose.model('Item', itemSchema);
 module.exports = Item;
