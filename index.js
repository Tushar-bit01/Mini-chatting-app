const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat");
const methodOverride = require('method-override');
const ExpressError=require("./ExpressError");
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const port=8080;
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
main()
.then(()=>console.log("connection succesfull ji"))
.catch((err)=>console.log(err));
async function main(){
    await mongoose.connect("mongodb://localhost:27017/fakewhatsapp");
}
// let chat1=new Chat({
//     from:"Tushar",
//     to:"priya",
//     message:"kesi h priya",
//     created_at:new Date()
// })
// chat1.save()
// .then(res=>console.log(res))
// .catch(err=>console.log(err));

app.get("/",(req,res)=>{
    res.send("workding ekdum fine ji");
})
//home route
app.get("/chats",asyncWrap(async (req,res)=>{
    let chats= await Chat.find();
    // console.log(chats);
    res.render("home",{chats});
}));
//new route
app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404,"page not found");
    res.render("new");
})
app.post("/chats",asyncWrap(async(req,res)=>{
    
        let {from,to,msg}=req.body;
    let newchat=new Chat({
        from:from,
        msg:msg,
        to:to,
        created_at:new Date()
    });
    // console.log(newchat);
    await newchat.save()//.then(res=>console.log("chat saved success to db"))
    res.redirect("/chats");
}));
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}
//show route-new
app.get("/chats/:id",asyncWrap(async (req,res,next)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    if(!chat){
        next(new ExpressError(404,"page not found"));
    }
    res.render("edit",{chat});
}));
//edit route
app.get("/chats/:id/edit",asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit",{chat});
}))
//update route
app.put("/chats/:id",asyncWrap(async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let {msg}=req.body;
    console.log(msg);
    let newmsg=await Chat.findByIdAndUpdate(id,{$set:{msg}},{new:true,runValidators:true});
    console.log(newmsg);
    res.redirect("/chats"); 
}));
//delete route
app.delete("/chats/:id",async(req,res)=>{
    try{
        let {id}=req.params;
    let deletechat=await Chat.findByIdAndDelete(id);
    console.log(deletechat);
    res.redirect("/chats");
    }catch(err){
        next(err);
    }
})
const handleValidationErr=(err)=>{
    console.log("validation error aagya h ");
    console.dir(err);
    return err;
}
app.use((err,req,res,next)=>{
    console.log("error aagya");
    console.log(err.name);
    if(err.name==="ValidationError"){
        handleValidationErr(err);
    }
    console.log(err.message);
    next(err);
})
app.use((err,req,res,next)=>{
    let {status=500,message="error occured"}=err;
    res.status(status).send(message);
});
app.listen(port,()=>{
    console.log(`server started at ${port}`);
})