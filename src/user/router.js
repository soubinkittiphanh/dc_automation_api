

const controller = require("./controller")
const express = require("express")
const router = express.Router()

// No auth 
router.use((req,res,next)=>{
    next()
})
router.post("/create", controller.createUser)
    .post("/register", controller.registerUser)
    .put("/update/:id", controller.updateUserById)
    .delete("/find/:id", controller.deleteUserById)
    .get("/find", controller.getAllUsers)
    .get("/find/:id", controller.getUserById)
    .get("/validate/:printerSerialNo", controller.validatePrinterSerialNumber)
    // .post("/bulkCreate",service.createHulkStockCard)
module.exports = router