const path=require("path"),mysql=require("mysql"),env=require(path.join(__dirname,"env.json")),con=mysql.createConnection({host:env[process.env.NODE_ENV].database.host,user:"root",password:"raspberry",database:"raspisms",multipleStatements:!0});con.connect(e=>{if(e)throw e;console.log("Connected!")}),module.exports=con;