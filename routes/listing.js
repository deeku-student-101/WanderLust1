const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ListingController = require("../controllers/listings.js");
const Listing = require("../models/listing");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

router.get(
  "/search",
  wrapAsync(ListingController.searchListings)
);

// INDEX + CREATE
router.route("/")
.get(wrapAsync(ListingController.index))
.post(
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),
  wrapAsync(ListingController.createListing)
);

// NEW FORM
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// CATEGORY ROUTE
router.get(
  "/category/:category",
  wrapAsync(ListingController.categoryListing)
);

// ❤️ LIKED LISTINGS ROUTE
router.get("/liked", isLoggedIn, async (req, res) => {
  const allListings = await Listing.find({
    likes: req.user._id
  });

  res.render("listings/liked.ejs", { allListings });
});

// SHOW + UPDATE + DELETE
router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.destroyListing)
);

// EDIT FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

// ❤️ LIKE ROUTE
router.post(
  "/:id/like",
  isLoggedIn,
  wrapAsync(ListingController.likeListing)
);

module.exports = router;