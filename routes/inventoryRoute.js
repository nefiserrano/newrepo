// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory items details by id view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.getItemDetails))

// Route to 500 Error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;