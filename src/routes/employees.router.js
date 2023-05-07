const express = require("express");
const router = express.Router();
const {
    getAllEmployees,
    createEmployee,
    updateBioData,
    updateEntry,
    deleteEntry,
} = require("./employees.controller");

router.get("/", getAllEmployees);
router.post("/", createEmployee);
router.put("/:emp_id", updateBioData);
router.put("/:emp_id/:from_date", updateEntry);
router.delete("/:emp_id/:from_date", deleteEntry);

module.exports = router;
