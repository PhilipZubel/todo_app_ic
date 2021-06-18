import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as todo_app_idl, canisterId as todo_app_id } from 'dfx-generated/todo_app';

const agent = new HttpAgent();
const todo_app = Actor.createActor(todo_app_idl, { agent, canisterId: todo_app_id });

// Insert these lines after the import statements for
// importing an agent and an actor
import * as React from 'react';
import { render } from 'react-dom';
import '../assets/style.css'; // Import custom styles

// Replace the default index.js content with
// React JavaScript
class MyHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      newDescription: '',
    };
    this.show();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async show() {
    const show = await todo_app.getTodos();
    // console.log(show);
    const sortedList = this.sortById(show);
    this.setState({ ...this.state, list: sortedList });
  }

  sortById(list){
    const sortedList = list.sort((a, b) => a.id > b.id ? 1 : -1);
    console.log(sortedList);
    return sortedList;
  }

  async handleRemove(e){
    // console.log("remove", e)
    const bigInt = BigInt(e);
    await todo_app.removeTodo(bigInt);
    this.show()
  }

  async changeCompleteness(e){
    const bigInt = BigInt(e.id);
    await todo_app.toggleCompleteness(bigInt, e.description, e.completed);
  }

  async handleToggleCompleted(e){
    // console.log("toggle comlpetion", e);
    this.changeCompleteness(e).then(() => this.show());
    
  }

  handleChange(event) {    
    this.setState({...this.state, newDescription: event.target.value});  
  }

  async addItem(){
    await todo_app.addTodo(this.state.newDescription)
  }

  async handleSubmit(event) {
    if(this.state.newDescription != ''){
      this.addItem().then(() => this.show()).then(this.setState({...this.state, newDescription: ''}));
    }else{
      alert('Enter description to add item.');
    }
    event.preventDefault();
  }

  render() {
    const toDoList = this.state.list.map(el => { // el.completed is boolean
      return el.completed == true ?   
      <div>
        <div key={Number(el.id)} id={Number(el.id)}> {el.description};  </div>
        <button className={'button-completed'} id={Number(el.id)} onClick={() => this.handleToggleCompleted(el)}>Completed</button>
        <button className={''} id={Number(el.id)} onClick={() => this.handleRemove(el.id)}>remove</button>
      </div>
      :
      <div>
        <div key={Number(el.id)} id={Number(el.id)}> {el.description};  </div>
        <button className={'button-incomplete'} id={Number(el.id)} onClick={() => this.handleToggleCompleted(el)}>Incomplete</button>
        <button className={''} id={Number(el.id)} onClick={() => this.handleRemove(el.id)}>remove</button>
      </div>

    });


    return (
      <div style={{ "font-size": "30px" }}>
        <form onSubmit={this.handleSubmit}>       
         <label>
          Description:
          <input type="text" value={this.state.newDescription} onChange={this.handleChange} />       
         </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        <div>Your completed tasks:</div>
        <div>{toDoList}</div>
        
      </div>
      </div>

    );
  }
}

render(<MyHello />, document.getElementById('app'));
