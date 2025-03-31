import React from 'react'
import "./ExpensesNav.css"

//images & icons


//intercomponent imports
import Header from '../header/Header';
import ExportPie from '../piechart-library/ExportPie';
import { fetchExpenseSource } from './expensesNavHelper';

//external dependenices
import {useQuery} from "@tanstack/react-query"
import { Link } from 'react-router-dom';

const ExpensesNav = () => {

    //initially fetching of expense data on expense nav
    const {data:accountExpenseData} = useQuery({
        queryKey:['fetching-expense-source'],
        queryFn: async() => fetchExpenseSource(localStorage.getItem('the_current_user')),
        staleTime:0,
    })




  return (
    <div className='expenses-nav-shell'>
        <Header />
        <div className='expenses-area'>
            <div className='expenses-options'>
                <Link to="/expenses-category/food_and_drink" className='expenses-option'>
                        <h3>Food & Drink </h3>
                        <h1 style={{fontSize:'60px'}}>🥡</h1>
                </Link>

                <Link to="/expenses-category/recurring_expenses" className='expenses-option'>
                        <h3>Subscriptions/Recurring Expenses</h3>
                        <h1 style={{fontSize:'60px'}}> ⏰</h1>
                </Link>

                <Link to="/expenses-category/essentials" className='expenses-option'>
                        <h3>Essentials</h3>
                        <h1 style={{fontSize:'60px'}}>📚</h1>
                </Link>

                <Link to="/expenses-category/entertainment" className='expenses-option'>
                        <h3>Entertainment/Misc </h3>
                        <h1 style={{fontSize:'60px'}}>🎡</h1>
                </Link>
            </div>
            <div className='expenses-data-display'>
                {
                    <ExportPie incomeData={accountExpenseData} chartType={"expenses-pie"} chartTypeVersion={"2"}/> 
                }
            </div>
        </div>
    </div>
  )
}

export default ExpensesNav