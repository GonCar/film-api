const mongoose = require('mongoose');
const Item = require('../models/item.model');
const User = require('../models/user.model');
const ApiError = require('../models/api-error.model');
const ITEM_GENRES = require('../models/genres');
const ITEM_TYPES = require('../models/types');

module.exports.list = (req, res, next) => {
  const criteria = {};
  if (req.query.title) {
    criteria.title = req.query.title;
  }
  if (req.query.genre) {
    criteria.genre = { $all: req.query.genre };
  }
  if (req.query.year) {
    criteria.year = req.query.year;
  }

  if (req.query.rate) {
    criteria.rate = { $gte: req.query.rate };
  }
  if(req.query.plot) {
    criteria.plot = { $regex: req.query.plot};
  }
  if (req.query.actors) {
    criteria.actors = req.query.actors;
  }
  Item.find(criteria)
    .then(items => res.json(items))
    .catch(error => next(error));
}

module.exports.addToFav = (req, res, next) => {
  const id = req.body.id;
  const user = req.user;

  User.findByIdAndUpdate(user._id, { $addToSet: {'favorites': id } }, { new: true })
    .then(updateUser => res.json(updateUser))
    .catch(error => next(error));
}

module.exports.favlist = (req, res, next) => {
  User.findById(req.user._id)
  .populate('favorites')
  .then(user => res.json(user.favorites))
  .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  Item.findById(id)
    .then(item => {
      if (item) {
        res.json(item)
      } else {
        next(new ApiError(`Item not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.genres = (req, res, next) => {
    res.json(item/genres);
}
module.exports.type = (req, res, next) => {
    res.json(item/type);
}
module.exports.create = (req, res, next) => {
  const item = new Item(req.body);
  if (req.file) {
    item.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  item.save()
    .then(() => {
      res.status(201).json(item);
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    })
}

module.exports.delete = (req, res, next) => {
  const id = req.params.id;
  Item.findByIdAndRemove(id)
    .then(item => {
      if (item) {
        res.status(204).json()
      } else {
        next(new ApiError(`Item not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.edit = (req, res, next) => {
  const id = req.params.id;
  if (req.file) {
    body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  Item.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(item => {
      if (item) {
        res.json(item)
      } else {
        next(new ApiError(`Item not found`, 404));
      }
    }).catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.message, 400, error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    });
}
