const logger = require('../api/logger');
const { sequelize } = require('./../model');
const Company = require('./../model').company
const AppPort = require('./../model').appPort
const User = require('./../model').user
const portService = require('../appport').service
const companyService = require('../company').service
const commonService = require('../common')
const service = {
    // Create a new user
    createUser: async (user) => {
        const { profileId, profileName, profileProvider, isActive } = user;
        // every query end with { transaction: t }
        const profileRegistration = async () => {
            try {
                const result = await sequelize.transaction(async (t) => {
                    // ************ Create user record *************
                    let newUser = await User.create({
                        profileId,
                        profileName,
                        profileProvider,
                        isActive,
                    }, { transaction: t });

                    // ************ Create app port record *************
                    // Default port app: 3900, api: 8900
                    //  api port range between 8900 - 8999
                    //  app port range between 3900 - 3999
                    let appPort = await portService.findMaxPort('APP')
                    let apiPort = await portService.findMaxPort('API')
                    if (!apiPort) apiPort = 8900;
                    if (!appPort) appPort = 3900;
                    + apiPort++;
                    + appPort++;
                    // ************ Create company_profile record *************
                    user.companyProfile.db = `dcommerce_pro_auto_${profileId}`
                    user.companyProfile.userId = newUser.id
                    user.companyProfile.appPort = appPort
                    user.companyProfile.apiPort = apiPort
                    logger.info(`Company profile before insert ${JSON.stringify(user.companyProfile)}`)
                    const company = await companyService.createProfile(user.companyProfile, t)
                    // ************* Mapp company & app_port ***************
                    const dbApiPort = await portService.createPort(apiPort, company.id, 'API', true, t)
                    const dbAppPort = await portService.createPort(appPort, company.id, 'APP', true, t)
                    logger.info(`Finall appport: ${appPort} apiport: ${apiPort}`)

                    // ************* Create API & APP directory ***************
                    // Assign port info to user
                    logger.info(`Finall new user: ${JSON.stringify(newUser)}`)
                    // await commonService.createApiDirectory(newUser,apiPort)
                    await commonService.createAppDirectory(newUser,appPort)
                    return newUser
                    // ************* Create conf file for supervisorctl ***************
                })
                return result;
            } catch (error) {
                logger.error(`Cannot complete registration trail ${error}`)
            }
        }
        const userCreated = await profileRegistration();
        logger.warn(`User created ${JSON.stringify(userCreated)}`)
        return userCreated;
    },
    // Get a single user by ID
    getUserByProfileId: async (profileId) => {
        try {
            const userInstance = await User.findOne({
                where: {
                    profileId
                },
                include: [{
                    model: Company,
                    as: 'company',
                    include: [
                        {
                            model: AppPort,
                            as: 'appports',
                        },
                    ],
                },]
            });
            if (userInstance) {
                logger.info(`User found ${JSON.stringify(userInstance)}`)
                return userInstance
            } else {
                return null
            }
        } catch (error) {
            logger.error(`User not found with profileId ${profileId}, error ${error}`);
            return null
        }
    },
}

module.exports = service