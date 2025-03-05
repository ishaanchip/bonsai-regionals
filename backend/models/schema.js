const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const bonsaiAccountSchema = new Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    current_balance:{type:Number},
    projection_date:{type:Object},
    account_income: {type: [Object]},
    account_spending: { 
        type: Map,  
        of: [Object], 
        default: {
        } 
    }
})



const BonsaiAccounts = mongoose.model('bonsai_accounts', bonsaiAccountSchema, 'accounts');


const mySchemas = {'BonsaiAccounts':BonsaiAccounts}

module.exports = mySchemas;