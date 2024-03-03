const express = require('express');
const router = express.Router();
const {getRestaurants,getRestaurant,createRestaurant,updateRestaurant,deleteRestaurant}=require('../controllers/restaurants');
const {protect,authorize}=require('../middleware/auth');
const reservationRouter=require('./reservations');
const menuRouter = require('./menus');

router.use('/:restaurantId/reservations/',reservationRouter);
router.use('/:restaurantId/menus/',menuRouter);


router.route('/').get(getRestaurants).post(protect,authorize('admin'),createRestaurant);
router.route('/:id').get(getRestaurant).put(protect,authorize('admin'),updateRestaurant).delete(protect,authorize('admin'),deleteRestaurant);
module.exports= router;






