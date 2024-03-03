const mongoose=require('mongoose');

const RestaurantSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        unique:true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']

    },
    address:{
        type:String,
        required:[true,'Please add an address']
    },
    district:{
        type:String,
        required:[true,'Please add a district']
    },
    province:{
        type:String,
        required:[true,'Please add a province']
    },
    postalcode:{
        type:String,
        required:[true,'Please add a postalcode'],
        maxlength:[5,'postalcode can not be more than 5 digits']

    },
    tel:{
        type:String
    },
    region:{
        type:String,
        required:[true,'Please add a region']
    },
    openCloseTime:{
        type:String,
        required:[true,'Please add a openCloseTime']
    }

},
    {toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)



RestaurantSchema.pre('deleteOne',{document:true,query:false}, async function(next){
    console.log(`Reservations being removed from restaurant ${this._id}`)
    await this.model('Reservation').deleteMany({restaurant:this._id})
    next();
})


RestaurantSchema.virtual('reservation',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false
})

module.exports=mongoose.model('Restaurant',RestaurantSchema);


