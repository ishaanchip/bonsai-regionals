import React from 'react'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Home from './components/home/Home'
import Income from './components/income/Income'
import ExpensesNav from './components/expenses-options/ExpensesNav'
import ExpenseCategory from './components/expense-category/ExpenseCategory'
import BlossomArea from './components/blossom/BlossomArea'


const Router = () => {
return (
  <BrowserRouter basename='/'>
      <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/income" element={<Income />}></Route>
          <Route path="/expenses-nav" element={<ExpensesNav />}></Route>
          <Route path="/expenses-category/:expenseType" element={<ExpenseCategory />}></Route>
          <Route path="/blossom" element={<BlossomArea />}></Route>
          {/* <Route path="/construction" element={<Construction/>}></Route> */}
      </Routes>
  </BrowserRouter>
)


}


export default Router