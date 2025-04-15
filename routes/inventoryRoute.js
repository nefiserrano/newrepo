// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const manValidate = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory items details by id view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.getItemDetails))

// Route to build vehicle management view
router.get("/", utilities.checkAcccountType, utilities.handleErrors(invController.buildManagement))

// Route to build add new classification view
router.get("/add-classification", utilities.checkAcccountType, utilities.handleErrors(invController.buildAddClassification))

// Route to build add new vehicle view
router.get("/add-inventory", utilities.checkAcccountType, utilities.handleErrors(invController.buildAddInventory))

// Route to build get inventory view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit Item's information view
router.get("/edit/:inventory_id", utilities.checkAcccountType, utilities.handleErrors(invController.editItemInfo))

// Route to build delete Item's information view
router.get("/delete/:inventory_id", utilities.checkAcccountType, utilities.handleErrors(invController.deleteItemInfo))

// Route to process add new classification form submission
router.post(
    "/add-classification",
    utilities.checkAcccountType,
    manValidate.addClassificationRules(),
    manValidate.checkClassificationData,
    utilities.handleErrors(invController.registerClassification)
  )

// Route to process add new inventory form submission
router.post(
  "/add-inventory",
  utilities.checkAcccountType,
  manValidate.addInventoryRules(),
  manValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
)

// Route to process update inventory form submission
router.post(
  "/update/",
  utilities.checkAcccountType,
  manValidate.addInventoryRules(),
  manValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

// Route to process delete inventory form submission
router.post(
  "/delete/",
  utilities.checkAcccountType,
  utilities.handleErrors(invController.deleteInventory))

// Route to 500 Error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;