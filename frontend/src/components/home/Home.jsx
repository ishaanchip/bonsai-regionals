import React, {useState, useEffect} from 'react'
import "./Home.css"

//images & icons



//intercomponent imports
import { createBonsaiAccount } from '../home/homeHelper';
import Header from '../header/Header';

//external dependenices
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, useUser as clerkUseUser } from "@clerk/clerk-react";

const Home = () => {


   //bonsai slogan revolver functionality
        //variables
        const [bonsaiSlogans] = useState(["ditch the excel spreadsheets & note-apps for good. ","saving users 15% of their income on average. ","specialized for you. ","#1 financial tracker. "])
        const [currentSloganText, setCurrentSloganText] = useState("")
        const [finishSloganCycle, setFinishSloganCycle] = useState(false)
        const delay = (ms) => new Promise((resolve) => {
            setTimeout(resolve, ms)
        })

        //essential functions
            const cycleScripts = async(script) =>{
                //loops through all twice, saves last text tho
                for (let i = 0; i < script.length*2-1; i++){
                    await dynamicText(script[i%script.length])
                }
            
                let finalDisplay = "";
                for (let i = 0; i < script[script.length-1].length-1;i++){
                    finalDisplay += script[script.length-1][i]
                    await delay(100)
                    setCurrentSloganText(finalDisplay)
                }
                setFinishSloganCycle(true)
            }
            
            const dynamicText = async(text) => {
                let displayText = "";
            
                // Adding to text
                for (let i = 0; i < text.length; i++) {
                    displayText += text[i];
                    await delay(70)
                    setCurrentSloganText(displayText);
                }
        
                await delay(400)
                // Adding a break for clarity
            
                // Starting to remove from text
                let arrayedDisplay = displayText.split("");
                for (let i = text.length - 1; i >= 0; i--) { 
                    arrayedDisplay.splice(i, 1); 
                    await delay(50)
                    setCurrentSloganText(arrayedDisplay.join(''))
                }
                return ""
            };
        
        useEffect(()=>{
            cycleScripts(bonsaiSlogans)
        }, [])



    //creating/logging into account func
        //clerk status
        const {user, isSignedIn} = clerkUseUser()
        useEffect(()=>{
            if (isSignedIn){
                createBonsaiAccount(user.username, user.emailAddresses[0].emailAddress)
                localStorage.setItem("the_current_user", user.username)
            }
        }, [isSignedIn])



    
    
  return (
    <div className='home-shell'>
        <Header />

        <div className='home-content-shell'>
            {/* <button>an FBLA product</button> */}
            <h1>Log Maintain & Project your Cashflow with Bonsai</h1>
            <div className='bonsai-slogans'>
                <p>{currentSloganText}{!finishSloganCycle && '|'}</p>
                {/* {!finishSloganCycle && <p className='slogan-cursor'>|</p>} */}
            </div>

                <div className='auth-nav-options nav-options-mobile'>
                    <SignedOut>
                        <SignUpButton mode="modal"></SignUpButton>
                        <SignInButton mode="modal"></SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <SignOutButton mode="modal" onClick={()=> localStorage.clear()}></SignOutButton>
                    </SignedIn>
                </div>

        </div>
    </div>
  )
}

export default Home