const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");

exports.getReservations = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Reservation.find({ user: req.user.id }).populate({
      path: "restaurant",
      select: "name province tel",
    });
  } else {
    if (req.params.restaurantId) {
      console.log(req.params.restaurantId);
      query = Reservation.find({
        restaurant: req.params.restaurantId,
      }).populate({
        path: "restaurant",
        select: "name province tel",
      });
    } else {
      query = Reservation.find().populate({
        path: "restaurant",
        select: "name province tel",
      });
    }
  }

  try {
    const reservations = await query;

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Reservation",
    });
  }
};

exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate({
      path: "restaurant",
      select: "name description tel",
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};

exports.addReservation = async (req, res, next) => {
  try {
    req.body.restaurant = req.params.restaurantId;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `No restaurant with the id of ${req.params.restaurantId}`,
      });
    }

    // Ensure reservation time is in the future
    const reservationTime = new Date(req.body.revDate);
    const currentTime = new Date(Date.now());
    if (reservationTime <= currentTime) {
      return res.status(400).json({
        success: false,
        message: `Reservation time must be in the future`,
      });
    }

    // Combine revDate with openTime and closeTime
    const openDateTime = new Date(req.body.revDate);
    const closeDateTime = new Date(req.body.revDate);
    const [openTimeStr, closeTimeStr] = restaurant.openCloseTime.split("-");
    const [openHours, openMinutes] = openTimeStr.split(".");
    const [closeHours, closeMinutes] = closeTimeStr.split(".");
    openDateTime.setHours(openHours, openMinutes, 0);
    closeDateTime.setHours(closeHours, closeMinutes, 0);
    // Check if reservation time is within open and close times
    if (
      !(reservationTime >= openDateTime && reservationTime <= closeDateTime)
    ) {
      return res.status(400).json({
        success: false,
        message: `Reservation time must be within open hours ${restaurant.openTimeStr} and close hours ${restaurant.closeTimeStr}`,
      });
    }

    console.log(req.body);

    req.body.user = req.user.id;

    const existedReservations = await Reservation.find({ user: req.user.id });

    if (existedReservations.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 reservations`,
      });
    }

    const reservation = await Reservation.create(req.body);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Reservation" });
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this reservation`,
      });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Cannot update Reservation" });
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this bootcamp`,
      });
    }

    await reservation.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Cannot delete Reservation" });
  }
};
