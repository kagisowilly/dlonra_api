const express = require('express');
const mysql = require("mysql");
const app = express();
const cors = require("cors");
require("dotenv").config();

// setting up cors config
app.use(cors());

app.use(express.json());
// Create connection
const mydatabase = mysql.createConnection({
  host: process.env.HOSTT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASSE,
});

mydatabase.connect((err) =>{
  if(err) throw err
  console.log("You are Connected")
})

// Register a user
app.post("/register", (req, res) => {
  const { name, surname, email } = req.body;
  mydatabase.query("SELECT COUNT(*) AS cnt FROM tusers WHERE email = ? " , 
email , function(err , data){
   if(err){
       console.log(err);
   }   
   else{
       if(data[0].cnt > 0){  
        let message  = "Email exists";
          res.status(409).json(message)
             console.log("email alredy exists")
       }else{
           mydatabase.query(`INSERT INTO tusers (name, surname, email) VALUES ('${name}', '${surname}', '${email}')` , function(err , insert){
               if(err){
                console.log(err)
               }else{
                  //  return "User created"
                  // console.log()
                  res.status(200).json("You are registered")
               }
           })                  
       }
   }
})

});

// GET USERS 
 app.get('/users', (req, res) =>{
  let sql = 'SELECT * FROM tusers';
  mydatabase.query(sql, (err, usersdata,) => {
    res.json({usersdata});
    }
  )
  .on("error", () => rej({ err: "Could not fetch all users" }));
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("Listening on port 7000");
});
