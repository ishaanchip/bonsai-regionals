import axios from "axios";

//initializes bonsai account
export const createBonsaiAccount = async(username, email)=>{
    try{
        let postData = {username:username, email:email}
        const result = await axios.post(`${import.meta.env.VITE_API_URL}create-bonsai-account`, postData)
        if (result.data.success === true){
            console.log('creating || logging into account was a sucess!');
          }
          else{
            console.log('creating account was NOT a success...');
          }
    }
    catch(err){
        console.log(`there was an error posting account data in frontend: ${err}`)
    }

    
}