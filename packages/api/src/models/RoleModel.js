import mongoose from 'mongoose';
const softDelete = require('mongoose-softdelete')
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const RoleSchema = new Schema({
    name: { type: String, unique : true, required : true, index: true },
    permissions: [{  type: String, required: true }],

});

RoleSchema.plugin(uniqueValidator, {message: 'validation.unique'});
RoleSchema.plugin(softDelete);
RoleSchema.plugin(mongoosePaginate);

RoleSchema.set('toJSON', { getters: true });

const RoleModel = mongoose.model('Role', RoleSchema);

module.exports = RoleModel