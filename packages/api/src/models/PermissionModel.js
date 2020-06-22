import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const PermissionSchema = new Schema({
    name: { type: String, unique : true, required : true, index: true },
});

PermissionSchema.plugin(uniqueValidator, {message: 'validation.unique'});


PermissionSchema.set('toJSON', { getters: true });

const PermissionModel = mongoose.model('Permission', PermissionSchema);

module.exports = PermissionModel