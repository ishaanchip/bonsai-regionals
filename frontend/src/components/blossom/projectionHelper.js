import axios from "axios";
import { dateDisplay } from "../standardHelper";

//routes

//simple fetching of user account
export const fetchUserBalance = async(username) =>{
    try{
        const result = await axios.get(`${import.meta.env.VITE_API_URL}get-account-balances/${username}`)
        return result.data.result;
    }
    catch(err){
        console.log(`there was a frontend error in fetching user balances: ${err}`)
    }
}

//updating user account
export const updateUserBalance = async(username ,currentBalance, dateRange) =>{
    try{
        let postData = {
            username:username,
            currentBalance:currentBalance,
            dateRange:dateRange
        }
        const userCurrentBalance = await axios.put(`${import.meta.env.VITE_API_URL}update-account-balances`, postData)
        console.log(userCurrentBalance)
        
    }
    catch(err){
        console.log(`there was a frontend error in updating user balances: ${err}`)
    }
}



//helper func to format retrieved data of user
export const pdfIncomeExpenseData = async(username) =>{
    try{
        const userDataContext = await fetchUserBalance(username)

        //format income & expenses so i can pass through
            let arrayedIncome = [];
            userDataContext.account_income.forEach((source)=>{
                arrayedIncome.push(source['name'] + "- $"+ source['amount'] + ": " + source['frequency'] + " (" + dateDisplay(source['start_date'], source['end_date']) + ")");
            })

            let arrayedExpenses = [];

            for (let key in userDataContext.account_spending){
                userDataContext.account_spending[key].forEach((source)=>{
                    arrayedExpenses.push(source['name'] + "- $"+ source['amount'] + ": " + source['frequency'] + " (" + dateDisplay(source['start_date'], source['end_date']) + ")")
                })
            }
            

        return {incomeData: arrayedIncome, expenseData:arrayedExpenses};
    }
    catch(err){
        console.log(`There was an error in frontend fetching user data: ${err}`)
    }
}