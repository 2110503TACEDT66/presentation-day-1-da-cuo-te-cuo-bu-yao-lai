
const Restaurant = require('../models/Restaurant.js');
const vacCenter = require('../models/VacCenter.js');
//@desc      GET all restaurants
//@route     GET /api/v1/restaurants
//@access    Public
exports.getRestaurants=async (req,res,next)=>{
    let query;
    const reqQuery={...req.query};

    const removeFields=['select','sort','page','limit'];

    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    //console.log(queryStr)

    query=Restaurant.find(JSON.parse(queryStr)).populate('reservation');

    if(req.query.select){
        const fields= req.query.select.spilt(',').join(' ');
        query.select(fields);


    }
    if(req.query.sort){
        const sortBy= req.query.sort.spilt(',').join(' ');
        query=query.sort(sortBy);

    }
    else{
        query=query.sort('name');
    }

    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;

    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    

    

    try{
        const total= await Restaurant.countDocuments();
        query=query.skip(startIndex).limit(limit);

        const restaurants= await query;

        const pagination={};

        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if(endIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({success:true,count:restaurants.length,pagination,data:restaurants});
    }
    catch(err){
        console.log(err)
        res.status(400).json({success:false});
        
    }
};

//@desc      GET all restaurant
//@route     GET /api/v1/restaurants/:id
//@access    Public
exports.getRestaurant=async (req,res,next)=>{
    try{
        const restaurant= await Restaurant.findById(req.params.id);
        if(!restaurant){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:restaurant});
    }
    catch(err){
        res.status(400).json({success:false});
    }
};

//@desc      Create all restaurants
//@route     POST /api/v1/restaurants
//@access    Private
exports.createRestaurant= async(req,res,next)=>{
    // console.log(req.body);
    const restaurant= await Restaurant.create(req.body);
    res.status(201).json({success:true,data:restaurant});
};

//@desc      UPDATE all restaurants
//@route     PUT /api/v1/restaurants
//@access    Private
exports.updateRestaurant=async (req,res,next)=>{
    try{
        const restaurant= await Restaurant.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        if(!restaurant){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:restaurant});
    }
    catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc      Delete all restaurants
//@route     DELETE /api/v1/restaurants
//@access    Private
exports.deleteRestaurant=async (req,res,next)=>{
    try{
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if(!restaurant){
            return res.status(404).json({success:false,message:`Bootcamp not found with id of ${req.params.id}`});
        }

        await restaurant.deleteOne();
        res.status(200).json({success:true,data:{}});
    }
    catch(err){
        res.status(400).json({success:false});
    }
};

exports.getVacCenters=async (req,res,next)=>{
    vacCenter.getAll((err,data)=>{
        if(err){
            res.status(500).send({
                message:err.message|| "Some error occurred while retrieving Vaccine Centers."
            })
        }
        else{
            res.send(data);
        }
    })

}
