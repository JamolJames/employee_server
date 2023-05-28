const express = require("express")
const router = express.Router()
const {
    getAllEmployees,
    createEmployee,
    updateBioData,
    updateEntry,
    deleteEntry,
} = require("./controller/employee")
const { getAllDepartments } = require("./controller/department")

const EMPLOYEE = "/employees"
const DEPARTMENT = "/departments"

router.get(`${EMPLOYEE}/`, getAllEmployees)
router.post(`${EMPLOYEE}/`, createEmployee)
router.put(`${EMPLOYEE}/:emp_id`, updateBioData)
router.put(`${EMPLOYEE}/salary/:id`, updateEntry)
router.delete(`${EMPLOYEE}/salary/:id`, deleteEntry)

router.get(`${DEPARTMENT}`, getAllDepartments)

module.exports = router
