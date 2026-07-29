const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderBookingForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("bookings/new.ejs", { listing });
};

module.exports.createBooking = async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        guests: req.body.guests,
        paymentMethod: req.body.paymentMethod,
        totalPrice: listing.price
    });

    await booking.save();

    req.flash("success", "Booking Successful!");
    res.redirect("/profile");
};