drop table app_port;
drop table company_profile;
drop table user;
drop database dcommerce_pro_auto_manual;

rm /var/log/supervisor/api_8001.log
rm /root/config/supervisor/*_auto_*
rm -rf /root/app/dc_manual
rm -rf /root/api/dc_manual


SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE app_port;
TRUNCATE TABLE company_profile;
TRUNCATE TABLE user;
SET FOREIGN_KEY_CHECKS = 1;

SHOW STATUS WHERE `variable_name` = 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';
SET GLOBAL max_connections = 200;

