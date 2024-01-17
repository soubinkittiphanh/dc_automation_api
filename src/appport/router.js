

const controller = require("./controller")
const express = require("express")
const router = express.Router()

// No auth 
router.use((req,res,next)=>{
    next()
})
router.post("/create", controller.createPort)
    .put("/update/:id", controller.updatePortById)
    .delete("/find/:id", controller.deletePortById)
    .get("/find", controller.getAllPorts)
    .get("/find/:id", controller.getPortById)
module.exports = router