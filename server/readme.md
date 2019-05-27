Server Install Instructions

1. inside the server/ directory, install all the npm packages by  
`npm i`

2. Start postgreSQL container  
`docker-compose up`  
or  
`docker-compose up -d`  
to run the container in the background  

3. To run the server and check the content, 
`npm run dev`
go to localhost /users to check content of database.

TEST