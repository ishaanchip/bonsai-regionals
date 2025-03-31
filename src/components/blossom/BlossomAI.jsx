import React, {useState, useEffect, useRef} from 'react'
import "./BlossomAI.css"

//images & icons


//intercomponent imports
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid"
import { retrieveBlossomResponse } from './aiHelper';


//external dependenices
import {useQuery} from "@tanstack/react-query"

const BlossomAI = () => {
  //loading render when request send
  //local saving state of all responses (in array)
  //base form would have placeholder input and empty chat box  

  const [userQuery, setUserQuery] = useState("");
  const [blossomHistory, setBlossomHistory] = useState([]);
  const [waiting, setWaiting] = useState(false)


  const handleUserQuery = async() =>{
    if (userQuery.split(" ").length >= 3){
        setWaiting(true);
        const blossomAnswer = await retrieveBlossomResponse(localStorage.getItem('the_current_user'), userQuery)
        setUserQuery("");
        setBlossomHistory([blossomAnswer, ...blossomHistory])
        setWaiting(false)
        
    }
  }

  const handleKeyDown = (e) =>{
    if (e.key === 'Enter'){
      handleUserQuery()
    }
 }
 


  return (
    <div className='blossom-ai-shell'>
        <div className='title-area'>
            <h1>blossom</h1>
        </div>
        {
        !waiting ?
            <div className='chat-area'>
            {
                blossomHistory.length > 0
                ?
                blossomHistory.map((response, i) =>(
                    <div className='blossom-response' key={"blossom"+ i}>
                        <p>{response}</p>
                    </div>
                ))
                :
                <div className='blossom-auto-response'>
                        <p>from expert financial advice, to instantanous tech support, blossom has got you covered!</p>
                </div>
            }
            </div>
        :
            <div className='chat-area'>
                <div className='blossom-auto-response'>
                        <p>blossom is thinking...</p>
                </div>
            </div>
        }
        <div className='input-question-area'>
            <input placeholder='ask away! (queries need to be atleast 3 words long)' value={userQuery} onChange={(e)=>{
                setUserQuery(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            />
            <MagnifyingGlassIcon style={{width:'25px'}} onClick={() => handleUserQuery()}/>
        </div>

    </div>
  )
}

export default BlossomAI