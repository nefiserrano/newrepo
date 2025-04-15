const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validateFavorite = {}

/*  **********************************
  *  Add New Vehicle Validation Rules
  * ********************************* */
validateFavorite.addFavoriteRules = () => {
    return [
      // inv_id is required and must be a number
      body("inv_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the inventory id of the vehicle.") // on error this message is sent.
      .isInt({ min: 1 })
      .withMessage("Inventory id must be an integer.")
      .custom(async (value) => {
        const vehicle = await invModel.getVehicleById(value); // Asegúrate de tener esta función
        if (!vehicle) {
          throw new Error("The vehicle with the provided inventory id does not exist.");
        }
        return true;
      }),
    ]
}

 /* ******************************
* Check data and return errors or continue to edit account
* ***************************** */
validateFavorite.checkFavoriteData = async (req, res, next) => {
  const { inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const vehicleInfo = await invModel.getVehicleById(inv_id)
    if (!vehicleInfo || vehicleInfo.length === 0) {
        req.flash("notice", "The vehicle with the provided inventory id does not exist.");
        return res.redirect("inventory/");
      }
    res.render("inventory/detail", {
        errors,
        title: `${vehicleInfo[0].inv_make} ${vehicleInfo[0].inv_model}`,
        nav,
        list,
        vehicleInfo: vehicleInfo[0],
    })
    return
  }
  next()
}

module.exports = validateFavorite