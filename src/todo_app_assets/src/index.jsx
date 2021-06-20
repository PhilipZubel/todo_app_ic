import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as todo_app_idl, canisterId as todo_app_id } from 'dfx-generated/todo_app';


const agent = new HttpAgent();
const todo_app = Actor.createActor(todo_app_idl, { agent, canisterId: todo_app_id });

// Insert these lines after the import statements for
// importing an agent and an actor
import * as React from 'react';
import { render } from 'react-dom';
import '../assets/style.css'; // Import custom styles
import 'bootstrap/dist/css/bootstrap.css';

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
    // console.log(sortedList);
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
        <div class="my-3 row justify-content-center" key={Number(el.id)} id={Number(el.id)}> 
          <div class="col-6 mt-1">{el.description} </div>
          <div class="col-3">
          <button className={'btn btn-success btn-round'} id={Number(el.id)} onClick={() => this.handleToggleCompleted(el)}>Item Completed</button>
          </div>
          <div class="col-3">
          <button className={'btn btn-secondary btn-round'} id={Number(el.id)} onClick={() => this.handleRemove(el.id)}>Remove Item</button>
          </div>
        </div>
      </div>
      :
      <div>
        <div class="my-3 row justify-content-center" key={Number(el.id)} id={Number(el.id)}> 
          <div class="col-6 mt-1">{el.description} </div>
          <div class="col-3">
          <button className={'btn btn-warning btn-round'} id={Number(el.id)} onClick={() => this.handleToggleCompleted(el)}>Item Incomplete</button>
          </div>
          <div class="col-3">
          <button className={'btn btn-secondary btn-round'} id={Number(el.id)} onClick={() => this.handleRemove(el.id)}>Remove Item</button>
          </div>
        </div>
      </div>



    //   <div class="row justify-content-center">
    // <div class="col-4">
    //   One of two columns
    // </div>
    // <div class="col-4">
    //   One of two columns
    // </div>

    });


    return (
      <div className={'container'}>
        <div class="card text-center">
          <div class="card-header mt-4 mb-2">
            <h1>To Do list:</h1>
          </div>
          <div class="card-body new-item-section pt-2">
            <div class="row justify-content-md-center">
              <div class="col-auto">
                <h4 class="card-title mt-3">Add new item:</h4>
              </div>
              <div class="col-auto">
                <form class="row g align-items-center mt-2" onSubmit={this.handleSubmit}>  
                <div class="col-auto">
                  <input type="text" class="form-control" value={this.state.newDescription} onChange={this.handleChange} />         
                </div>     
                <div class="col-auto">
                  <input type="submit" class="btn btn-primary" value="Submit" />
                </div>
                </form>
              </div>
            </div>
          </div>
          <div class="card-footer sm-container">
            <div> <b>Your tasks:</b></div>
            <div>{toDoList}</div>        
          </div>
        </div>
        
      
      </div>

    );
  }
}

render(<MyHello />, document.getElementById('app'));
