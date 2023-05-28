const db = require("../models/db")
const query = {
    name: "fetch-all-rows",
    text: `select 
                        s.id,
                        e.emp_id, 
                        e.first_name, 
                        e.last_name, 
                        e.gender,
                        e.dob,  
                        s.from_date,
                        s.to_date, 
                        s.salary,
                        s.post,
                        s.role, 
                        d.dept_name 
                    from employee as e
                    join salary as s using(emp_id)
                    join department as d USING(dept_no)`,
}

//Gets all Transactions which inlcudes multiple salaries from an employee
const getAllEmployees = async (req, res) => {
    try {
        const { rows } = await db.query(query)

        res.status(200).json({ rows })
    } catch (err) {
        console.log(err)
    }
}

const createEmployee = async (req, res) => {
    const {
        emp_id,
        first_name,
        last_name,
        gender,
        dob,
        salary,
        from_date,
        to_date,
        dept_no,
        post,
        role,
    } = req.body

    try {
        const idSearch = await db.query(
            `
                    SELECT emp_id FROM employee
                    WHERE emp_id = $1`,
            [emp_id]
        )
        if (idSearch.rows.length === 0) {
            await db.query(
                `
                INSERT into employee (emp_id, first_name, last_name, gender, dob)
                VALUES($1, $2, $3, $4, $5);
                `,
                [emp_id, first_name, last_name, gender, dob]
            )
        }
        await db.query(
            `
                INSERT INTO salary (emp_id, salary, from_date, to_date, dept_no, post, role)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
            [emp_id, salary, from_date, to_date, dept_no, post, role]
        )

        const { rows } = await db.query(query)

        res.status(201).json({ rows })
    } catch (err) {
        console.error(err)
        res.status(400).json({
            "Entry failed":
                "Combination of Date and Employee ID already exist in server.  ",
        })
    }
}

//Update Bio Data throughout...
const updateBioData = async (req, res) => {
    const { first_name, last_name, gender, dob } = req.body
    console.log(req.body)
    console.log(req.params.emp_id)

    try {
        const change = await db.query(
            `
                UPDATE employee SET first_name = $1, last_name = $2, gender = $3, dob = $4
                WHERE emp_id = $5 returning *
                `,
            [first_name, last_name, gender, dob, req.params.emp_id]
        )
        console.log(change.rows)
        const { rows } = await db.query(query)

        res.status(200).json({
            status: "Employee updated successfully",
            rows: rows,
        })
    } catch (err) {
        console.error(err)
    }
}

//Update 1 specific salary entry with id
const updateEntry = async (req, res) => {
    const { salary, from_date, to_date, dept_no, post, role } = req.body
    console.log(`Values sent:`, req.body)
    console.log(`Id:`, req.params.id)

    try {
        await db.query(
            `
                    UPDATE salary SET
                        salary = $1,
                        from_date = $2,
                        to_date = $3,
                        dept_no = $4,
                        post = $5, 
                        role = $6
                    WHERE id = $7 returning *
                `,
            [salary, from_date, to_date, dept_no, post, role, req.params.id]
        )
        const { rows } = await db.query(query)
        res.status(200).json({
            status: "Successfully Updated",
            results: rows.length,
            rows: rows,
        })
    } catch (err) {
        console.log(err)
    }
}

const deleteEntry = async (req, res) => {
    console.log(req.params.id)
    try {
        await db.query("DELETE FROM salary WHERE id = $1", [req.params.id])
        const { rows } = await db.query(query)
        res.status(200).json({
            status: "Successfully Deleted",
            results: rows.length,
            rows: rows,
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getAllEmployees,
    createEmployee,
    updateBioData,
    updateEntry,
    deleteEntry,
}
