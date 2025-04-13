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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/", {
    title: "Vehicle Inventory Management",
    nav,
    classificationSelect,
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
    res.redirect("/inv/")
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
    res.status(201).render("inventory/", {
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editItemInfo = async function (req, res) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inventory_id)
  let list = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    list :list,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteItemInfo = async function (req, res) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inventory_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ****************************************
*  Update Inventory Data
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "notice",
      `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
  } else {
    const list = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      list: list,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ****************************************
*  Delete Inventory Data
* *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash(
      "notice",
      'The deletion was successful.')
      res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delet failed.")
    res.redirect("inventory/delete/inv_id")
  }
}

module.exports = invCont