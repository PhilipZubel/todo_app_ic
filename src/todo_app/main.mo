import Array "mo:base/Array";
import Nat "mo:base/Nat";

// Define the actor
actor Assistant {

  stable var todos : [ToDo] = [];
  stable var nextId : Nat = 1;

  // Define to-do item properties
  type ToDo = {
    id : Nat;
    description : Text;
    completed : Bool;
  };

  // Add to-do item utility
  func add(todos : [ToDo], description : Text, id : Nat) : [ToDo] {
    let todo : ToDo = {
      id = id;
      description = description;
      completed = false;
    };
    Array.append(todos, [todo])
};

  // func remove(todos : [ToDo], id : Nat) : [ToDo]{
  //   // https://forum.dfinity.org/t/motoko-syntax-is-very-stange/1695
  //   Array.filter(todos, func(val: ToDo) : Bool { id != val.id });
  // }

  // Show to-do item utility
  func show(todos : [ToDo]) : Text {
    var output : Text = "\n___TO-DOs___";
    for (todo : ToDo in todos.vals()) {
      output #= "\n(" # Nat.toText(todo.id) # ") " # todo.description;
      if (todo.completed) { output #= " ✔"; };
    };
    output
  };

  

  public func addTodo (description : Text) : async () {
    todos := add(todos, description, nextId);
    nextId += 1;
  };

  public func removeTodo (id: Nat): async(){
    // https://forum.dfinity.org/t/motoko-syntax-is-very-stange/1695
    todos := Array.filter(todos, func(val: ToDo) : Bool { id !=  val.id });
  };

  public func toggleCompleteness (id: Nat): async(){
    // toggle completeness of item with the given id
    // https://sdk.dfinity.org/docs/base-libraries/array
    var todo : ToDo = Array.find(todos, func(val: ToDo) : Bool { id != val.id});
    todo.completed := !todo.completed;
  };

  public query func showTodos () : async Text {
    show(todos)
  };

  public query func getTodos () : async [ToDo] {
    todos
  }

};