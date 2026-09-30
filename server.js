require("dotenv").config();
require("./src/listeners");
const app = require('./src/app');
const connectDB = require("./src/config/db")


connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running at port:${process.env.PORT}`)
    })
})
