const logger = require('../api/logger');

const userService = require('../user').service
const authenticate = async (req, res) => {
    logger.info(`Facebook authenthicating...`)
    req.user = {
        id: 'manual',
        displayName: 'manual',
        provider: 'manual',
        isActive: true,

    }
    logger.info(`USER ${JSON.stringify(req.user)}`)
    if (req.user) {
        //********** Check if already user registration completed or not ********* */
        logger.info(`User profile id #${req.user.id}`)
        const user = await userService.getUserById(req.user.id)
        if (user) {
            //********** User already registered case ********* */
            logger.info(`User registered`)
            res.redirect('/auth/succeed');
        } else {
            //********** Register user company profile ********* */
            logger.info(`User not yet registered, creating new user`)
            const userObject = { profileId: req.user.id, profileName: req.user.displayName, profileProvider: req.user.provider, isActive: true, }
            const newUser = await userService.createUser(userObject)
            if (newUser) {
                //********** Register user company profile completed case********* */
                logger.info(`Create new user completed`)
                res.redirect('/auth/succeed');
            } else {
                //********** Register user company profile fail case********* */
                logger.info(`Create new user fail`)
                res.redirect('/registration/failed');
            }
        }
    } else {
        res.send(`User not authenticated`)
    }

}


module.exports = {
    authenticate,
}