import React, {useState, useEffect} from 'react'
import "./Header.css"

//images & icons


//intercomponent imports


//external dependenices
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, useUser as clerkUseUser } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';



const Header = () => {
  return (
    <div className='boiler-header-income-shell'>
        <div className='boiler-header-income-content'>
            <Link to="/"><h1 className='header-title'>bonsai🌲</h1></Link>
            <SignedOut>
                <div className='site-nav-options site-nav-options-inactive nav-options-web'>
                    <p>income</p>
                    <p>expenses</p>
                    <p>blossom</p>
                </div>
            </SignedOut>
            <SignedIn>
                <div className='site-nav-options nav-options-web'>
                    <Link to="/income"><p>income</p></Link>
                    <Link to="/expenses-nav"><p>expenses</p></Link>
                    <Link to="/blossom"><p>blossom</p></Link>
                    {/* <p>income</p>
                    <p>expenses</p>
                    <p>blossom</p> */}
                </div>
            </SignedIn>

            <div className='auth-nav-options nav-options-web'>
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

export default Header