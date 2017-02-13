### Basic Coding Style ###
* 函數：camelCase, function getLoginStatus()
* 檔名：單字間以_區隔, staff_login.php
* 變數：單字間以_區隔, $empty_header
* 使用4個space，不要使用tab
* UNIX換行格式

# DataBase#
## additional_item 加料品項##
* ai_id：additional_item ID
* at_id：additional_type ID
* name：名稱  
* price：價錢

## additional_type 加料分類 ##
* at_id：additional_type ID
* option_name：分類名稱 ((大杯中杯
* multiple_choice：可否多選

## config ##
name：
value：

## log ##
log_id：id
o_id：
time：時間
s_text：
m_text：
quantity：數目
price：價錢
shop_id：

## main 菜單細項名稱 ##
* m_id：main ID
* name：名稱
* price：價錢
* s_id：series ID
* at_id：additional_type ID
* required_option：true: 我要看 required_option 的table 去看還要那些additional_type
order_num：排序用的(目前沒有用到)

## orders 即時訂單##
	
* o_id： order ID 
* u_id： user ID
* o_time： 建立時間
* o_utime： 修改state的時間
* o_estimate_time： 完成時間(目前沒有用)
* table_num：桌號
* people_num：人數 
* status：即時訂單的狀態 CANCEL, WAIT, MAKING, DONE, PAID, ARCHIVE
* shop_id：shop ID

## required_option ##
	
ro_id：
name：
m_id：
at_id：

## series 品類大項 ##

* s_id：series ID
* order_num：排序用的(目前沒有用到)
* name：名稱
* shop_id：哪間店的品項 (各店菜單完全獨立) 

## sh-i_ai ##
	
sh-i_ai_id：
sh-i_id：
ai_id：
is_ro：

## share ##
	
sh_id：
o_id：
total：

## share_item ##

sh-i_id：
sh_id：
m_id：
quantity：
comment：
shop_id：

## shop 分店資訊##

shop_id：id
shop_name：名稱
shop_address：地址
shop_tel：電話
shop_owner：店長名字
shop_account：
shop_type：

## user ##

u_id：id
u_account：帳號
u_pass：密碼
u_type： 0: not active, 1: active, 2: staff, 3: admin
shop_id： 隸屬於哪間店的

## user_info ##
	
ui_id：
u_id：
ui_advsecurity：
ui_occupation：
ui_phone：電話

## user_register ##
	
u_id：
code：
expiration：
