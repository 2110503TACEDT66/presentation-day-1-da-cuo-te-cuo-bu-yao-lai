const express = require('express');
const router = express.Router();
const {getRestaurants,getRestaurant,createRestaurant,updateRestaurant,deleteRestaurant,getVacCenters}=require('../controllers/restaurants')
const {protect,authorize}=require('../middleware/auth')
const reservationRouter=require('./reservations');

router.use('/:restaurantId/reservations/',reservationRouter)



router.route('/').get(getRestaurants).post(protect,authorize('admin'),createRestaurant);
router.route('/vacCenters').get(getVacCenters)
router.route('/:id').get(getRestaurant).put(protect,authorize('admin'),updateRestaurant).delete(protect,authorize('admin'),deleteRestaurant);
module.exports= router;






