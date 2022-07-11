var mg=require("mongoose")


var user_taskSchema=new mg.Schema({
    email:{
        type:String,
        unique:true
    },
    name:{
        type:String,
    },
    password:{
        type:String
    },
    task:{
        type:Array,
        default:[]
    }
})


var user_taskModel = mg.model("tasks",user_taskSchema)

module.exports=user_taskModel