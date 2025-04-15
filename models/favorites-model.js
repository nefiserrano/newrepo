const pool = require("../database/")

/* ***************************
 *  Get favorites information based on the account ID
 * ************************** */
async function getFavoritesByAccountId(account_id) {
    try {
      const favoritesData = await pool.query(
        `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail 
        FROM public.favorites AS f
        JOIN public.inventory AS i
        ON f.inv_id = i.inv_id
        WHERE f.account_id = $1`,
        [account_id]
      )
      return favoritesData.rows
    } catch (error) {
      console.error("getFavoritesByAccountId error " + error)
    }
  }

/* *****************************
*   Add new favorite
* *************************** */
async function addFavorite(account_id, inv_id){
  try {
    const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Remove favorite
* *************************** */
async function removeFavorite(account_id, inv_id){
    try {
      const sql = `
      DELETE FROM public.favorites
      WHERE account_id = $1 AND inv_id = $2
      `
      return await pool.query(sql, [account_id, inv_id])
    } catch (error) {
      return error.message
    }
  }

module.exports = {addFavorite, getFavoritesByAccountId, removeFavorite};