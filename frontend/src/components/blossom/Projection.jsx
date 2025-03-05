import React, {useState, useEffect, useRef} from 'react'
import "./Projection.css"

//images & icons
import { PrinterIcon } from '@heroicons/react/24/solid'

//intercomponent imports
import { dateDisplay } from "../standardHelper"
import { scaleTheData, sumScaledData,monthList, monthObject, correctInputDays, getDataToDate  } from '../piechart-library/piechartHelper'
import { fetchIncomeSource } from '../income/IncomeHelper';
import { fetchExpenseSource } from '../expenses-options/expensesNavHelper';
import { updateUserBalance, fetchUserBalance, pdfIncomeExpenseData } from './projectionHelper';
import PdfFile from './PdfFile';

//external dependenices
import {useQuery} from "@tanstack/react-query"
import { PDFDownloadLink } from '@react-pdf/renderer';


/*
    1.Projections (3/01/25 - 3/31/25)
    1.account balance as of 3/01/25: 
    2.account income through 3/01/25 -> 3/31/25: $0
    3.account expenses through 3/01/25 -> 3/31/25: $0
    4.projection account balance at 3/31/25: $0
    5. account balance changes: +- 10%
*/




const Projection = () => {
  //1. need dialog to change date range
  //2. need to fetch all income & expenses data


    //income range change features
           //pop up related items
           const [displayPopUp, setDisplayPopUp] = useState(false);

           //pop up input variables

            //final state
              const [displayStartDate, setDisplayStartDate] = useState("2025-03-01");
              const [displayEndDate, setDisplayEndDate] = useState("2025-03-28");
              const [incomeRange, setIncomeRange] = useState({
                rangeStart:displayStartDate,
                rangeEnd:displayEndDate
            })

              //mutable date input fields 
                const [displayMonth, setDisplayMonth] = useState("March")
                const [displayYear, setDisplayYear] = useState(2025)
                const [displayStartDay, setDisplayStartDay] = useState(1);
                const [displayEndDay, setDisplayEndDay] = useState(28);

           //useRef variables and usage
           const popUpRef = useRef(null);

           //opening pop-up func
            const openPopUp = () =>{

                setDisplayPopUp(true);
                popUpRef.current.showModal();
            }
           //closing pop-up func
            const closePopUp = () =>{
                setDisplayPopUp(false)
                popUpRef.current.close()
            }



        //display variables
            const [totalIncome, setTotalIncome] = useState(0);        
            const [totalExpense, setTotalExpense] = useState(0);  
            const [currentBalance, setCurrentBalance] = useState(10);

          //dynamically updates date range UI after input confirmation (checks happen in submission)
            const changeIncomeRange = (year, month, start, end) =>{
              const {customStartDay, customEndDay} = getDataToDate(year, month ,start, end)
              setIncomeRange({
                rangeStart:customStartDay,
                rangeEnd:customEndDay
              })
              setDisplayStartDate(customStartDay)
              setDisplayEndDate(customEndDay)
              updateUserBalance(localStorage.getItem('the_current_user'), currentBalance, {"start_date":customStartDay, "end_date":customEndDay})
              closePopUp()
            }


    //user range and balacne render
    const {data: userAccountBalanceData} = useQuery({
        queryKey:['fetching-user-balance'],
        queryFn:async() => fetchUserBalance(localStorage.getItem('the_current_user')),
        staleTime:0
    })        

    //expense data {[]} (inital fetch w useQuery)
    const {data:accountExpenseData} = useQuery({
        queryKey:['fetching-expense-source'],
        queryFn: async() => fetchExpenseSource(localStorage.getItem('the_current_user')),
        staleTime:0
    })
    //income sources array of data [] (inital fetch w useQuery)
    const {data:accountIncomeData} = useQuery({
        queryKey:['fetching-income-source'],
        queryFn: async() => fetchIncomeSource(localStorage.getItem('the_current_user')),
        staleTime:0,
    })

    //FULL expense and income data arrayed for pdf
    const {data:accountIncomeExpenseData} = useQuery({
      queryKey:['fetching-income-expense-source'],
      queryFn: async() => pdfIncomeExpenseData(localStorage.getItem('the_current_user')),
      staleTime:0,
  })



    useEffect(()=>{
        if (accountExpenseData){
            console.log(scaleTheData(accountExpenseData, incomeRange))
            setTotalExpense(sumScaledData(scaleTheData(accountExpenseData, incomeRange)))
        }
    }, [accountExpenseData, incomeRange])

    useEffect(()=>{
        if (accountIncomeData){
            console.log(scaleTheData(accountIncomeData, incomeRange))
            setTotalIncome(sumScaledData(scaleTheData(accountIncomeData, incomeRange)))
        }
    }, [accountIncomeData, incomeRange])

    useEffect(() =>{
        if (userAccountBalanceData){
            setCurrentBalance(userAccountBalanceData.current_balance);
            setIncomeRange({
                rangeStart:userAccountBalanceData.projection_date.start_date,
                rangeEnd:userAccountBalanceData.projection_date.end_date
            })
            setDisplayStartDate(userAccountBalanceData.projection_date.start_date)
            setDisplayEndDate(userAccountBalanceData.projection_date.end_date)
        }
    }, [userAccountBalanceData])





  return (
    <div className='projection-shell'>
        <h1 onClick={()=> openPopUp()}>Projections ({dateDisplay(displayStartDate, displayEndDate)})</h1>
        <h3>Account Balance as of {dateDisplay(displayStartDate, "")}: ${currentBalance}</h3>
        <h3>Estimated Income  ({dateDisplay(displayStartDate, displayEndDate)}): ${parseInt(totalIncome)}</h3>
        <h3>Estimated Expenses  ({dateDisplay(displayStartDate, displayEndDate)}): ${parseInt(totalExpense)}</h3>
        <h3>Projected Account Balance at {dateDisplay(displayEndDate, "")}: ${parseInt((currentBalance + totalIncome - totalExpense))}</h3>
        <PDFDownloadLink 
        document={<PdfFile 
                   dateRange={dateDisplay(displayStartDate, displayEndDate)}
                   currentBalance={currentBalance} 
                   projectIncome={parseInt(totalIncome)}
                   projectExpense={parseInt(totalExpense)}
                   projectBalance={parseInt((currentBalance + totalIncome - totalExpense))}
                   incomeData={accountIncomeExpenseData?.incomeData || []}
                   expenseData={accountIncomeExpenseData?.expenseData || []}
                   />} 
        fileName="bonsai-report-summary">
          {({loading}) => 
            (loading 
            ?
            <div className='printer-area' style={{color:'gray'}}>
              <button style={{color:'gray'}}>Generate Report</button>
              <PrinterIcon style={{width:'22px', marginLeft:'5%', color:'gray'}}></PrinterIcon>
            </div> 
             :
             <div className='printer-area'>
              <button>Generate Report</button>
              <PrinterIcon style={{width:'22px', marginLeft:'5%'}}></PrinterIcon>
            </div> 
            
          )}
        </PDFDownloadLink>

        <dialog className={displayPopUp ? 'date-pop-up date-pop-up-clicked':'date-pop-up'} ref={popUpRef} >
                <div className='date-edit-part'>
                    <h4>Account Balance:</h4>
                    <input type="number"  value={currentBalance} 
                        onChange={(e)=>{
                            setCurrentBalance(parseInt(e.target.value))
                        }}
                        onBlur={(e)=>{
                            if (e.target.value.length === 0){
                                setCurrentBalance(0)
                            }
                        }}
                            />
                  </div>
                <div className='date-edit-part'>
                      <h4>Month:</h4>
                      <select value={displayMonth} onChange={(e) =>  {
                        setDisplayMonth(e.target.value)
                        
                      }}>
                        {
                          monthList.map((month) =>
                            <option key={Object.keys(month)[0]} value={Object.keys(month)[0]}>{Object.keys(month)[0]}</option>
                          )
                        }
                      </select>
                  </div>
                  <div className='date-edit-part'>
                      <h4>Year:</h4>
                      <input type="number"  value={displayYear}   min="2000"
                          onBlur={(e)=>{
                            setDisplayYear(Math.max(parseInt(e.target.value), 2000))
                            }} 
                          onChange={(e)=>{
                            setDisplayYear(e.target.value)
                          }}
                            />
                  </div>

                  <div className='date-edit-part'>
                      <h4>Start Day:</h4>
                      <input type="number"  value={displayStartDay} 
                          onChange={(e)=>{
                            setDisplayStartDay(e.target.value)
                            }} 
                          onBlur={(e)=>{
                            setDisplayStartDay(correctInputDays(e.target.value, displayEndDay)['startDay'])
                          }}

                          />
                  </div>

                  <div className='date-edit-part'>
                      <h4>End Day:</h4>
                      <input type="number"  value={displayEndDay} 
                          onChange={(e)=>{
                            setDisplayEndDay(e.target.value)
                            }} 
                          onBlur={(e)=>{
                            setDisplayEndDay(correctInputDays(displayStartDay, e.target.value)['endDay'])
                          }}

                          />
                  </div>

                  <div className='date-dialog-options' >
                      <p onClick={()=> { 
                          console.log("running")
                          changeIncomeRange(displayYear.toString(), monthObject[displayMonth].toString(), displayStartDay.toString(), displayEndDay.toString())
                      }
                      }>change income range</p>
                      <p onClick={()=> { 
                          closePopUp()
                      }
                      }>discard changes</p>
                  </div>

          </dialog>





    </div>
  )
}

export default Projection