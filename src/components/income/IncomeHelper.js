import axios from "axios"

//routing functions
    //adding income source to backend
        export const addIncomeSource = async(username, position, salary, pay, startDate, endDate, incomeId) =>{
            try{
                let postData = {username:username, position:position, salary:salary, pay:pay, startDate:startDate, endDate:endDate, incomeId: incomeId}
                const result = await axios.put(`${import.meta.env.VITE_API_URL}add-income-source`, postData)
                console.log(result.data)
                if (result.data.success === true){
                    console.log('adding income source was a sucess!');
                }
                else{
                console.log('adding income source was NOT a success...');
                }
            }
            catch(err){
                console.log(`There was an error in frontend adding income source: ${err}`)
            }

        }

    //retrieving income sources
    export const fetchIncomeSource = async(username) =>{
        try{
            const result = await axios.get(`${import.meta.env.VITE_API_URL}fetch-user-income/${username}`)
            return result.data.result.account_income;
        }
        catch(err){
            console.log(`There was an error in frontend fetching income source: ${err}`)
        }
    }

    //deleting income source 
    export const deleteIncomeSource = async(incomeId, username) =>{
        try{
            let postData = {incomeId:incomeId, username:username}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}delete-income-source`, postData)
            console.log(result.data)
            if (result.data.success === true){
                console.log('deleting income source was a sucess!');
            }
            else{
            console.log('deleting income source was NOT a success...');
            }
        }
        catch(err){
            console.log(`There was an error in frontend deleting income source: ${err}`)
        }

    }

    //editing income source in backend
    export const editIncomeSource = async(username, position, salary, pay, startDate, endDate, incomeId) => {
        try{
            let postData = {username:username, position:position, salary:salary, pay:pay, startDate:startDate, endDate:endDate, incomeId: incomeId}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}editing-income-source`, postData)
            console.log(result.data)
            if (result.data.success === true){
                console.log('editing income source was a sucess!');
            }
            else{
            console.log('editing income source was NOT a success...');
            }
        }
        catch(err){
            console.log(`There was an error in frontend editing income source: ${err}`)
        }
    }

  export const sampleData = [
    // {
    //     "position":"Doctor",
    //     "salary":500000,
    //     "pay":"Annual",
    //     "start_date": "2024-10-23",
    //     "end_date": ""
    // },
    // {
    //     "position":"Tutor",
    //     "salary":1000,
    //     "pay":"Weekly",
    //     "start_date": "2023-12-2",
    //     "end_date": "2024-1-25"
    // },
    // {
    //     "position":"Massager",
    //     "salary":5000,
    //     "pay":"Biweekly",
    //     "start_date": "2020-8-2",
    //     "end_date": "2023-10-10"
    // },
    // {
    //     "position":"Engineer",
    //     "salary":150000,
    //     "pay":"Annual",
    //     "start_date": "2023-9-24",
    //     "end_date": ""
    // },


]