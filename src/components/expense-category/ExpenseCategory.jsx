import React, {useState, useEffect, useRef} from 'react'
import "../income/Income.css"


//images & icons
import {PencilIcon} from "@heroicons/react/24/solid"

//intercomponent imports
import Header from '../header/Header';
import ExportPie from '../piechart-library/ExportPie';
//import {addIncomeSource, fetchIncomeSource, deleteIncomeSource, editIncomeSource} from "..income/IncomeHelper"
import {addExpenseSource, fetchExpenseSource, deleteExpenseSource, editExpenseSource, convertExpenseType} from "./ExpenseHelper"
import {dateDisplay, verifyIncomeInput, standardCaps, sortIncomeSources} from "../standardHelper"

//external dependenices
import {useQuery} from "@tanstack/react-query"
import { useParams } from 'react-router-dom';

const ExpenseCategory = () => {

    //getting specific expense type data
    const {expenseType} = useParams(); 
    const [displayExpenseType] = useState(convertExpenseType(expenseType));

    //income sources array of data (inital fetch w useQuery)
    const [expenseSources, setExpenseSources] = useState([])
    const {data:accountExpenseData} = useQuery({
        queryKey:['fetching-expense-field-source'],
        queryFn: async() => fetchExpenseSource(localStorage.getItem('the_current_user'), expenseType) , 
        staleTime:0,
    })


    useEffect(()=>{
        if (accountExpenseData){
            setExpenseSources(accountExpenseData)
        }
    }, [accountExpenseData])

    useEffect(() =>{
        //setExpenseSources(refetchExpenseData())
    }, [expenseType])





    //sorting chart functionalities
        const [isAscending, setIsAscending] = useState(true);
        const [sortCategory, setSortCategory] = useState("none");



   //pop up related items
        const [displayPopUp, setDisplayPopUp] = useState(false);
        const [editingPopUp, setEditingPopUp] = useState(false);

        //pop up input variables
        const [name, setName] = useState("");
        const [amount, setAmount] = useState("");
        const [frequency, setFrequency] = useState("Daily");
        const [startDate, setStartDate] = useState("");
        const [endDate, setEndDate] = useState("");
        const [expenseId, setExpenseId] = useState("");
        const [errorInput, setErrorInput] = useState(false)
        const [errorMessage, setErrorMessage] = useState("")



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
        const clearInputIncome = () =>{
            setName("")
            setAmount("");
            setFrequency("Annual")
            setStartDate("")
            setEndDate("")
            setErrorInput(false)
            setErrorMessage("")
            closePopUp()
        }

        //when edit an income source, pre-populate fields so certain can be changed
        const populateExpenseIncome = ({editName, editAmount, editFrequency, editStartDate, editEndDate, editExpenseId}) =>{
            openPopUp()
            setEditingPopUp(true)
            setName(editName)
            setAmount(editAmount);
            setFrequency(editFrequency)
            setStartDate(editStartDate)
            setEndDate(editEndDate)
            setExpenseId(editExpenseId)
        }

        const handleAddExpense = () =>{
            //1. check all fields valid
            let expenseInputResults = verifyIncomeInput(name, amount, startDate, endDate)
            let expenseId = localStorage.getItem('the_current_user') + "-" + name.toLowerCase() + "-" + parseInt(Math.random()*1000)
            console.log(expenseInputResults)
            if (expenseInputResults === true && expenseType === "recurring_expenses"){
                setExpenseSources([...expenseSources, {
                    "name":standardCaps(name),
                    "amount":amount,
                    "frequency":frequency,
                    "start_date": startDate,
                    "end_date": endDate,
                    "expense_id":expenseId
                }])
                //make changes to mongodb
                addExpenseSource(localStorage.getItem('the_current_user'), standardCaps(name), amount, frequency, startDate, endDate, expenseId, expenseType)
                clearInputIncome()
                return "completed entry"
            }

            else if (expenseInputResults === true && expenseType !== "recurring_expenses"){
                
                setExpenseSources([...expenseSources, {
                    "name":standardCaps(name),
                    "amount":amount,
                    "frequency":"Daily",
                    "start_date": startDate,
                    "end_date": startDate,
                    "expense_id":expenseId
                }])
                //make changes to mongodb
                addExpenseSource(localStorage.getItem('the_current_user'), standardCaps(name), amount, "Daily", startDate, startDate, expenseId, expenseType)
                clearInputIncome()
                return "completed entry"
            }
            //2. errors: point out what is wrong
            setErrorMessage(expenseInputResults)
            setErrorInput(true)
        }

        const handleDeletion = (expenseId) =>{
            deleteExpenseSource(localStorage.getItem('the_current_user'), expenseId, expenseType)
            setExpenseSources(expenseSources.filter((source)=> source.expense_id !== expenseId))

        }

        const handleEdit = (expenseId) =>{
            try{
                //1. check all fields
                    let expenseInputResults;
                    if (expenseType === "recurring_expenses"){
                        expenseInputResults = verifyIncomeInput(name, amount, startDate, endDate)
                    }
                    else if (expenseType !== "recurring_expenses"){
                        expenseInputResults = verifyIncomeInput(name, amount, startDate, "");

                    }
                    console.log(expenseInputResults)

                    if (expenseInputResults === true){
                        //makes copy of current income sources, keeps everything, makes specific changes to object changed, order stays same
                        //tempArr becomes incomeSource after run
                        let tempArr = [...expenseSources]
                        tempArr = tempArr.map((object) => object.expense_id ===expenseId ? object = {
                            "name":standardCaps(name),
                            "amount":amount,
                            "frequency":frequency,
                            "start_date": startDate,
                            "end_date": expenseType !== "recurring_expense" ? startDate : endDate,
                            "expense_id":expenseId
                        } : object )
                        console.log(tempArr)
                        setExpenseSources(tempArr)
                        editExpenseSource(localStorage.getItem('the_current_user'), standardCaps(name), amount, frequency, startDate,  expenseType !== "recurring_expense" ? startDate : endDate, expenseId, expenseType)
                        clearInputIncome()
                        setEditingPopUp(false)
                        return "edited entry"
                    }
                //2. errors: point out what is wrong
                    setErrorMessage(expenseInputResults)
                    setErrorInput(true)
            }
            catch(err){
                console.log(`there was an error editing expense source: ${err}`)
            }
        }

  


  return (
    <div className='income-shell'>
        <Header />
        <div className='income-area'>
            <div className='income-content-shell'>
                <div className='income-table-display'>
                    <div className='income-table-category'>
                        <p className='position-tag' onClick={() =>{
                            setSortCategory('position')
                            setIsAscending(!isAscending)
                        }}>Expense {sortCategory === "position" && "*"}</p>
                        <p className='salary-tag' onClick={() =>{
                            setSortCategory('salary')
                            setIsAscending(!isAscending)
                        }}>Cost {sortCategory === "salary" && "*"}</p>
                        <p className='pay-tag' onClick={() =>{
                            setSortCategory('pay')
                            setIsAscending(!isAscending)
                        }}>Frequency {sortCategory === "pay" && "*"}</p>
                        <p className='date-tag' onClick={() =>{
                            setSortCategory('date')
                            setIsAscending(!isAscending)
                        }}>Date {sortCategory === "date" && "*"}</p>
                    </div>

                    {expenseSources?.length > 0 
                        ?
                        sortIncomeSources(expenseSources, sortCategory, isAscending)?.map((expense, i) =>
                        <div className={i % 2 == 0 ? 'income-table-job income-table-job-even' : 'income-table-job income-table-job-odd'} key={expense.expense_id + i}>
                            <p className='position-tag' style={{fontWeight:600}}>{expense.name}</p>
                            <p className='salary-tag'>${expense.amount}</p>
                            <p className='pay-tag' >{expense.frequency}</p>
                            <p className='date-tag'>{dateDisplay(expense.start_date, expense.end_date)}</p>
                            <PencilIcon className='utility-icon' onClick={()=>{
                                populateExpenseIncome({
                                    editName: expense.name,
                                    editAmount:expense.amount,
                                    editFrequency:expense.frequency,
                                    editStartDate:expense.start_date,
                                    editEndDate:expense.end_date,
                                    editExpenseId:expense.expense_id 
                                })
                            }}></PencilIcon>
                        </div>
                        )
                        :
                        <div className='income-table-blank'>
                            <h1>You Currently do not have any Expense Sources. </h1>
                            <button onClick={()=> openPopUp()}>Add Expense Source</button>
                        </div>
                        
                    }                    
                </div>
                <div className='income-table-nav'>
                        <div className='month-nav-area'>
                            {displayExpenseType}
                        </div>
                            <button onClick={()=> openPopUp()}>Add Expense Source</button>
                    </div>
                </div>
    
                <div className='income-data-display'>
                        <ExportPie incomeData={expenseSources} chartType={"expenses-pie"} chartTypeVersion={"1"}/>
                        
                </div>
    
    
            </div>
    
                <dialog className={displayPopUp ? 'pop-up pop-up-clicked':'pop-up'} ref={popUpRef} >
                    <div className='edit-part'>
                        <h4>Expense Name:</h4>
                        <input type="text" placeholder='ex: Doctor' value={name} onChange={(e)=> setName(e.target.value)}/>
                    </div>
                    <div className='edit-part'>
                        <h4>Amount:</h4>
                        <input type='number' placeholder='ex: 100000' value={amount} onChange={(e)=>{
                            setAmount(e.target.value)
                        }}/>
                    </div>
                    {expenseType === "recurring_expenses" 
                        &&
                        <div className='edit-part'>
                            <h4>Frequency:</h4>
                            <select value={frequency} onChange={(e) =>  setFrequency(e.target.value)}>
                                <option>Annual</option>
                                <option>Monthly</option>
                                <option>Biweekly</option>
                                <option>Weekly</option>
                                <option>Daily</option>
                            </select>
                        </div>
                    }
                    <div className='edit-part'>
                        <h4>Start Date:</h4>
                        <input type="date" placeholder='ex: 12/24/24' value={startDate}  onChange={(e)=>{
                            setStartDate(e.target.value)
                        }} />
                    </div>
                    {expenseType === "recurring_expenses" &&
                        <div className='edit-part'>
                            <h4>End Date (if applicable):</h4>
                            <input type="date" placeholder='ex: 12/30/24' value={endDate}  onChange={(e)=>{
                                setEndDate(e.target.value)
                            }} />
                        </div>
                    }
                    <div className={errorInput ? "error-message-active" : "error-message"}>
                        <h4>QuickFix: {errorMessage}</h4>
                    </div>
    
                    {editingPopUp ? 
                        <div className='dialog-options' >
                            <p onClick={()=> { 
                                handleEdit(expenseId)
                            }
                            }>confirm edits</p>
                            <p onClick={()=> { 
                                clearInputIncome()
                                setEditingPopUp(false)
                            }
                            }>discard edits</p>
                            <p onClick={()=> { 
                                handleDeletion(expenseId)
                                clearInputIncome()
                                setEditingPopUp(false)
                                
                            }
                            }>delete expense source</p>
                        </div>
                        : 
                        <div className='dialog-options' >
                            <p onClick={()=> { 
                                console.log("running")
                                handleAddExpense()
                            }
                            }>confirm income source</p>
                            <p onClick={()=> { 
                                clearInputIncome()
                            }
                            }>discard income source</p>
                        </div>
                    }
                </dialog>

    </div>
  )
}

export default ExpenseCategory



