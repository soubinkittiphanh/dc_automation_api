// const { exec } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mysql = require('mysql2');
const logger = require('../api/logger');
const fs = require('fs');
const path = require('path');
const path_production = `/root` //Production
const createApiDirectory = async (user) => {

    // Example: Create a new directory using 'mkdir' command

    const api_draft_path = `/root/api/dc_api_draft`
    const api_home_path = `/root/api`
    const generatedDb = `dcommerce_pro_auto_${user.profileId}`
    const api_home_path_final = `${api_home_path}/dc_${user.profileId}/src/config/dbClient.js`

    await linuxExecSample(`mkdir -p ${api_home_path}/dc_${user.profileId}`, `Create api directory`);
    await linuxExecSample(`cp -r ${api_draft_path}/* ${api_home_path}/dc_${user.profileId}`, `Copy api project to directory api`);
    const command = `mysql -u root -e "CREATE DATABASE ${generatedDb};"`;
    await linuxExecSample(command, `Create mariadb database`);

    // Example: update db connection config file
    // file content predefine 
    const ApiCONFfileContent = `
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
            }
    `
   
    // ***** Create dbConfig.js file in node project
    // ----API Config file
    createDynamicFile(ApiCONFfileContent, api_home_path_final)


    // ***** Add supervisor new config file to service *****
    createSupervisorcltAPIConfigFile(user.port.apiPort, `dc_${user.profileId}`) // Create supervisorclt config file for API 

    // ***** Read api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl reread`, `read config file in supervisor config path`)

    // ***** Add api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl add api_${user.port.apiPort}`, `start new service just added from new config file`)
    // ***** API will start automatically *****

    // ***** add allow port to ufw  *****
    await linuxExecSample(`sudo ufw allow ${user.port.apiPort}`, `allow access port to ufw firewall`)

}
const createAppDirectory = async (user) => {


    // Example: Create a new directory using 'mkdir' command

    const app_draft_path = `/root/app/dc_app_draft`
    const app_home_path = `/root/app`
    const app_home_path_final = `${app_home_path}/dc_${user.profileId}/common/api.js`

    await linuxExecSample(`mkdir -p ${app_home_path}/dc_${user.profileId}`, `Create app directory`);
    await linuxExecSample(`cp -r ${app_draft_path}/* ${app_home_path}/dc_${user.profileId}`, `Copy draft app project to directory app`);
    const AppCONFfileContent = `
        export const hostName = () => {
        const baseURL = 'http://150.95.31.23:${user.port.appPort}' // ***AUTO*** 
        return baseURL;
        }
        export const mainCompanyInfo = () => {
        const info = {
            name: 'AUTO',
            tel: '020999-9999',
            whatsapp: '+8562023378899',
            imageUrl: '',
            imageName: '',
            env: ''
        }
        return info;
        }
    `
    
    // ----APP Config file
    createDynamicFile(AppCONFfileContent, app_home_path_final)
    // ***** Add supervisor new config file to service *****
    createSupervisorcltAPPConfigFile(user.port.appPort, `dc_${user.profileId}`, user.port.appPort) // Create supervisorclt config file for API 

    // ***** Read api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl reread`, `read config file in supervisor config path`)

    // ***** Add api config file (Supervisorctl config file) *****
    await linuxExecSample(`supervisorctl add web_${user.port.appPort}`, `start new service just added from new config file`)
    // ***** API will start automatically *****

    // ***** add allow port to ufw  *****
    await linuxExecSample(`sudo ufw allow ${user.port.appPort}/tcp`, `allow access port to ufw firewall`)


}

const createSupervisorcltAPIConfigFile = (portNumber, directory) => {
    logger.warn(`USER PROP ${JSON.stringify(portNumber)}`)
    const filePath = path.join(`${path_production}/config/supervisor/`, `api_auto_${portNumber}.conf`);
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
const createSupervisorcltAPPConfigFile = (portNumber, directory, apiPort) => {
    logger.warn(`USER PROP ${JSON.stringify(portNumber)}`)
    const filePath = path.join(`${path_production}/config/supervisor`, `app_auto_${portNumber}.conf`);
    const fileContent = `[program:web_${portNumber}]
    environment=API_PORT=${apiPort}
    environment=PORT=${portNumber}
    command=/bin/bash -c "export PATH=/root/.nvm/versions/node/v16.20.2/bin:$PATH && npm run build && npm run start"
    environment=API_PORT=${apiPort}
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
    // const api_source_path = `${filePath}/src/config/dbClient.js` // /Users/soubinkittiphanh/Desktop/Pro/dcommerce/dc_api/src/config/dbClient.js
     // Create the file with content using fs.writeFile
    fs.writeFile(filePath, fileContent, 'utf8', (err) => {
        if (err) {
            logger.error(`Error creating file ${filePath}: ${err.message}`);
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

const createBrandNewDB = (dbname) => {

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sdat@3480' // Replace with your MySQL password
    });

    connection.connect((err) => {
        if (err) throw err;
        logger.info("Connected!");

        // Create a new database named "newDatabaseName"
        const sql = `CREATE DATABASE ${dbname}`;
        connection.query(sql, (err, result) => {
            if (err) throw err;
            logger.info(`Database ${dbname} created!`);
            connection.end(); // Close the connection
        });
    });

}


module.exports = {
    createApiDirectory,
    createAppDirectory,
    createSupervisorcltAPIConfigFile,
    createSupervisorcltAPPConfigFile
}