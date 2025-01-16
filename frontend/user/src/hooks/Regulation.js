import axios from "axios";

const getAllRegulation = async () =>{
    try{
        const regulation = await axios.get('http://localhost:5555/regulations');
        return regulation.data
    }catch(err){
        console.error('Error get regulation:', err);
        throw err;
    }
}

export {getAllRegulation}