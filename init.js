const mongoose=require("mongoose");
const Chat=require("./models/chat");
main()
.then(()=>console.log("connection succesfull ji"))
.catch((err)=>console.log(err));
async function main(){
    await mongoose.connect("mongodb://localhost:27017/fakewhatsapp");
}
let allChats=[
    {
        from:"rahul",
        to:"sneha",
        msg:"I am the real don",
        created_at:new Date()
    },
    {
        from:"kalesh",
        to:"janpath",
        msg:"lets go to gym buddy",
        created_at:new Date()
    },
    {
        from:"piyush",
        to:"saksham",
        msg:"Hey kesa h bro",
        created_at:new Date()
    },
    {
        from:"Anuj",
        to:"Tushar",
        msg:"Mere msg bhi seen krliya kr kabhi",
        created_at:new Date()
    },
    {
        from:"Tuhar",
        to:"Divyanshu",
        msg:"Time to lock in!",
        created_at:new Date()
    },
]
Chat.insertMany(allChats);