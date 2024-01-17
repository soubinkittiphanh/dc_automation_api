

const controller = require("./controller")
const express = require("express")
const router = express.Router()

// No auth 
router.use((req,res,next)=>{
    next()
})
router.post("/create", controller.createProfile)
    .put("/update/:id", controller.updateProfileById)
    .delete("/find/:id", controller.deleteProfileById)
    .get("/find", controller.getAllProfiles)
    .get("/find/:id", controller.getProfileById)
    // .post("/bulkCreate",service.createHulkStockCard)
module.exports = router