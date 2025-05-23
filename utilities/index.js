const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle details view HTML
* ************************************ */
Util.buildVehicleDataHTML = async function(vehicleData){
  const HTML = `
  <form action="/favorites/add" method="post">
    <input type="hidden" name="inv_id" value="${vehicleData[0].inv_id}">
    <button id="add-favorite-button" type="submit">Add to Favorites</button>
  </form>
  <div id="vehicle-details">
    <img src="${vehicleData[0].inv_image}" alt="${vehicleData[0].inv_make} ${vehicleData[0].inv_model} car">
    <div>
      <h2>${vehicleData[0].inv_make} ${vehicleData[0].inv_model} Details</h2>
      <p id="price"><strong>Price:</strong> <span>$${new Intl.NumberFormat('en-US').format(vehicleData[0].inv_price)}</span></p>
      <p class="details"><strong>Description:</strong> <span>${vehicleData[0].inv_description}</span></p>
      <p class="details"><strong>Color:</strong> <span>${vehicleData[0].inv_color}</span></p>
      <p class="details"><strong>Miles:</strong> <span>${vehicleData[0].inv_miles.toLocaleString("en-US")}</span></p>
    </div>
  </div>
  `
  return HTML
}

/* **************************************
* Build the classification list
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification*</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, decoded) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     req.session.accountData = {
       account_id: decoded.account_id,
       account_firstname: decoded.account_firstname,
       account_lastname: decoded.account_lastname,
       account_email: decoded.account_email,
       account_type: decoded.account_type,
     };
     res.locals.accountData = req.session.accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
    res.locals.loggedin = 0
   next()
  }
 }

 /* ****************************************
* Middleware to check account type
**************************************** */
Util.checkAcccountType = (req, res, next) => {
  if (res.locals.loggedin && res.locals.accountData) {
    const accountType = res.locals.accountData.account_type;
    if (accountType === "Employee" || accountType === "Admin") {
      return next()
    }
  }
  req.flash("notice", "You do not have permission to access this resource.")
  return res.redirect("/account/login")
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util