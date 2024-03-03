const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Please add a name"]
    },
    food : {
        type : Array,
        required : [true,"Please add food list"]

    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        required:true
    }
});

module.exports = mongoose.model('Menu',MenuSchema);