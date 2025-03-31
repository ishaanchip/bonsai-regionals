import {calculateIncomeInRange} from "../standardHelper"
import { getExpensesTotal } from "../expenses-options/expensesNavHelper"

//scales income for range for each item in user income, return list of income objects
  export const scaleTheData = (incomeData, range) =>{
    let jobHolder = []
    //account for object data passed in for EXPENSES NAV
      const translateKey = {
        "recurring_expenses": "Subscriptions / Recurring Expenses",
        "entertainment":"Entertainment",
        "food_and_drink":"Food & Drink",
        "essentials":"Essential Items"
      }
      if (!Array.isArray(incomeData)){
        incomeData = getExpensesTotal(incomeData, range)
        for (let key in incomeData){
          let finalAmount = incomeData[key]
          if (finalAmount > 0){
            jobHolder.push({
              name:translateKey[key],
              value:finalAmount
            })
          }
        }
        console.log(jobHolder)
        return jobHolder;
      }
      incomeData.forEach((job)=>{
          let jobIncome = calculateIncomeInRange(job, range);
          if (jobIncome > 0){
            jobHolder.push({
              name:job.name,
              value:jobIncome
            })
          }
      })

      return jobHolder

  }

    //getting correct word display on pie-charts
    export const getCorrectWording = (chartType) =>{
      if (chartType === "expenses-pie"){
          return ["Expense", "Expenses", "expense"]
      }
      else if (chartType === "income-pie"){
          return ["Income", "Revenue", "income"]
      }
  }

  //get sum of scaled data
  export const sumScaledData = (scaledData) =>{
    let sum = 0;
    for (let i = 0; i < scaledData.length; i++){
      sum += scaledData[i].value;
    }
    return sum;
  }

//date input helper functions & variables (UI, functionality)
  export const monthList = [
    {"January":1},
    {"February":2},
    {"March":3},
    {"April":4},
    {"May":5},
    {"June":6},
    {"July":7},
    {"August":8},
    {"September":9},
    {"October":10},
    {"November":11},
    {"December":12},
  ]

  export const monthObject = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  };


  export const generateYearSelection = () =>{
    let yearRange = 100;
    let yearHolder = [];
    for (let i = 2025; i > 2025 - yearRange; i--){
      yearHolder.push(i);
    }
    return yearHolder
  }

//input validator: if erroranous date range, will automatically switch to preset day amount
  export const correctInputDays = (startDay, endDay) =>{
    if (endDay > 31 || endDay < 1){
      endDay = 28;
    }
    if (startDay < 1){
      startDay = 1;
    }
    if (startDay > endDay){
      startDay = endDay;
    }
    return {
      "startDay":startDay,
      "endDay":endDay
    }
  }


//date formatter function (takes year month and days [ALL AS STRINGS] and makes a date) (returns both start & end date)
  export const getDataToDate = (year, month, startDay, endDay) =>{
    let startDate = "0000-00-00";
    let endDate = "0000-00-00";
    startDate = startDate.split("")
    endDate = endDate.split("")
    //populate year
      for (let i = year.length-1; i >= 0; i--){
        startDate[i] = year.split("")[i]
        endDate[i] = year.split("")[i]
      }
    //populate month
      if (month.length == 2){
        startDate[5] = month.split('')[0]
        startDate[6] = month.split('')[1]
        endDate[5] = month.split('')[0]
        endDate[6] = month.split('')[1]
      }
      else{
        startDate[6] = month.split('')[0]
        endDate[6] = month.split('')[0]
      }

    //populate days
      if (startDay.length == 2){
        startDate[8] = startDay.split('')[0]
        startDate[9] = startDay.split('')[1]
      }
      else{
        startDate[9] = startDay.split('')[0]
      }
      if (endDay.length == 2){
        endDate[8] = endDay.split('')[0]
        endDate[9] = endDay.split('')[1]
      }
      else{
        endDate[9] = endDay.split('')[0]
      }
    return {
      "customStartDay":startDate.join(""),
      "customEndDay":endDate.join("")
    }
  }