import React, { Component } from 'react';
import DebtForm from './DebtForm'

class SignUp extends Component {
  constructor(props){
    super(props)

    this.state= {

    }
  }

  renderDebtForms(number){
    console.log("YOYOYOYO")
    let array = [1, 2, 3, 4, 5]
    return (array.map(item => {
        return <DebtForm />
    }));
  }

  render() {
    return (
      <div>
      SIGN UP!!!!!!
      <br/>
      <br/>
        <form onSubmit={(ev) => this.props.handleSubmit(ev)}>
          <label>First Name:</label><br/>
          <input type="text"></input><br/>
          <label>Last Name:</label><br/>
          <input type="text"></input><br/>
          <label>User Name:</label><br/>
          <input type="text"></input><br/>

          <div className="monthly-expenses-box">
            <label>Rent:</label><br/>
            <input type="text"></input><br/>
            <p>(If you own a home and pay mortgage, please account for this in the "Debts" section.)</p>
            <label>Utilities:</label><br/>
            <input type="text"></input><br/>
            <label>Food/Entertainment:</label><br/>
            <input type="text"></input><br/>
            <label>Rent:</label><br/>
            <input type="text"></input><br/>
          </div>
          <br/><button onClick={(ev) => this.props.addNewDebt(ev)}>Add Debt</button><br/>
          <DebtForm />
          <DebtForm />

          {this.renderDebtForms(this.props.numberOfDebts)}

          <input type="submit"></input>
        </form>
      </div>
    );
  }
}

export default SignUp;
