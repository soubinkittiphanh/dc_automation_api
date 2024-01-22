// const { exec } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const logger = require('../api/logger');
const fs = require('fs');
const path = require('path');
const path_production = `/root` //Production
const createApiDirectory = async (user) => {

    // Example: Create a new directory using 'mkdir' command

    const api_draft_path = `/root/api/dc_api_draft`
    const api_home_path = `/root/api`
    const generatedDb = `dcommerce_pro_auto_${user.profileId}`
    const api_home_path_final = `${api_home_path}/dc_${user.profileId}`

    await linuxExecSample(`mkdir -p ${api_home_path}/dc_${user.profileId}`, `Create api directory`);
    await linuxExecSample(`cp -r ${api_draft_path}/* ${api_home_path}/dc_${user.profileId}`, `Copy api project to directory api`);
    const command = `mysql -u root -e "CREATE DATABASE ${generatedDb};"`;
    await linuxExecSample(command, `Create mariadb database`);

    // Example: update db connection config file
    // file content predefine 
    const fileContent = `
    const clientDB = {
        "auto": {
            "host": "150.95.31.23",
            "user": "root",
            "password": "sdat@3480",
            "database": "${generatedDb}",
            "port": 3306,
        },
    }
    module.exports = {
        clientDB,
    }`
    // ***** Create dbConfig.js file in node project
    createDynamicFile(fileContent, api_home_path_final)

    // ***** Add supervisor new config file to service *****
    createSupervisorcltAPIConfigFile(user.apiPort, `dc_${user.profileId}`) // Create supervisorclt config file for API 

    // ***** Read api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl reread`, `read config file in supervisor config path`)

    // ***** Add api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl add api_${user.apiPort}`, `start new service just added from new config file`)
    // ***** API will start automatically *****


}
const createAppDirectory = async (user) => {


    // Example: Create a new directory using 'mkdir' command

    const api_draft_path = `/root/app/dc_app_draft`
    const api_home_path = `/root/app`
    const generatedDb = `dcommerce_pro_auto_${user.profileId}`
    const api_home_path_final = `${api_home_path}/dc_${user.profileId}`

    await linuxExecSample(`mkdir -p ${api_home_path}/dc_${user.profileId}`, `Create app directory`);
    await linuxExecSample(`cp -r ${api_draft_path}/* ${api_home_path}/dc_${user.profileId}`, `Copy draft app project to directory app`);

    // Example: update db connection config file
    // file content predefine 
    const fileContent = `
    const clientDB = {
        "auto": {
            "host": "150.95.31.23",
            "user": "root",
            "password": "sdat@3480",
            "database": "${generatedDb}",
            "port": 3306,
        },
    }
    module.exports = {
        clientDB,
    }`
    // ***** Create dbConfig.js file in node project
    createDynamicFile(fileContent, api_home_path_final)

    // ***** Add supervisor new config file to service *****
    createSupervisorcltAPPConfigFile(user.appPort, `dc_${user.profileId}`) // Create supervisorclt config file for API 

    // ***** Read api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl reread`, `read config file in supervisor config path`)

    // ***** Add api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl add web_dc_${user.apiPort}`, `start new service just added from new config file`)
    // ***** API will start automatically *****


}

const createSupervisorcltAPIConfigFile = (portNumber, directory) => {
    logger.warn(`USER PROP ${JSON.stringify(portNumber)}`)
    const filePath = path.join(path_production, `api_auto_${portNumber}.conf`);
    const fileContent = `[program:api_${portNumber}]
    command=/root/.nvm/versions/node/v16.20.2/bin/node /root/api/${directory}/src/index.js
    environment=PORT=${portNumber}
    autostart=true
    startsecs=10
    autorestart=true
    startretries=3
    redirect_stderr=true
    stdout_logfile = /var/log/supervisor/api_${portNumber}.log
    directory =/root/api/${directory}
    logfile_maxbytes=50MB
    logfile_backups=5`;

    // Create the file with content using fs.writeFile
    fs.writeFile(filePath, fileContent, 'utf8', (err) => {
        if (err) {
            logger.error(`Error creating file: ${err.message}`);
        } else {
            logger.info(`File '${filePath}' created with content.`);

            // If you want to read the file after creation, you can use fs.readFile
            fs.readFile(filePath, 'utf8', (readErr, data) => {
                if (readErr) {
                    logger.error(`Error reading file: ${readErr.message}`);
                } else {
                    logger.warn(`File content: ${data}`);
                }
            });
        }
    });

}
const createSupervisorcltAPPConfigFile = (portNumber, directory) => {
    logger.warn(`USER PROP ${JSON.stringify(portNumber)}`)
    const filePath = path.join(path_production, `app_auto_${portNumber}.conf`);
    const fileContent = `[program:web_${portNumber}]
    environment=PORT=${portNumber}
    command=/bin/bash -c "export PATH=/root/.nvm/versions/node/v16.20.2/bin:$PATH && npm run build && npm run start"
    environment=PORT=${portNumber}
    autostart=true
    startsecs=10
    autorestart=true
    startretries=3
    redirect_stderr=true
    stdout_logfile=/var/log/supervisor/web_${portNumber}.log
    directory=/root/app/${directory}
    logfile_maxbytes=50MB
    logfile_backups=5`;

    // Create the file with content using fs.writeFile
    fs.writeFile(filePath, fileContent, 'utf8', (err) => {
        if (err) {
            logger.error(`Error creating file: ${err.message}`);
        } else {
            logger.info(`File '${filePath}' created with content.`);

            // If you want to read the file after creation, you can use fs.readFile
            fs.readFile(filePath, 'utf8', (readErr, data) => {
                if (readErr) {
                    logger.error(`Error reading file: ${readErr.message}`);
                } else {
                    logger.warn(`File content: ${data}`);
                }
            });
        }
    });

}
const createDynamicFile = (fileContent, filePath) => {
    const api_source_path = `${filePath}/src/config/dbClient.js`

    // Create the file with content using fs.writeFile
    fs.writeFile(api_source_path, fileContent, 'utf8', (err) => {
        if (err) {
            logger.error(`Error creating file ${api_source_path}: ${err.message}`);
        } else {
            logger.info(`File '${api_source_path}' created with content.`);

            // If you want to read the file after creation, you can use fs.readFile
            fs.readFile(api_source_path, 'utf8', (readErr, data) => {
                if (readErr) {
                    logger.error(`Error reading file: ${readErr.message}`);
                } else {
                    logger.warn(`File content: ${data}`);
                }
            });
        }
    });

}
// const linuxExecSample = (command, processTitle) => {
//     exec(command, (error, stdout, stderr) => {
//         if (error) {
//             logger.error(`Cannot ${processTitle} Error: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             logger.error(`${processTitle} stderr: ${stderr}`);
//             return;
//         }
//         logger.warn(`${processTitle} execute successfully: ${stdout}`);
//     });

// }


const linuxExecSample = async (command, processTitle) => {
    try {
        const { stdout, stderr } = await exec(command);
        if (stderr) {
            logger.error(`${processTitle} stderr: ${stderr}`);
            return;
        }
        logger.warn(`${processTitle} execute successfully: ${stdout}`);
    } catch (error) {
        logger.error(`Cannot ${processTitle} Error: ${error.message}`);
    }
};



module.exports = {
    createApiDirectory,
    createAppDirectory,
    createSupervisorcltAPIConfigFile,
    createSupervisorcltAPPConfigFile
}