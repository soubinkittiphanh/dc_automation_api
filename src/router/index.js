const userRouter = require("../user").router
const companyRouter = require("../company").router
const devRouter = require("../dev").router
module.exports = {
    userRouter, 
    companyRouter,
    devRouter
}