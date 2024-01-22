drop table app_port;
drop table company_profile;
drop table user;
drop database dcommerce_pro_auto_manual;

rm /var/log/supervisor/api_8001.log
rm /root/config/supervisor/*_auto_*
rm -rf /root/app/dc_manual
rm -rf /root/api/dc_manual