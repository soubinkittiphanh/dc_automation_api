

const controller = require("./controller")
const express = require("express")
const router = express.Router()

// No auth 
router.use((req,res,next)=>{
    next()
})
router.post("/create", controller.createOutlet)
    .put("/update/:id", controller.updateOutletById)
    .delete("/find/:id", controller.deleteOutletById)
    .get("/find", controller.getAllOutlets)
    .get("/find/:id", controller.getOutletById)
    // .post("/bulkCreate",service.createHulkStockCard)
module.exports = router