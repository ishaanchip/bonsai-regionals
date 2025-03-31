//UI helper functions
    //formatting sample-date
    export const dateDisplay = (date1, date2) =>{
        let d1FormatSplit = date1.split("-")
        let finalD1 = d1FormatSplit[1] + "/" + d1FormatSplit[2] + "/" +d1FormatSplit[0].split("").splice(2, 2).join("")
        if (date2.length === 0){
            return finalD1
        }

        let d2FormatSplit = date2.split("-")
        let finalD2 = d2FormatSplit[1] + "/" + d2FormatSplit[2] + "/" +d2FormatSplit[0].split("").splice(2, 2).join("")
        return finalD1 + " - " + finalD2
        
    }
    //uppercase every word
    export const standardCaps = (str) =>{
        return str
        .split(' ')
        .filter(rawr => rawr !=="")
        .map(rawr => rawr[0].toUpperCase() + rawr.split('').splice(1, str.length).join('').toLowerCase())
        .join(' ')
    }

    //sorting income by category function
    export const sortIncomeSources = (data, sortCategory, ascending) =>{
        //helper variable to quantify pay rank
        let payPriority = {
        "Annual":5,
        "Monthly":4,
        "Biweekly":3,
        "Weekly":2,
        "Daily":1
        }
        //no sorting
        if (sortCategory === "none"){
            return data;
        }

        //sorting by salary
        if (sortCategory === "salary"){
            if (ascending === true)
            return [...data].sort((a, b) => a.amount - b.amount)
            
            else if (ascending === false)
            return [...data].sort((a, b) => b.amount - a.amount)
        }
        //sorting by alphabet
        if (sortCategory === "position"){
            if (ascending === true)
            return [...data].sort((a, b) => a.name.localeCompare(b.name))
            else if (ascending === false)
            return [...data].sort((a, b) => b.name.localeCompare(a.name))
        }
    
        //sorting by pay freq
        if (sortCategory === "pay"){
            if (ascending === true)
            return [...data].sort((a, b) => payPriority[a.frequency] - payPriority[b.frequency])
            else if (ascending === false)
            return [...data].sort((a, b) => payPriority[b.frequency] - payPriority[a.frequency])
        }
    
        //sorting by date (start-date)
        if (sortCategory === "date"){
        if (ascending === true)
            return [...data].sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    
        else if (ascending === false)
            return [...data].sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        }
        
    }
    



//user input validators
    //checks if all input fields filled out, returns appropiate error (no error, empty string)
    export const allFieldsFilled = (position, salary, start) => {
        let errorString = "";
        if (position.length === 0 && salary === 0 && start.length === 0){
        errorString += "Fill out all fields (position, salary, & start-date)"
        }
        else if (position.length === 0 && salary === 0 ){
        errorString += "Fill out all fields (position & salary)"
        }
        else if (salary === 0 && start.length === 0){
        errorString += "Fill out all fields (salary & start-date)"
        }
        else if (position === 0 && start.length === 0){
        errorString += "Fill out all fields (position & start-date)"
        }
        else if(position.length === 0){
        errorString += "Fill out all fields (position)"
        }
        else if(salary === 0){
        errorString += "Fill out all fields (salary)"
        }
        else if(start.length === 0){
        errorString += "Fill out all fields (start-date)"
        }
        return errorString
    }
    //verify if data ranges for income sources are valid (true -> valid, false -> invalid)
    export const checkDateRange = (start, end) =>{
        let startYr = parseInt(start.split("").splice(2, 2).join(""))
        let endYr =   parseInt(end.split("").splice(2, 2).join(""))
        if (startYr < endYr){
            return true;
        }
        else if (startYr > endYr){
            return false
        }

        let startMonth = parseInt(start.split("").splice(5, 2).join(""))
        let endMonth =   parseInt(end.split("").splice(5, 2).join(""))
        if (startMonth < endMonth){
        return true;
        }
        else if (startMonth > endMonth){
        return false
        }
        
        let startDay = parseInt(start.split("").splice(8, 2).join(""))
        let endDay=   parseInt(end.split("").splice(8, 2).join(""))
        if (startDay > endDay){
        return false
        }
        return true

    }

    //master function for verifying inputs 
    //(if some input empty, return according error in input)
    //(if date range invalid, return "start date cannot be after end date")
    //(if everything good, return true)
    export const verifyIncomeInput = (position, salary, start, end) =>{
        let filteredSalary = parseInt(salary)
        if (salary === ""){
            filteredSalary = 0;
        }
        //criteria
            //1. verifies all fields filled (excluding end date)
            let completeEntryError = allFieldsFilled(position, filteredSalary, start);
            if (completeEntryError.length > 0){
                return completeEntryError
            }

            //2. checks if start date is before end date
            let isDateValid = checkDateRange(start, end);
            if (!isDateValid){
                return "Start date cannot be after end date"
            }
            return true;
    }



//income summary helper functions (getting revenue for a range & total revenue of each source in range)
    //LIMITATION: WILL ONLY WORK IF RANGE START AND END ARE IN SAME MONTH 
    //(can find day amount among same month range)
    //ex: valid range {rangeStart: "2023/05/01", rangeEnd:"2023/05/31"}, {rangeStart: "2023/03/07", rangeEnd:"2023/03/14"}}
    //ex: invalid range (across multiple months) {rangeStart:"2023/04/01", rangeEnd:"2023/06/04"}
    const getDaysInRange = ({rangeStart, rangeEnd}, jobStart, jobEnd) =>{
        //get total days in range
        const startRangeDay = parseInt(rangeStart.split('').splice(8, 2).join(''));
        const endRangeDay = parseInt(rangeEnd.split('').splice(8, 2).join(''));
        const totalDaysInRange =  endRangeDay - startRangeDay + 1;
    
        //1. job in full range
        const jobStartBeforeRangeStart = checkDateRange(jobStart, rangeStart);
        const jobEndAfterRangeEnd = checkDateRange(rangeEnd, jobEnd);
    
        if (jobStartBeforeRangeStart && jobEndAfterRangeEnd){
        return totalDaysInRange
        }
    
        //2. job not in range at all
        const jobStartAfterRangeEnd = checkDateRange(rangeEnd, jobStart);
        const jobEndBeforeRangeStart = checkDateRange(jobEnd, rangeStart);
    
        if (jobStartAfterRangeEnd || jobEndBeforeRangeStart){
        return 0;
        }
    
        //3a. job start before range start, but job end before range end
        if (jobStartBeforeRangeStart && !jobEndAfterRangeEnd){
        const jobEndDay = parseInt(jobEnd.split('').splice(8, 2).join(''));
        return jobEndDay - startRangeDay + 1;
        }
    
        //3b. job start after range start, before range end and job end after range end
        if (!jobStartBeforeRangeStart && !jobStartAfterRangeEnd && jobEndAfterRangeEnd){
        const jobStartDay = parseInt(jobStart.split('').splice(8, 2).join(''));
        return endRangeDay - jobStartDay + 1;
        }
    
        //3c. job start after range start, before range end && job end after range start and before range end
        const jobStartBeforeRangeEnd = checkDateRange(jobStart, rangeEnd)
        if (!jobStartBeforeRangeStart && jobStartBeforeRangeEnd && !jobEndBeforeRangeStart && !jobEndAfterRangeEnd){
            const jobStartDay = parseInt(jobStart.split('').splice(8, 2).join(''));
            const jobEndDay = parseInt(jobEnd.split('').splice(8, 2).join(''));
            return jobEndDay - jobStartDay + 1;
        }
    }

  const incomeConverter = (payFrequency, salary) =>{
    switch(payFrequency){
      case "Annual":
        return salary/365;
      case "Monthly":
        return salary/(365/12);
      case "Biweekly":
        return salary/(365/24);
      case "Weekly":
        return salary/(365/48)
      default:
      return salary
    }
  
  }


  //income source regular data structure
  //range: {rangeStart:'2024-01-12', rangeEnd:'2024-02-12'}
  export const calculateIncomeInRange = (incomeSource, range) =>{
        return parseInt(getDaysInRange(range, incomeSource.start_date, incomeSource.end_date || range.rangeEnd) * incomeConverter(incomeSource.frequency, incomeSource.amount)*100)/100
  }

  //uses base function to find income for each source & return integer of sum 
  export const calculateTotaIncomeInRange = (incomeSources, range) =>{
        let sum = 0;
        incomeSources.forEach((source)=>{
            sum += calculateIncomeInRange(source, range)
        })
        return parseInt(sum);
  }


