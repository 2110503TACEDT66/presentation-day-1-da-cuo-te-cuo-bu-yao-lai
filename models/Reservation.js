const mongoose= require('mongoose');

const ReservationSchema=new mongoose.Schema({
    revDate:{
        type:Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});



module.exports=mongoose.model('Reservation',ReservationSchema)
