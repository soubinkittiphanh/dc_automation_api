const logger = require("../api/logger");
const company_profile = require('../model').company; // Adjust the path based on your project structure

const service = {
    // Create a new company profile
    createProfile: async (profile, transaction) => {
        logger.warn(`Company profile data \n${JSON.stringify(profile)}`)
        try {
            const newProfile = await company_profile.create(profile, { transaction });
            return newProfile
        } catch (error) {
            logger.error(`Cannot create profile with error ${error}`);
            return null
        }
    },

}

module.exports = service