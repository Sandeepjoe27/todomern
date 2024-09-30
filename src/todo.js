import { useEffect, useState } from "react"

export function Todo()
{
    const[title, setTitle]= useState("");
    const[description, setDescription]= useState("");
    const[todos ,setTodos] = useState([]);
    const[message, setMessage]= useState([]);
    const[error, setError]= useState([]);
    const[editid, setEditid]=useState(-1);


    const[edittitle, setEditTitle]= useState("");
    const[editdescription, setEditDescription]= useState("");
    const apiUrl="http://localhost:8000"
    const handleSubmit= ()=>{
        setError("")
        //checking
        if(title.trim()!=='' && description.trim()!=='')
        {
            fetch(apiUrl+"/todo",{ //taking the url add /todo with the base url 
                method:"POST", //choosing the method type whether used to add the item or delete or etc..
                headers:{
                    'Content-Type':'application/json' //choosing the content type that sending data is the json data
                },
                body:JSON.stringify({title,description}) //what are the value we are sending 
            }).then((res)=>{
                //add the item
                if(res.ok)
                {
                    setTodos([...todos, {title, description}]) //spread operator
                    setTitle("");
                    setDescription("");
                    setMessage("Item Added")
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                }else{
                    //set error
                    setError("Unable to create the todo");
                }
            }).catch(()=>{
                setError("Unable to create the todo");
            })
            
        }
    }
    useEffect(()=>{
        getItems()
    },[])

    const getItems = ()=>{
        fetch(apiUrl+"/todo")
        .then((res)=>{
            return res.json()
        })
        .then((res)=>{
            setTodos(res)
        })
    }

    const handleEdit = (item)=>
    {
        setEditid(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description)
    }

    const handleUpdate = () =>
    {
        setError("")
        //checking
        if(edittitle.trim()!=='' && editdescription.trim()!=='')
        {
            fetch(apiUrl+"/todo/"+editid,{ //taking the url add /todo with the base url 
                method:"PUT", //choosing the method type whether used to add the item or delete or etc..
                headers:{
                    'Content-Type':'application/json' //choosing the content type that sending data is the json data
                },
                body:JSON.stringify({title : edittitle ,description : editdescription}) //what are the value we are sending 
            }).then((res)=>{
                //update the item
                if(res.ok)
                {
                   const updatedtodos = todos.map((item)=>{
                        if(item._id == editid)
                        {
                            item.title =edittitle;
                            item.description=editdescription;
                        }
                        return item;
                    })

                    setTodos(updatedtodos)
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item Updated")
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                    setEditid(-1)
                }else{
                    //set error
                    setError("Unable to create the todo");
                }
            }).catch(()=>{
                setError("Unable to create the todo");
            })
            
        }
    }
    const handleditcancel = () =>
    {
        setEditid(-1)
    }

    const handledelete = (id) => {
        if(window.confirm('Are going to delete'))
        {
            fetch(apiUrl+"/todo/"+id,{
                method: "DELETE"
            }).then(()=>{
                const updatedtodos = todos.filter((item)=>item._id !==id)
                setTodos(updatedtodos)
            })
        }
    }

    return<>
    <div className="row p-3 bg-success text-light">
        <h1>Todo component work</h1>
    </div> 
    <div className="row ">
        <h3>Add Items</h3>
        {message &&<p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
            <input placeholder="Title" onChange={(e)=> setTitle(e.target.value)} value={title} className="form-control" type="text"/>
            <input placeholder="Description" onChange={(e)=> setDescription(e.target.value)} value={description} className="form-control" type="text"/>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>   
        </div>
        {error &&<p className="text-danger">{error}</p> }
    </div>

    <div className="row mt-3">
        <h3>Task</h3>
        <div className="col-md-6">
        <ul className="list-group">
            {
                todos.map((item)=><li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column me-2">
                    {
                        editid==-1 || editid !==item._id ? <>
                        <span className="fw-bold">{item.title}</span>
                        <span className="fw-bold">{item.description}</span>
                        </>: <>
                        <div className="form-group d-flex gap-2">
                            <input placeholder="Title" onChange={(e)=> setEditTitle(e.target.value)} value={edittitle} className="form-control" type="text"/>
                            <input placeholder="Description" onChange={(e)=> setEditDescription(e.target.value)} value={editdescription} className="form-control" type="text"/>   
                        </div>
                        </>
                    }
                </div>
                <div className="d-flex gap-2">
               {editid==-1 || editid !==item._id ?
                <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>
                 :<button className="btn btn-warning" onClick={handleUpdate}>Update</button>
               } 
                {editid==-1 ? <button className="btn btn-danger"onClick={()=>handledelete(item._id)}>Delete</button>
                : <button className="btn btn-danger" onClick={handleditcancel}>Cancel</button>}
                </div>
            </li>
                )
            }
            
        </ul>
        </div>
        
    </div>
    </>
}