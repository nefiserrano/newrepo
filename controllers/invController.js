const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory items details by id view
 * ************************** */
invCont.getItemDetails = async function (req, res) {
  const inventory_id = req.params.inventoryId
  const vehicleData = await invModel.getVehicleById(inventory_id)
  const vehicleInfo = await utilities.buildVehicleDataHTML(vehicleData)
  let nav = await utilities.getNav()
  const vehicleTitle = vehicleData[0].inv_year + " " + vehicleData[0].inv_make + " " + vehicleData[0].inv_model + " "
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    vehicleInfo,
    errors: null,
  })
}

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add new classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add new inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Item to the Inventory",
    nav,
    list,
    errors: null,
  })
}

/* ****************************************
*  Process add new classification
* *************************************** */
invCont.registerClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classificationResult = await invModel.registerClassification(classification_name)

  if (classificationResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered the new ${classification_name} classification.`
    )
    res.redirect("/inv/management")
  } else {
    req.flash("notice", "Sorry, the registration of the new classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,   
    })
  }
}

/* ****************************************
*  Process add new vehicle
* *************************************** */
invCont.registerInventory = async function (req, res) {
  let nav = await utilities.getNav()
  
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const invResult = await invModel.registerInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id,
  )

  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered the new ${inv_make} ${inv_model} vehicle.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Inventory Management",
      nav,
      errors: null,
    })
  } else {
    let list = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the registration of the new vehicle failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Item to the Inventory",
      nav,
      list,
      errors: null,
    })
  }
}

/* ***************************
 *  Trigger 500 Error intentionally
 * ************************** */
invCont.triggerError = async function (req, res) {
  const inventory_id = req.params.inventoryId
  const vehicleData = await invModel.getVehicleById(inventory_id)
  const vehicleInfo = await utilities.buildVehicleDataHTML(vehicleData)
  const vehicleTitle = vehicleData[0].inv_year + " " + vehicleData[0].inv_make + " " + vehicleData[0].inv_model + " "
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    vehicleInfo,
    errors: null,
  })
}

module.exports = invCont