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

module.exports = validateManagement