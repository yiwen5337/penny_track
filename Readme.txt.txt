*This project is runing with Angular framework.
Included:
- penny-track.zip
- penny_track.sql
- Readme.txt

*Prerequisite software are required to run the project.
Requirements:
- XMAPP
- Node.js
- Angular cli

*Installations
Prerequisite software installer:
1) Go to the official XAMPP website for download and install
-> https://www.apachefriends.org/index.html
# XAMPP version 3.2.2 or above

2) Go to the official Node.js website for download and install
-> https://nodejs.org/en/download/

3) After the Node.js installed, open up windows command prompt an paste in
-> npm install -g @angular/cli
# To install the latest global Angular cli

*Setup the project.
Project:
1) "Extract here" the penny-track.zip
2) Make sure the project folder layout has "...\penny-track\penny_track".
3) Go to XAMPP installed folder and click into "htdocs".
4) Create a new folder name "project".
5) Move the entire extracted "penny-track" folder into the newly created "project" folder.
6) Make sure the placed path is "..\xampp\htdocs\project\penny-track\...".

# May affect the project functionality if placed in wrong path

Database:
1) Starts XAMPP Control Panel.
2) Starts the Apache and MySQL services.
3) Open browser and go to "http://localhost/phpmyadmin/index.php".
4) Go to Import tab at the top menu in phpMyAdmin.
5) Click "Choose File".
6) Select "penny_track.sql" and click "Go"

# If the above steps unable to import the database, try below:
1) Create a new empty database name "penny_track".
2) Go to Import tab at the top menu and import the "penny_track.sql" again.

*After everything are set and installed complete.
Start the project:
1) Go to "..\xampp\htdocs\project\penny-track\penny_track"
2) While at the place, click on the file path box of your file explorer. 
3) Replace and type in "cmd" in the path box then press enter.
4) A command prompt will show up and is at the exect path of "..\xampp\htdocs\project\penny-track\penny_track>".
5) Type in "ng serve" and *select "no" send anonymous data if appeared.
6) After the project build is completed, go to "localhost:4200/#/".
7) You are good to go.

==============================
*Default web URL
--> "localhost:4200/" or "localhost:4200/#/"

# Note that you are able to test the system by creating a new account at Register page.
Or
# Use the existed dummy/test accounts.


*Existed dummy/test accounts:

email:		yiwen@gmail.com
password:	102099

email:		test1@gmail.com
password: 	123456
    
email:		test2@gmail.com
password:	654321

email:		test3@gmail.com
password:	987654321

email:		test4@gmail.com
password:	123456789



#Project of CHOOI YI WEN - 0195519 (Penny Track)