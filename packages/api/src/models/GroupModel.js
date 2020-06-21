const mongoose = require('mongoose'); 
const softDelete = require('mongoose-softdelete')
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({ 

 name: {
  type: String,
  required: true,
  validate: {
   validator: function (value) {
    let r = /^[A-Za-z\s]+$/;
    return r.test(value);
   },
   message: "Solo se admiten letras, sin espacios"
  }},
 color: {
  type: String,
  required: false,
  validate: {
   validator: function (value) {
    let r = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return r.test(value);
   },
   message: "Hexcode invalid"
  }},
 users: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: false
 }]

});

GroupSchema.plugin(softDelete);
GroupSchema.plugin(mongoosePaginate);

GroupSchema.set('toJSON', {
 transform : (doc, result) => {
  return {
   ...result,
   id : result._id
  };
 }
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
