const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validateManagement = {}

/*  **********************************
  *  Add New Classification Data Validation Rules
  * ********************************* */
validateManagement.addClassificationRules = () => {
  return [
      // classification name is required and must be string
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.") // on error this message is sent.
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must be letters only.")
  ]
}

/*  **********************************
  *  Add New Vehicle Validation Rules
  * ********************************* */
validateManagement.addInventoryRules = () => {
  return [
    // classification id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification."), // on error this message is sent.

    // make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // model is required
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a model."), // on error this message is sent.

    // description is required
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a description."), // on error this message is sent.

    // image is required
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide an image."), // on error this message is sent.

    // thumbnail is required
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a thumbnail."), // on error this message is sent.

    // price is required and must be a positive integer less than 999999999
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a price.") // on error this message is sent.
    .isInt({ min: 0 , max: 999999999 })
    .withMessage("Price must be an integer between 0 and 999,999,999."),

    // year is required and must be a 4-digit number
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a year.") // on error this message is sent.
    .matches(/^\d{4}$/)
    .withMessage("Year must be a 4-digit number."),

    // miles is required and must be a number
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide the miles.") // on error this message is sent.
    .isInt({ min: 0 })
    .withMessage("Miles must be an integer."),

    // color is required
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a color."), // on error this message is sent.
  ]
}

/* ******************************
* Check data and return errors or continue to add classification
* ***************************** */
validateManagement.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
* Check data and return errors or continue to add vehicle
* ***************************** */
validateManagement.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let list = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Item to the Inventory",
      nav,
      list,
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color,
    })
    return
  }
  next()
}

module.exports = validateManagement