import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import SignUp from './components/SignUp'
import Login from './components/Login'
import PlanContainer from './components/PlanContainer'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userExists: false,
      firstName: "",
      lastName: "",
      username: "",
      debts: [],
      expenses: 0,
      income: "",
      planOptions: {},
      selectedPlan: null,
      numberOfDebts: 1,
      user_id: 0
    }
    this.addNewDebt = this.addNewDebt.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  addNewDebt(ev) {
    ev.preventDefault()
    console.log("ADDING A NEW DEBT")
    this.setState({ numberOfDebts: this.state.numberOfDebts + 1 })
  }

  handleSubmit(ev) {
    ev.preventDefault()
    let tempArr = []
    for (let i = 0; i < this.state.numberOfDebts; i++) {
      let obj = {}
      let typ = document.getElementById(i).children[2].value
      let amt = document.getElementById(i).children[6].value
      let int = document.getElementById(i).children[10].value
      let minpay = document.getElementById(i).children[14].value
      obj['type'] = typ
      obj['amount'] = amt
      obj['interest'] = int
      obj['minimumPayment'] = minpay
      tempArr.push(obj)
    }

    let rent = document.getElementById('rent')
    let utilities = document.getElementById('utilities')
    let foodEntertainment = document.getElementById('foodEntertainment')
    let other = document.getElementById('other')

    let total = (parseInt(rent.value) + parseInt(utilities.value) + parseInt(foodEntertainment.value) + parseInt(other.value))

    let firstName = document.getElementById('firstName')
    let lastName = document.getElementById('lastName')
    let username = document.getElementById('username')
    let income = document.getElementById('income')


    this.setState({
      debts: tempArr,
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      income: income.value,
      expenses: total,
    }, () => this.signUp());

  }

  signUp = () => {
    fetch("//localhost:3000/users", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        username: this.state.username,
        income: this.state.income,
        expenses: this.state.expenses
      })
    })
    .then(resp => resp.json())
      .then(json =>
          this.setState({
            user_id: json.id,
            userExists: true,
            username: json.username
          })
        ).then(() => this.createDebt())
        .then(this.postingPlans())
  }

  createDebt = () => {
    this.state.debts.map( debt => {
      fetch("//localhost:3000/debts", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          debt_type: debt.type,
          amount: debt.amount,
          interest_rate: debt.interest,
          user_id: this.state.user_id,
          min_payment: debt.minimumPayment
        })
      })
    })
  }

  postingPlans = () => {
    fetch("//localhost:3000/selectPlan?id=9", {
      method: 'POST',
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({user_id: this.state.user_id})
    }
    )
    .then(response => response.json())
    .then(json => 
    this.setState({planOptions: json})
    )}

  onChange(ev) {

    let key = ev.target.name;
    let value = ev.target.value;

    let state = {}
    state[key] = value

    console.log('single controlled state', state)
    this.setState(state)
  }

  onLogIn = (event, username) => {
    event.preventDefault()
    fetch(`//localhost:3000/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username
      })
    }).then(resp => resp.json())
      .then(json => {
        if (json.status === 400) {
          return
        } else {
          this.setState({
            user_id: json.id,
            userExists: true,
            username: json.username
          })
        }
      }
      )
  }

  render() {
    return (
      <div className="App" >
        WELCOME TO DEBT- DRAGON!
        <>
          <Router>
            <div>
              {this.state.userExists ?
                <PlanContainer user={this.state}/>
                :
                <>
                  <NavLink to="/signup">SignUp</NavLink>
                  <NavLink to="/login">Login</NavLink>
                <div>
                <Route path="/login" render={(props) => (<Login {...props} onLogIn={this.onLogIn}/>)}/>
                {/* <Route path="/profile" component={Profile}/> */}
                <Route path="/signup" render={(props) => (
                  <SignUp {...props} onChange={this.onChange} state={this.state} debts={this.state.debts} addNewDebt={this.addNewDebt} handleSubmit={this.handleSubmit} numberOfDebts={this.state.numberOfDebts}/>
                )} />
              </div>
               </>
              }
            </div>
          </Router>
        </>
      </div >
    );
  }
}

export default App;
