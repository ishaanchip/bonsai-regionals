import React, {useState, useEffect, useRef} from 'react'
import "./Income.css"

//images & icons
import {PencilIcon} from "@heroicons/react/24/solid"

//intercomponent imports
import Header from '../header/Header';
import {addIncomeSource, fetchIncomeSource, deleteIncomeSource, editIncomeSource} from "./IncomeHelper"
import {dateDisplay, verifyIncomeInput, standardCaps, sortIncomeSources} from "../standardHelper"
import ExportPie from '../piechart-library/ExportPie';

//external dependenices
import {useQuery} from "@tanstack/react-query"




const Income = () => {



    //income sources array of data (inital fetch w useQuery)
        const [incomeSources, setIncomeSources] = useState([])
        const {data:accountIncomeData} = useQuery({
            queryKey:['fetching-income-source'],
            queryFn: async() => fetchIncomeSource(localStorage.getItem('the_current_user')),
            staleTime:0,
        })


        useEffect(()=>{
            if (accountIncomeData){
                setIncomeSources(accountIncomeData)
            }
        }, [accountIncomeData])


    //sorting chart functionalities
        const [isAscending, setIsAscending] = useState(true);
        const [sortCategory, setSortCategory] = useState("none");





       //pop up related items
            const [displayPopUp, setDisplayPopUp] = useState(false);
            const [editingPopUp, setEditingPopUp] = useState(false);

            //pop up input variables
            const [position, setPosition] = useState("");
            const [salary, setSalary] = useState("");
            const [frequency, setFrequency] = useState("Annual");
            const [startDate, setStartDate] = useState("");
            const [endDate, setEndDate] = useState("");
            const [incomeId, setIncomeId] = useState("");
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
                setPosition("")
                setSalary("");
                setFrequency("Annual")
                setStartDate("")
                setEndDate("")
                setErrorInput(false)
                setErrorMessage("")
                closePopUp()
            }

            //when edit an income source, pre-populate fields so certain can be changed
            const populateInputIncome = ({editPosition, editSalary, editPay, editStartDate, editEndDate, editIncomeId}) =>{
                openPopUp()
                setEditingPopUp(true)
                setPosition(editPosition)
                setSalary(editSalary);
                setFrequency(editPay)
                setStartDate(editStartDate)
                setEndDate(editEndDate)
                setIncomeId(editIncomeId)
            }

            const handleAddIncome = () =>{
                //1. check all fields valid
                let incomeInputResults = verifyIncomeInput(position, salary, startDate, endDate)
                let incomeId = localStorage.getItem('the_current_user') + "-" + position.toLowerCase() + "-" + parseInt(Math.random()*1000)
                console.log(incomeInputResults)
                if (incomeInputResults === true){
                    setIncomeSources([...incomeSources, {
                        "name":standardCaps(position),
                        "amount":salary,
                        "frequency":frequency,
                        "start_date": startDate,
                        "end_date": endDate,
                        "income_id":incomeId
                    }])
                    //make changes to mongodb
                    addIncomeSource(localStorage.getItem('the_current_user'), standardCaps(position), salary, frequency, startDate, endDate, incomeId)
                    clearInputIncome()
                    return "completed entry"
                }
                //2. errors: point out what is wrong
                setErrorMessage(incomeInputResults)
                setErrorInput(true)
            }

            const handleDeletion = (incomeId) =>{
                console.log(incomeId)
                deleteIncomeSource(incomeId, localStorage.getItem('the_current_user'))
                setIncomeSources(incomeSources.filter((source)=> source.income_id !== incomeId))

            }

            const handleEdit = (incomeId) =>{
                try{
                    //1. check all fields
                        let incomeInputResults = verifyIncomeInput(position, salary, startDate, endDate)
                        console.log(incomeInputResults)

                        if (incomeInputResults === true){
                            //makes copy of current income sources, keeps everything, makes specific changes to object changed, order stays same
                            //tempArr becomes incomeSource after run
                            let tempArr = [...incomeSources]
                            tempArr = tempArr.map((object) => object.income_id ===incomeId ? object = {
                                "name":standardCaps(position),
                                "amount":salary,
                                "frequency":frequency,
                                "start_date": startDate,
                                "end_date": endDate,
                                "income_id":incomeId
                            } : object )
                            console.log(tempArr)
                            setIncomeSources(tempArr)
                            editIncomeSource(localStorage.getItem('the_current_user'), standardCaps(position), salary, frequency, startDate, endDate, incomeId)
                            clearInputIncome()
                            setEditingPopUp(false)
                            return "edited entry"
                        }
                    //2. errors: point out what is wrong
                        setErrorMessage(incomeInputResults)
                        setErrorInput(true)
                }
                catch(err){
                    console.log(`there was an error editing income source: ${err}`)
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
                        }}>Position {sortCategory === "position" && "*"}</p>
                        <p className='salary-tag' onClick={() =>{
                            setSortCategory('salary')
                            setIsAscending(!isAscending)
                        }}>Salary {sortCategory === "salary" && "*"}</p>
                        <p className='pay-tag' onClick={() =>{
                            setSortCategory('pay')
                            setIsAscending(!isAscending)
                        }}>Pay {sortCategory === "pay" && "*"}</p>
                        <p className='date-tag' onClick={() =>{
                            setSortCategory('date')
                            setIsAscending(!isAscending)
                        }}>Date {sortCategory === "date" && "*"}</p>
                    </div>

                    {incomeSources?.length > 0 
                        ?
                        sortIncomeSources(incomeSources, sortCategory, isAscending)?.map((job, i) =>
                        <div className={i % 2 == 0 ? 'income-table-job income-table-job-even' : 'income-table-job income-table-job-odd'}>
                            <p className='position-tag' style={{fontWeight:600}}>{job.name}</p>
                            <p className='salary-tag'>${job.amount}</p>
                            <p className='pay-tag' >{job.frequency}</p>
                            <p className='date-tag'>{dateDisplay(job.start_date, job.end_date)}</p>
                            <PencilIcon className='utility-icon' onClick={()=>{
                                populateInputIncome({
                                    editPosition: job.name,
                                    editSalary:job.amount,
                                    editPay:job.frequency,
                                    editStartDate:job.start_date,
                                    editEndDate:job.end_date,
                                    editIncomeId:job.income_id 
                                })
                            }}></PencilIcon>
                        </div>
                        )
                        :
                        <div className='income-table-blank'>
                            <h1>You Currently do not have any Income Sources. </h1>
                            <button onClick={()=> openPopUp()}>Add Income Source</button>
                        </div>
                        
                    }                    
                </div>
                <div className='income-table-nav'>
                        <div className='month-nav-area'>
                            {/* <p>{`<`}</p>
                            <p>December 2024</p>
                            <p>{`>`}</p> */}
                        </div>
                        <button onClick={()=> openPopUp()}>Add Income Source</button>
                </div>
            </div>

            <div className='income-data-display'>
                    <ExportPie incomeData={incomeSources} chartType={"income-pie"} chartTypeVersion={"1"}/>
                    
                {/* <Barchart incomeData={incomeSources}/> */}
            </div>


        </div>

            <dialog className={displayPopUp ? 'pop-up pop-up-clicked':'pop-up'} ref={popUpRef} >
                <div className='edit-part'>
                    <h4>Position:</h4>
                    <input type="text" placeholder='ex: Doctor' value={position} onChange={(e)=> setPosition(e.target.value)}/>
                </div>
                <div className='edit-part'>
                    <h4>Salary:</h4>
                    <input type='number' placeholder='ex: 100000' value={salary} onChange={(e)=>{
                        setSalary(e.target.value)
                    }}/>
                </div>
                <div className='edit-part'>
                    <h4>Salary Frequency:</h4>
                    <select value={frequency} onChange={(e) =>  setFrequency(e.target.value)}>
                        <option>Annual</option>
                        <option>Monthly</option>
                        <option>Biweekly</option>
                        <option>Weekly</option>
                        <option>Daily</option>
                    </select>
                </div>
                <div className='edit-part'>
                    <h4>Start Date:</h4>
                    <input type="date" placeholder='ex: 12/24/24' value={startDate}  onChange={(e)=>{
                        setStartDate(e.target.value)
                    }} />
                </div>
                <div className='edit-part'>
                    <h4>End Date (if applicable):</h4>
                    <input type="date" placeholder='ex: 12/30/24' value={endDate}  onChange={(e)=>{
                        setEndDate(e.target.value)
                    }} />
                </div>
                <div className={errorInput ? "error-message-active" : "error-message"}>
                    <h4>QuickFix: {errorMessage}</h4>
                </div>

                {editingPopUp ? 
                    <div className='dialog-options' >
                        <p onClick={()=> { 
                            handleEdit(incomeId)
                        }
                        }>confirm edits</p>
                        <p onClick={()=> { 
                            clearInputIncome()
                            setEditingPopUp(false)
                        }
                        }>discard edits</p>
                        <p onClick={()=> { 
                            handleDeletion(incomeId)
                            clearInputIncome()
                            setEditingPopUp(false)
                            
                        }
                        }>delete income source</p>
                    </div>
                    : 
                    <div className='dialog-options' >
                        <p onClick={()=> { 
                            console.log("running")
                            handleAddIncome()
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

export default Income