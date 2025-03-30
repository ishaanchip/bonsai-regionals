const express  = require("express");
const router = express.Router();
const schemas = require("../models/schema");
const OpenAI = require("openai")


//router.post(...)

//Home routes
    // //creating account
    router.post('/create-bonsai-account', async(req, res) =>{
        try{
            let {username, email} = req.body;

            //est query for account
            const accountQuery = schemas.BonsaiAccounts;

            //checks to see if user alr exists
            const userExists = await accountQuery.find({email:email})
            if (userExists.length === 0){                
                //preparing insert document
                    const bonsaiAccountInsert = {
                        username:username,
                        email:email,
                        current_balance:0,
                        projection_date:{
                            "start_date":"2025-03-01",
                            "end_date":"2025-03-28"
                        },
                        account_income:[],
                        account_spending:{
                            entertainment:[],
                            essentials:[],
                            food_and_drink:[],
                            recurring_expenses:[],
                        }
                    }
                //sending account to be made
                    const newAccount = new accountQuery(bonsaiAccountInsert)
                    const result = await newAccount.save()
                    console.log(result)
            }

            res.status(200).json({ success: true });

            

        }
        catch(err){
            console.log(`Errors posting/making account in backend: ${err}`)
        }
    })


//Income routes
    //adding user income source
    router.put("/add-income-source", async(req, res) =>{
        try{
            let {username, position, salary, pay, startDate, endDate, incomeId} = req.body;
            //est query for account
            const accountQuery = schemas.BonsaiAccounts;

            // const incomeSourceInsert = {
            //     "name":position,
            //     "amount":salary,
            //     "frequency":pay,
            //     "start_date":startDate,
            //     "end_date":endDate,
            //     "income_id":incomeId
            // }
            //#1 change
            const incomeSourceInsert = {
                "name":position,
                "amount":salary,
                "frequency":pay,
                "start_date":startDate,
                "end_date":endDate,
                "income_id":incomeId
            }
            const result = await accountQuery.updateOne(
                {"username":username},
                {$push:{account_income: incomeSourceInsert}}
                )

            if (result.modifiedCount >  0){
                res.status(200).json({success:true})
            }

        }
        catch(err){
            console.log(`There was an error in backend adding income source: ${err}`)
            res.status(500).json({ success: false, message: 'Server error' });
        }
    })

    //retrieving user income sources
    router.get('/fetch-user-income/:username', async(req, res)=>{
        try{
            let username = req.params.username
            const accountQuery = schemas.BonsaiAccounts;
            const result = await accountQuery.findOne(
                {username:username},
                {"account_income":1, _id:0}
            )
            console.log("success!");
            res.status(200).json({result})
        }
        catch(err){
            console.log(`There was an error fetching user income in backend: ${err}`)
        }
    })

    //deleting user income source
    router.put('/delete-income-source', async(req, res) =>{
        try{
            let {incomeId, username} = req.body;
            const accountQuery = schemas.BonsaiAccounts;
            const  result = await accountQuery.updateOne({username:username}, {$pull: {"account_income": {income_id:incomeId}}})
            console.log(result);
            if (result.modifiedCount >  0){
                res.status(200).json({success:true})
            }
        }
        catch(err){
            console.log(`There was an error deleting income source in backend: ${err}`);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    })

        //editing user income source
        router.put('/editing-income-source', async(req, res) =>{
            try{
                let {username, position, salary, pay, startDate, endDate, incomeId} = req.body;
                const accountQuery = schemas.BonsaiAccounts;
                //#2 change, field switcher
                const  result = await accountQuery.updateOne(
                    {username:username, "account_income.income_id": incomeId}, 
                    {$set: {"account_income.$[element]": {
                        "name":position,
                        "amount":salary,
                        "frequency":pay,
                        "start_date":startDate,
                        "end_date":endDate,
                        "income_id":incomeId
                    }}},
                    {arrayFilters: [{ "element.income_id": incomeId }] } 
                    )
                console.log(result);
                if (result.modifiedCount >  0){
                    res.status(200).json({success:true})
                }
            }
            catch(err){
                console.log(`There was an error deleting income source in backend: ${err}`);
                res.status(500).json({ success: false, message: 'Server error' });
            }
        })


//Expenses Routes

        router.put('/add-expense-source', async(req, res) =>{
            try{
                let {username, position, salary, pay, startDate, endDate, expenseId, expenseType} = req.body;
                //est query for account
                const accountQuery = schemas.BonsaiAccounts;
                const expenseSourceInsert = {
                    "name":position,
                    "amount":salary,
                    "frequency":pay,
                    "start_date":startDate,
                    "end_date":endDate,
                    "expense_id":expenseId
                }

                /*schema
                    account_spending:{
                        entertainment:[],
                        food_and_drink:[{expenseSourceInsert}, {expenseSourceInsert}]
                    }
                */
                

                const result = await accountQuery.updateOne(
                    {"username":username},
                    {$push:{[`account_spending.${expenseType}`]: expenseSourceInsert}}
                    )
    
                if (result.modifiedCount >  0){
                    res.status(200).json({success:true})
                }



    
            }
            catch(err){
                console.log(`There was an error in backend adding expense: ${err}`)
            }
        })

        //retrieving user expense sources
        router.get('/fetch-user-expense/:username', async(req, res)=>{
            try{
                let username = req.params.username
                const accountQuery = schemas.BonsaiAccounts;
                const result = await accountQuery.findOne(
                    {username:username},
                    {"account_spending":1, _id:0}
                )
                res.status(200).json({result})
            }
            catch(err){
                console.log(`There was an error fetching user expenses in backend: ${err}`)
            }
        })

        //deleting user income source
            router.put('/delete-expense-source', async(req, res) =>{
                try{
                    let {expenseType, expenseId, username} = req.body;
                    const accountQuery = schemas.BonsaiAccounts;
                    // {$push:{[`account_spending.${expenseType}`]: expenseSourceInsert}}
                    const  result = await accountQuery.updateOne({username:username}, {$pull: {[`account_spending.${expenseType}`]: {expense_id:expenseId}}})
                    console.log(result);
                    if (result.modifiedCount >  0){
                        res.status(200).json({success:true})
                    }
                }
                catch(err){
                    console.log(`There was an error deleting expense source in backend: ${err}`);
                    res.status(500).json({ success: false, message: 'Server error' });
                }
            })

        //editing user income source
        router.put('/editing-expense-source', async(req, res) =>{
            try{
                let {username, position, salary, pay, startDate, endDate, expenseId, expenseType} = req.body;
                const accountQuery = schemas.BonsaiAccounts;
                const  result = await accountQuery.updateOne(
                    {username:username, [`account_spending.${expenseType}.expense_id`]: expenseId}, 
                    {$set: {[`account_spending.${expenseType}.$[element]`]: {
                        "name":position,
                        "amount":salary,
                        "frequency":pay,
                        "start_date":startDate,
                        "end_date":endDate,
                        "expense_id":expenseId
                    }}},
                    {arrayFilters: [{ "element.expense_id": expenseId }] } 
                    )
                if (result.modifiedCount >  0){
                    res.status(200).json({success:true})
                }
            }
            catch(err){
                console.log(`There was an error deleting expense source in backend: ${err}`);
                res.status(500).json({ success: false, message: 'Server error' });
            }
        })



//BLOSSOM routing

    //initial retrieval of user pref
    router.get('/get-account-balances/:username', async(req, res) =>{
        try{
            let username = req.params.username;
            const accountQuery = schemas.BonsaiAccounts;
            const result = await accountQuery.findOne(
                {username:username},
                {"current_balance":1,  _id:0, "projection_date":1, "account_income":1, "account_spending":1}
            )
            res.status(200).json({result})
            
        }
        catch(err){
            console.log(`there was a backend error getting account balances: ${err}`)
        }
    })    
    //updating user balances and date preferences
    router.put('/update-account-balances', async(req, res) =>{
        try{
            let {username, currentBalance, dateRange} = req.body;
            const accountQuery = schemas.BonsaiAccounts;
            const result = await accountQuery.updateOne(
                {username: username},
                {$set: {"current_balance": currentBalance, "projection_date":dateRange}},
                
            )
            
            if (result.modifiedCount >  0){
                res.status(200).json({success:true, result})
            }
        }
        catch(err){
            console.log(`there was a backend error updating user current balance & dates: ${err}`)
            res.status(500).json({ success: false, message: 'Server error' });
        }
    })   

    //getting gpt response   
    router.post('/retrieving-blossom-response', async(req, res) =>{
        try{
            const {query, userIncome, userExpenses} = req.body;
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
              });

              
              
              const result = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                  {
                    "role": "system",
                    "content": [
                      {
                        "type": "text",
                        "text": "- Role:Financial assistant for  web application, bonsai, who tries to help clients optimize their cash flow and use the bonsai app\n\nFinancial Advice Guidelines:\n- Keep responses concise: no more than 3 sentences and less than 40 words\n- Recommendations should focus on cutting down non-essential expenditures, specifically those of the subscription type\n- No using real-world prices when factoring recommendations\n- All income and expenses source are relative to the filtered date range (example, if there is a daily source, but range only encompasses one day, that was a one time expense, it is not actually occurring daily. However, if there is a daily expense or income for a range that encompasses more than a day, that it truly recurring every single day for that period)\n\nBonsai Helper Guidelines:\n- Questions concerning usability of bonsai application should be answered using the FAQ context provided in this system message. If user ask question that is not answered in FAQ, kindly apologize, say you are of no help for this specific problem, and prompt them to ask another question\n\nOff Topic Question Guidelines:\n- If user asks question that is not directly related to managing their Bonsai account, do not offer your assistance. You are purely there to help users experience on this specific application, nothing more. \n\nUser Data Context: Income (if user ask about income, talk about this data)" +  userIncome + "\n\nUser Data Context: Expenses" + userExpenses +"\n \n\nFAQ Document:\n\nQuestion: How do I  sort expenses or income sources by price, date, or name?\nAnswer: Simply tap the header bar of the expense or income table. A star should appear next to the category being sorted\n\n\nQuestion: How do I customize the date ranges for the income or expenses display?\nPress the display on the right-side of the screen which contains the current range being calculated. You should find a pop-up which gives you access to change the date ranges\n\n\nQuestion: How do I change my current account balance in the blossom tab?\nAnswer: Click on the ‘Projections’ title with the current date range. This will give you access to change your current balance and the date range being calculated\n\n\nQuestion: How do I delete an expense or income source?\nAnswer: Press the pencil icon that appears on every source in the table. This will prompt you to a pop-up which gives you the ability to edit the income source. On the bottom of this pop-up, you can also press the red button which deletes the source. Note this action cannot be reversed. \n\n\nQuestion: Can I link a CSV file or an Excel spreadsheet that I have been logging my transactions on to Bonsai?\nAnswer: At the moment, Bonsai does not support importing external data sources. Our team is diligently working on this and it will be a feature in the near future. \n\n\n"

                      }
                    ]
                  },
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "text",
                        "text": "how do i edit one of my expense sources?"
                      }
                    ]
                  },
                  {
                    "role":"user",
                    "content":[
                        {
                            "type":"text",
                            "text":"list my top income sources"
                        }
                    ]
                  },
                  {
                    "role": "assistant",
                    "content": [
                      {
                        "type": "text",
                        "text": "To edit one of your expense sources, press the pencil icon that appears on the expense in the table. This will prompt a pop-up, giving you the ability to edit the expense source."
                      }
                    ]
                  },
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "text",
                        "text": "what stock should i invest in to increase my cashflow?"
                      }
                    ]
                  },
                  {
                    "role": "assistant",
                    "content": [
                      {
                        "type": "text",
                        "text": "I'm here to help you with managing your Bonsai account and optimizing your cashflow through the app. For specific investment advice, it might be best to consult a financial advisor or conduct personal research tailored to your financial goals. If you have any questions about using Bonsai, feel free to ask!"
                      }
                    ]
                  },
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "text",
                        "text": "i need more time. what income source should I drop while still being safe financially?"
                      }
                    ]
                  },
                  {
                    "role": "assistant",
                    "content": [
                      {
                        "type": "text",
                        "text": "Based on the income sources you provided, it seems you have a stable internship income. Dropping either the \"Lawn Mower\" or \"Stocks\" income might reduce your cashflow, but it's important to consider the stability and potential growth of each source. If you need to drop one, evaluate which is less essential or has less growth potential for your financial situation."
                      }
                    ]
                  },
                  {
                    "role":"user",
                    "content":[
                        {
                        "type":"text",
                        "text":query
                        }
                    ]
                  }
                ],
                response_format: {
                  "type": "text"
                },
                temperature: 0.3,
                max_completion_tokens: 2048,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
              });

              res.status(200).json({result})
            }
            catch(err){
                console.log(`There was an error getting blossom response: ${err}`)
            }
    })
    


    


module.exports = router;
