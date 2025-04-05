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
  })
}

/* ***************************
 *  Build inventory items details by classification view
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
  })
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
  })
}

module.exports = invCont