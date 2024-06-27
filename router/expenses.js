const express = require("express")
const router = express.Router()

const { createExpenseIncome, getAllUserCreated, getOneExpenseIncome, updateExpenseIncome, deleteExpenseIncome } = require("../controller/expenses")

router.post("/create-expense-income", createExpenseIncome)
router.get("/get-all-user-created", getAllUserCreated)
router.get("/get-single-expense-income", getOneExpenseIncome)
router.patch("/update-expense-income", updateExpenseIncome)
router.delete("/delete-expense-income", deleteExpenseIncome)

module.exports = router 