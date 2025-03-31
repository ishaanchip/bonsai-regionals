import React, {useState, useEffect, useRef} from 'react'
import "./BlossomArea.css"

//images & icons


//intercomponent imports
import Header from '../header/Header';
import BlossomAI from './BlossomAI';
import Projection from './Projection';

//external dependenices
import {useQuery} from "@tanstack/react-query"

const BlossomArea = () => {
  return (
    <div className='blossom-shell'>
        <Header />
        <div className='blossom-area'>
            <Projection />
            <BlossomAI />
        </div>
    </div>
  )
}

export default BlossomArea