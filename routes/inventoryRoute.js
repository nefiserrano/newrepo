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
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to build add new classification view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit Item's information view
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editItemInfo))

// Route to process add new classification form submission
router.post(
    "/add-classification",
    manValidate.addClassificationRules(),
    manValidate.checkClassificationData,
    utilities.handleErrors(invController.registerClassification)
  )

// Route to process add new inventory form submission
router.post(
  "/add-inventory",
  manValidate.addInventoryRules(),
  manValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
)

// Route to process update inventory form submission
router.post(
  "/update/",
  manValidate.addInventoryRules(),
  manValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

// Route to 500 Error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;