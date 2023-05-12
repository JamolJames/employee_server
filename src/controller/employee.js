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

// //Update Bio Data throughout...
const updateBioData = async (req, res) => {
  const empTbl = [
    req.body.emp_id,
    req.body.first_name,
    req.body.last_name,
    req.body.gender,
    req.body.dob,
    req.params.emp_id,
  ]

  try {
    if (req.body.emp_id === req.params.emp_id) {
      await db.query(
        `
        UPDATE employee SET emp_id = $1, first_name = $2, last_name = $3, gender = $4, dob = $5
        WHERE emp_id = $6 returning *
        `,
        empTbl
      )
      const { rows } = await db.query(query)

      res.status(200).json({
        status: "Employee updated successfully",
        results: rows.length,
        rows: rows,
      })
    } else {
      const idSearch = await db.query(
        `
        Select emp_id from employee where emp_id = $1
        `,
        [req.body.emp_id]
      )

      if (idSearch.rows.length > 0) {
        res.status(400).json({
          status:
            "Employee ID already exists. Add a new Employee ID that does not already exist within table",
        })
      } else {
        await db.query(
          `
            UPDATE employee SET
                "emp_id" = $1,
                "first_name" = $2,
                "last_name" = $3,
                "gender" = $4,
                "dob" = $5
            WHERE "emp_id" = $6;
            `,
          empTbl
        )

        await db.query(
          `
                    UPDATE salary SET
                        emp_id = $1
                    WHERE emp_id = $2

                `,
          [req.body.emp_id, req.params.emp_id]
        )
        const { rows } = await db.query(query)

        res.status(200).json({
          status: "Employee updated successfully",
          rows: rows,
        })
      }
    }
  } catch (err) {
    console.log(err)
  }
}

//Update 1 specific employee entry with emp_id and from_date
const updateEntry = async (req, res) => {
  try {
    const Tbl = [
      req.body.salary,
      req.body.from_date,
      req.body.to_date,
      req.body.dept_no,
      req.body.post,
      req.body.role,
      req.params.emp_id,
      req.params.from_date,
    ]
    const updateTbl = await db.query(
      `
            UPDATE salary SET
                salary = $1,
                from_date = $2,
                to_date = $3,
                dept_no = $4,
                post = $5,
                role = $6
            WHERE emp_id = $7 AND from_date = $8 returning *
        `,
      Tbl
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
  try {
    await db.query(
      `
            DELETE FROM salary
            WHERE emp_id = $1 AND from_date = $2
        `,
      [req.params.emp_id, req.params.from_date]
    )
    const idSearch = await db.query(
      `
            SELECT emp_id FROM salary
            WHERE emp_id = $1
        `,
      [req.params.emp_id]
    )
    console.log(idSearch)

    if (idSearch.rows.length === 0) {
      await db.query(`DELETE FROM employee WHERE emp_id = $1`, [
        req.params.emp_id,
      ])
    }
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
