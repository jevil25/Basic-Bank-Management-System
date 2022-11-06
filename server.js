//packages
const express = require("express"); //interact with html file
const bodyParser=require("body-parser"); //to get data from user
const mongoose=require("mongoose"); //package to connect to db
const hbs=require("express-handlebars");//used for hbs file soo as to use js componenets for displaying images
const { handlebars } = require("hbs");

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
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
});

const historySchema=new mongoose.Schema({
    saccount:{
        type:Number,
        required:true
    },
    raccount:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
})

const bank = new mongoose.model("accounts", bankSchema);
const history = new mongoose.model("history",historySchema);

module.exports={bank,history}; //sends data to database

const app=express();
app.set('view engine', 'hbs') //view engine for handlebars page
app.use(express.static(__dirname));
const path=__dirname;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT || 3001,function(){
    console.log("server is live on 3001")
});

app.get('/',function(req,res){ //used to identify user sessions
    res.sendFile("/index.html");
});

app.post('/trans', async function(req,res){
    const senderacc=req.body.saccno;
    const recacc=req.body.raccno;
    try{
    const rec=await bank.findOne({accno:recacc});
    const send=await bank.findOne({accno:senderacc});
    if(send && rec){
        const amount=req.body.amount;
        if(Number(send.balance)>=Number(amount)){
            rec.balance=Number(rec.balance)+Number(amount);
            await bank.updateOne({id:rec.id},{
                $set:{
                    balance:rec.balance                //balance field gets updated in db
                }
        })
            const send=await bank.findOne({accno:senderacc});
            send.balance=Number(send.balance)-Number(amount);
        await bank.updateOne({id:send.id},{
            $set:{
                balance:send.balance                //balance field gets updated in db
            }
    })
    const transdat=new history({
        amount:amount,
        saccount:senderacc,
        raccount:recacc
    })
    await transdat.save();
    }else{
        console.log("low balance")
    }
    const useremail=await bank.find();
    res.render("customers",{info:useremail});
    }else{
        res.send("invalid acc no")
    }
    }catch(err){
        res.send(err);
    }

})

app.post('/customers',async function(req,res){
    // const temp=new bank({
    //     name:"Shruti",
    //     accno:9009,
    //     balance:3777697,
    //     id:10,
    //     email:shruti@gmail.com
    // })
    // await temp.save();
    const useremail=await bank.find();
    res.render("customers",{info:useremail});
})

app.post('/expand',async function(req,res){
    aid=req.body.id;
    const user=await bank.findOne({id:aid});
    res.render("transfer",{info:user});
})

app.post('/history',async function(req,res){
    const user=await history.find();
    res.render("history",{info:user});
})