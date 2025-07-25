const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat");
const methodOverride = require('method-override');
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
    await mongoose.connect("mongodb://localhost:27017/whatsapp");
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
app.get("/chats",async (req,res)=>{
    let chats= await Chat.find();
    // console.log(chats);
    res.render("home",{chats});
})
//new route
app.get("/chats/new",(req,res)=>{
    res.render("new");
})
app.post("/chats",(req,res)=>{
    let {from,to,msg}=req.body;
    let newchat=new Chat({
        from:from,
        msg:msg,
        to:to,
        created_at:new Date()
    });
    console.log(newchat);
    newchat.save().then(res=>console.log("chat saved success to db"))
    .catch(err=>console.log(err));
    res.redirect("/chats");
})
//edit route
app.get("/chats/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit",{chat});
})
//update route
app.put("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let {msg}=req.body;
    console.log(msg);
    let newmsg=await Chat.findByIdAndUpdate(id,{$set:{msg}},{new:true,runValidators:true});
    console.log(newmsg);
    res.redirect("/chats");
})
//delete route
app.delete("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let deletechat=await Chat.findByIdAndDelete(id);
    console.log(deletechat);
    res.redirect("/chats");
})
app.listen(port,()=>{
    console.log(`server started at ${port}`);
})