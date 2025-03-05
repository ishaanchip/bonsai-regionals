import axios from "axios"
import { fetchUserBalance } from "./projectionHelper";


export const retrieveBlossomResponse = async(username, query) =>{
    try{
        const userDataContext = await fetchUserBalance(username)
        console.log(userDataContext)

        //format income & expenses so i can pass through
            let stringedIncome = "";
            userDataContext.account_income.forEach((source)=>{
                stringedIncome += "\n" + source['name'] + " $"+ source['amount'] + " with frequency of " + source['frequency']
            })

            let stringedExpenses = "";

            for (let key in userDataContext.account_spending){
                stringedExpenses += key;
                userDataContext.account_spending[key].forEach((source)=>{
                    stringedExpenses += "\n" + source['name'] + " $"+ source['amount'] + " with frequency of " + source['frequency']
                })
                stringedExpenses += "\n\n"
            }
            
        console.log(stringedExpenses)
        const postData = {
            query:query,
            userIncome: stringedIncome,
            userExpenses: stringedExpenses
        }
        const result = await axios.post(`${import.meta.env.VITE_API_URL}retrieving-blossom-response`, postData)
        console.log(result.data.result.choices[0].message.content);
        return result.data.result.choices[0].message.content;
    }
    catch(err){
        console.log(`There was an error in frontend fetching ai response: ${err}`)
    }
}