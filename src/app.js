var express = require("express")
var port = process.env.PORT || 3000
var app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
require("../mongoose/connection")
var modeltsk=require("../mongoose/model")

app.post("/register",async(req,res)=>{
    try{
        var user = new modeltsk(req.body)
        await user.save()
        return res.json({"message":"Account has been created you can start adding your tasks"})
    }catch(e){
        return res.json({"error":"email-Id already exist try using different one!"})
    }
})

app.post("/login",async(req,res)=>{
    try{
        var user=await modeltsk.findOne({"email":req.body.email})
        if(user.password == req.body.password){
            return res.json(user)
        }
        res.json({"message":"password doesn't match"})
    }catch(e){
        res.json({"error":"problem at our end.."})
    }
})


app.get("/getall/:id",async(req,res)=>{
    try{
        var tasks=await modeltsk.findById({_id:req.params.id})
        if(tasks.task.length>0){
            return res.json(tasks.task)
        }
        return res.json({"message":"Zero bucket list"})
    }catch(e){
        res.status(403).send()
    }
})

app.post("/addtask/:id",async(req,res)=>{
    try{
        var user=await modeltsk.findById({_id:req.params.id})
        var tsk={task:req.body.task,status:false}
        user.task.push(tsk)
        await user.save()
        res.json({"message":"Task created"})
    }catch(e){
        console.log(e)
        res.json({"error":"something went wrong"})
    }
})

app.delete("/delete/:id",(async(req,res)=>{
    try{
        await modeltsk.findOneAndDelete({_id:req.params.id})

        res.json({"message":"You no more have access to your account!"})
    }catch(e){
        res.json({"error":"something went wrong while dleteing your account"})
    }
}))


app.put("/deleteall/:id",async(req,res)=>{
    try{
        await modeltsk.findByIdAndUpdate({_id:req.params.id},{task:[]})
        return res.json({"message":"Tasks deleted"})
    }catch(e){
        res.json({"error":"something went wrong"})
    }
})

app.put("/updatetask/:id",async(req,res)=>{
    try{
        var user=await modeltsk.findById({_id:req.params.id})
        user.task.forEach((ele)=>{
            if(ele._id == req.body._id){
                ele.status=!ele.status
            }
        })
        await modeltsk.findByIdAndUpdate({_id:req.params.id},{task:user.task})
        return res.json({"message": "task updated!"})
    }catch(e){
        res.json({"error":"something went wrong"})
    }
})

app.put("/deletetask/:id",async(req,res)=>{
    try{
        var user=await modeltsk.findById({_id:req.params.id})
        var tsks=[]
        for(var i=0;i<user.task.length;i++){
            if(req.body._id-1 != i){
                tsks.push(user.task[i])
            }
        }
        await modeltsk.findByIdAndUpdate({_id:req.params.id},{task:tsks})
        res.json({"message":"tasks deleted"})
    }catch(e){
        res.json({"error":"error deleteing the task"})
    }
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}.`)
})