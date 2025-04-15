// Needed Resources 
const express = require("express")
const router = new express.Router() 
const favCont = require("../controllers/favoritesController")
const favValidate = require('../utilities/fav-validation')
const utilities = require("../utilities")

// Route to favorites view
router.get("/", utilities.checkLogin, utilities.handleErrors(favCont.buildFavorites))

// Route to process add new favorite form submission
router.post(
  "/add",
  utilities.checkLogin,
  favValidate.addFavoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(favCont.addFavorite)
)

// Route to process remove favorite
router.post(
    "/remove",
    utilities.checkLogin,
    utilities.handleErrors(favCont.removeFavorite)
  )

module.exports = router;