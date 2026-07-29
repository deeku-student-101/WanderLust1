const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// SHOW BOOKING FORM
router.get("/:id", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("bookings/new.ejs", { listing });
});

// CREATE BOOKING
router.post("/", isLoggedIn, async (req, res) => {
    try {
        const { listing, checkIn, checkOut, guests, paymentMethod } = req.body;

        const listingData = await Listing.findById(listing);

        // 🔥 CHECK DOUBLE BOOKING (ADDED)
       // 🔥 CHECK DOUBLE BOOKING
const existingBooking = await Booking.findOne({
    listing,
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
});

        if (existingBooking) {
            req.flash("error", "These dates are already booked!");
return res.redirect(`/listings/${listing}`);        }

        const days =
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

        const safeDays = days > 0 ? days : 1;

        const totalPrice = listingData.price * safeDays;

        const newBooking = new Booking({
            listing,
            user: req.user._id,
            checkIn,
            checkOut,
            guests,
            paymentMethod,
            bookingStatus: "Pending",
            totalPrice
        });

        await newBooking.save();

        req.flash("success", "Booking Confirmed 🎉");
        res.redirect("/listings");

    } catch (err) {
    console.log(err);
    console.log(err.message);

    req.flash("error", err.message);
    res.redirect("/listings");
}
});

module.exports = router;