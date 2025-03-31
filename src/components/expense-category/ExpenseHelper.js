import axios from "axios"

//routing functionality


    //adding expense source to backend
        export const addExpenseSource = async(username, position, salary, pay, startDate, endDate, expenseId, expenseType) =>{
            try{
                let postData = {username:username, position:position, salary:salary, pay:pay, startDate:startDate, endDate:endDate, expenseId: expenseId, expenseType:expenseType}
                const result = await axios.put(`${import.meta.env.VITE_API_URL}add-expense-source`, postData)
                console.log(result.data)
                if (result.data.success === true){
                    console.log('adding expense source was a sucess!');
                }
                else{
                console.log('adding expense source was NOT a success...');
                }
            }
            catch(err){
                console.log(`There was an error in frontend adding expense source: ${err}`)
            }

        }

    //retrieving expense sources
    export const fetchExpenseSource = async(username, expenseType) =>{
        try{
            const result = await axios.get(`${import.meta.env.VITE_API_URL}fetch-user-expense/${username}`)
            console.log(result.data.result.account_spending)
            return result.data.result.account_spending[expenseType];
        }
        catch(err){
            console.log(`There was an error in frontend fetching expense source: ${err}`)
        }
    }

    //deleting income source 
    export const deleteExpenseSource = async( username, expenseId, expenseType) =>{
        try{
            let postData = {expenseId:expenseId, username:username, expenseType:expenseType}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}delete-expense-source`, postData)
            console.log(result.data)
            if (result.data.success === true){
                console.log('deleting expense source was a sucess!');
            }
            else{
            console.log('deleting expense source was NOT a success...');
            }
        }
        catch(err){
            console.log(`There was an error in frontend deleting expense source: ${err}`)
        }

    }

    //editing income source in backend
    export const editExpenseSource = async(username, position, salary, pay, startDate, endDate, expenseId, expenseType) => {
        try{
            let postData = {username:username, position:position, salary:salary, pay:pay, startDate:startDate, endDate:endDate, expenseId: expenseId, expenseType:expenseType}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}editing-expense-source`, postData)
            console.log(result.data)
            if (result.data.success === true){
                console.log('editing expense source was a sucess!');
            }
            else{
            console.log('editing income source was NOT a success...');
            }
        }
        catch(err){
            console.log(`There was an error in frontend editing income source: ${err}`)
        }
    }

    export const convertExpenseType = (expenseType) =>{
        const conv = {
            "food_and_drink":"Food & Drink",
            "essentials":"Essentials",
            "recurring_expenses":"Recurring Expenses",
            "entertainment":"Entertainment"
        }
        return conv[expenseType];
    }




//SCHEMA
export const dummyData = {
    "entertainment":[
        {     
            "name":"Minigolf",
            "amount":30,
            "frequency":"Daily",
            "start_date":"2025-03-27",
            "end_date":"2025-03-27",
            "expense_id":"chippy-minigolf-33"
        },
    ],

    "essentials":[
        {     
            "name":"AP Psych Textbook",
            "amount":200,
            "frequency":"Daily",
            "start_date":"2024-08-27",
            "end_date":"2024-08-27",
            "expense_id":"chippy-ap psych textbook-78"
        },
       
    ],

    "food_and_drink":[
        {     
            "name":"Taco Bell",
            "amount":15,
            "frequency":"Daily",
            "start_date":"2023-02-27",
            "end_date":"2023-02-27",
            "expense_id":"chippy-taco bell-18"
        },
        {     
            "name":"Chipotle",
            "amount":12,
            "frequency":"Daily",
            "start_date":"2024-11-05",
            "end_date":"2024-11-05",
            "expense_id":"chippy-chipotle-75"
          },
    ],

    "recurring_expenses":[
        {
            "name":"Tesla Payments",
            "amount":1500,
            "frequency":"Monthly",
            "start_date":"2023-08-23",
            "end_date":"2025-03-25",
            "expense_id":"chippy-tesla payments-32"
        },
        {
            "name":"Netflix",
            "amount":20,
            "frequency":"Monthly",
            "start_date":"2024-10-23",
            "end_date":"2025-05-31",
            "expense_id":"chippy-netflix-24"
        },
    ]

}

