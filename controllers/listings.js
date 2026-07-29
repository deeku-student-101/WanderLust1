const Listing = require("../models/listing.js");


module.exports.index =async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm= (req, res) => {
   
  res.render("listings/new.ejs");
};
module.exports.showListing= async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path:"author",
      },
    })
    .populate("owner");

  console.log(listing);

  res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  let listingData = req.body.listing;

  // 🔥 MUST ADD THIS
  listingData.category = req.body.listing.category;

  const newListing = new Listing(listingData);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
  module.exports.renderEditForm=async (req, res) => {
      let { id } = req.params;
  const listing = await Listing.findById(req.params.id);
  if(!listing){
        req.flash("error", "Listing you requested for does not exist! ");
        res.redirect("/listings");
  }

  let originalImageUrl =listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};
module.exports.updateListing = async (req, res) => {

  let { id } = req.params;

  let listing = await Listing.findById(id);

  let listingData = req.body.listing;

  if (!listingData.image?.url || listingData.image.url.trim() === "") {
    listingData.image = listing.image;
  }

  listing = await Listing.findByIdAndUpdate(id, listingData);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };

    await listing.save();
  }

  req.flash("success", "Listing Updated");

  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  const deletedListing = await Listing.findByIdAndDelete(req.params.id);

  if (deletedListing) {
    req.flash("success", "Listing Deleted ");
  }

  res.redirect("/listings");
};
module.exports.categoryListing = async (req, res) => {
  let { category } = req.params;

  // normalize (SUPER IMPORTANT)
  category = category.trim();

  const allListings = await Listing.find({
    category: { $regex: new RegExp("^" + category + "$", "i") }
  });

  console.log("CATEGORY HIT:", category);
  console.log("FOUND:", allListings.length);

  res.render("listings/category.ejs", { allListings, category });
};
module.exports.searchListings = async (req, res) => {
  let { country } = req.query;

  let query = {};

  if (country && country.trim() !== "") {
    query.country = {
      $regex: country.trim(),
      $options: "i"
    };
  }

  const allListings = await Listing.find(query);

  res.render("listings/index.ejs", {
    allListings,
    country: country || ""
  });
};
module.exports.likeListing = async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let userId = req.user._id;

  if(listing.likes.includes(userId)){
    listing.likes.pull(userId);
  } else {
    listing.likes.push(userId);
  }

  await listing.save();
  res.redirect("/listings");
};