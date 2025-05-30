const mongoose = require('mongoose');

// Meny item schema
const menuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  description: {
    type: String,
    required: true  
  },
  price: Number,
  category: {
    type: String,
    enum: ['starter', 'main', 'dessert', 'drink'],
    required: true
  }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;