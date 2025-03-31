import CustomPieChart from  "./Piechart"
import "./Piechart.css"
// import "../barchart/Barchart.css"
import React, {useState, useEffect, useRef} from 'react'

//intercomponent imports
// import { calculateTotaIncomeInRange, dateDisplay } from '../income/IncomeHelper'
import { dateDisplay } from "../standardHelper"
import { scaleTheData, getCorrectWording, sumScaledData,monthList, monthObject, correctInputDays, getDataToDate  } from './piechartHelper'




const ExportPie = ({incomeData, chartType, chartTypeVersion}) => {


  //array variable to track type of chart & fix UI display
  const [chartDisplay, setChartDisplay] = useState([])

  const [totalRevenue, setTotalRevenue] = useState(0);
  //filtered range income data for pie charts
    const [scaledIncomeSource, setScaledIncomeSource] = useState([]);

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

          //dynamically updates date range UI after input confirmation (checks happen in submission)
            const changeIncomeRange = (year, month, start, end) =>{
              const {customStartDay, customEndDay} = getDataToDate(year, month ,start, end)
              setIncomeRange({
                rangeStart:customStartDay,
                rangeEnd:customEndDay
              })
              setDisplayStartDate(customStartDay)
              setDisplayEndDate(customEndDay)
              closePopUp()
            }


  //fully sets chart to have proper UI for each chart type
  useEffect(() =>{
    setChartDisplay(getCorrectWording(chartType))
    console.log(getCorrectWording(chartType))
  }, [chartType])
  
  //recalculates revenue & resclaes reveunue source every time incomeData (all income sources) || range changes
    useEffect(() =>{
      setScaledIncomeSource(scaleTheData(incomeData, incomeRange))
    }, [incomeData, incomeRange])

    useEffect(() =>{
      if (scaledIncomeSource.length > 0)
        setTotalRevenue(sumScaledData(scaledIncomeSource))
    }, [scaledIncomeSource])

  //if no income fit range, will NOT display piechart   
  if (scaledIncomeSource?.length === 0){
    return (
      <div className={'the-area area-v' + chartTypeVersion}>
          <h1 className="total-revenue">{chartDisplay[0]} Stream</h1>
          <p className='total-revenue' onClick={()=>{
            openPopUp()
          }}>Estimated Total {chartDisplay[1]} ({dateDisplay(displayStartDate, displayEndDate)}): $0</p>
          <div className="no-current-sources">
            <p>currently no {chartDisplay[2]} sources in date range. either change range to fit {chartDisplay[2]} sources dates or add a new source.</p>
          </div>
          <dialog className={displayPopUp ? 'date-pop-up date-pop-up-clicked':'date-pop-up'} ref={popUpRef} >
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
  return (

    <div className={'the-area area-v' + chartTypeVersion}>
          <h1 className="total-revenue" onClick={()=>{
            openPopUp()
          }}>{chartDisplay[0]} Stream</h1>
          <p className='total-revenue' onClick={()=>{
            openPopUp()
          }}>Estimated Total {chartDisplay[1]}  ({dateDisplay(displayStartDate, displayEndDate)}): {`$${totalRevenue}`}</p>
          {
            <div className="pie-area">
              <CustomPieChart data={scaledIncomeSource} />
            </div>
          }

          <dialog className={displayPopUp ? 'date-pop-up date-pop-up-clicked':'date-pop-up'} ref={popUpRef} >
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

export default ExportPie