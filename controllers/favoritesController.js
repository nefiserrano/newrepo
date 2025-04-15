const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities/")

const favCont = {}

/* ***************************
 *  Build favorites view
 * ************************** */
favCont.buildFavorites = async function (req, res) {
  let nav = await utilities.getNav()
  const account_id = req.session.accountData.account_id
  const favoritesData = await favoritesModel.getFavoritesByAccountId(account_id)
  res.render("./favorites/list", {
    title: "My Favorites",
    nav,
    favoritesData,
    errors: null,
  })
}

/* ****************************************
*  Process add new favorite
* *************************************** */
favCont.addFavorite = async function (req, res) {
  const { inv_id } = req.body
  const account_id = req.session.accountData.account_id

  const addFavoriteResult = await favoritesModel.addFavorite(account_id, inv_id)

  if (addFavoriteResult) {
    req.flash(
      "notice",
      "Vehicle added to favorites."
    )
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Failed to add vehicle to favorites.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ****************************************
*  Process remove favorite
* *************************************** */
favCont.removeFavorite = async function (req, res) {
    const { inv_id } = req.body
    const account_id = req.session.accountData.account_id
  
    const removeFavoriteResult = await favoritesModel.removeFavorite(account_id, inv_id)
  
    if (removeFavoriteResult) {
      req.flash(
        "notice",
        "Vehicle removed from favorites."
      )
      res.redirect("/favorites")
    } else {
      req.flash("notice", "Failed to remove vehicle from favorites.")
      res.redirect("/favorites")
    }
  }

module.exports = favCont