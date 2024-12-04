const Task = require("../../models/task.models")
const User = require("../../models/user.models")

const allTask = async(req,res)=>{
    try {
        console.log("User",req.user)
        if(req.user.role === 'user'){
            console.log(req.user.id)
            let userTask = await Task.find({createdBy:req.user.id})
            res.status(201).send({success:true,message:userTask})
        }
        if(req.user.role === 'admin'){
            let allTask = await Task.find()
            res.status(201).send({success:true,message:allTask})
        }        
    } catch (error) {
        console.log("Error in AllTask Task controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}


const AddTask = async(req,res)=>{
    try {
        let {title,description,status,dueDate,priority,createdBy} = req.body
        if(req.user.role === 'user'){
            let countTask = await Task.find({status:"pending"})
            if(countTask.length <=10){
                let createdby = req.user.id
                let TaskObj = new Task({
                    title,
                    description,
                    status,
                    dueDate,
                    priority,
                    createdBy:createdby
                })
                await TaskObj.save();
                res.status(201).send({success:true,message:TaskObj})
            }else{
                res.status(404).send({ success: false, message: 'Task limit exceeded (10 tasks). Clear Pending Tasks!!!' }); 
            }
        }

        if(req.user.role === 'admin'){
            if (!createdBy) {
                createdBy = req.user._id; 
            }
            let TaskObj = new Task({
                title,
                description,
                status,
                dueDate,
                priority,
                createdBy
            })
            await TaskObj.save();
            res.status(201).send({success:true,message:TaskObj})
        }
    } catch (error) {
        console.log("Error in AddTask Task controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const UpdateTask = async(req,res)=>{
    try {
        let {title,description,status,dueDate,priority,createdBy} = req.body
        let {TaskID} = req.params;
        if(req.user.role === 'user'){
            let createdby = req.user.id
            let UpdateTask = await Task.findByIdAndUpdate({
                _id:TaskID,
                title,
                description,
                status,
                dueDate,
                priority,
                createdBy:createdby,
            })
            if (!UpdateTask) {
                return res.status(404).send({ success: false, message: 'Task not found or unauthorized' });
            }
            res.status(200).send({ success: true, message: 'Task updated successfully', task: UpdateTask });

        }
        if(req.user.role === 'admin'){
            let task = await Task.findOne({createdBy:TaskID})
            let AdminUpdateTask = await Task.findByIdAndUpdate({
                _id:TaskID,
                title,
                description,
                status,
                dueDate,
                priority,
                createdBy:task.createdBy,
            })
            if (!UpdateTask) {
                return res.status(404).send({ success: false, message: 'Task not found or unauthorized' });
            }
            res.status(200).send({ success: true, message: 'Task updated successfully', task: AdminUpdateTask });
        }   
    } catch (error) {
        console.log("Error in UpdateTask Task controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const DeleteTask = async(req,res)=>{
    let {DeleteTaskID} = req.params;
    try {
        let UserCheck = await Task.findOne({_id:DeleteTaskID})
        let Users = await User.findOne({_id:UserCheck.createdBy})
        console.log("abcd",Users)
        if(Users.role === 'user'){
            let data= await Task.findByIdAndDelete(DeleteTaskID)
            res.status(200).send({ success: true, message: 'Task Delete successfully.', task: data});
        }else{
            res.status(404).send({ success: true, message: 'Task not Delete or unauthorized From Admin.'});
        }
    } catch (error) {
        console.log("Error in DeleteTask Task controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}


const TaskFiltering = async(req,res)=>{
    try {
        let {status,dueDate} = req.query;
        let filtering = {}

        if(status) filtering.status = status;
        if (dueDate) filtering.dueDate = { $lte: new Date(dueDate) };

        const tasks = await Task.find(filtering);
        res.status(200).send({ success: true, tasks });
    } catch (error) {
        console.log("Error in TaskFiltering Task controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}
module.exports = {allTask,AddTask,UpdateTask,DeleteTask,TaskFiltering}