const db = require("../models/db")

const getAllDepartments = async (req, res) => {
  const query = `SELECT * FROM department`
  try {
    const { rows } = await db.query(query)

    res.status(200).json({ rows })
  } catch (err) {
    console.log(err)
  }
}

module.exports = { getAllDepartments }
