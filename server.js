//packages
const express = require("express"); //interact with html file
const bodyParser=require("body-parser"); //to get data from user
const mongoose=require("mongoose"); //package to connect to db
const hbs=require("express-handlebars");//used for hbs file soo as to use js componenets for displaying images

mongoose.connect("mongodb+srv://jevil2002:aaron2002@jevil257.lipykl5.mongodb.net/bank",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    //useCreateIndex:true
}).then(()=>{
    console.log("connection sucessfull");
}).catch((e)=>{
    console.log(e);
});

const bankSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    accno:{
        type:String,
        required:true,
        unique:true
    },
    balance:{
        type:String,
        required:true,
        unique:true
    },
    id:{
        type:Number,
        required:true,
        unique:true
    }
});

const bank = new mongoose.model("accounts", bankSchema);

module.exports={bank}; //sends data to database

const app=express();
app.use(express.static(__dirname));
const path=__dirname;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3001,function(){
    console.log("server is live on 3001")
});

app.get('/',function(req,res){ //used to identify user sessions
    res.sendFile(path+"/index.html");
});

app.post('/trans', function(req,res){
    console.log("hii");
})

app.set('view engine', 'hbs') //view engine for handlebars page

app.post('/customers',async function(req,res){
    // const temp=new bank({
    //     name:"Shruti",
    //     accno:9009,
    //     balance:3777697,
    //     id:10
    // })
    // await temp.save();
    const useremail=await bank.find();
    res.render(path+"/customers.hbs",{info:useremail});
})


