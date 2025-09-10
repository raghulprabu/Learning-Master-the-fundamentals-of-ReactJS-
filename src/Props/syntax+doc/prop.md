👋 React Props

1. What are Props in React?

Definition:
props (short for properties) are used to pass data from a parent component to a child component.
➡️They work like function parameters and are read-only.
➡️In HTML terms, they’re similar to attributes.

syntax eg

// Parent Component
import React from "react";
import Greeting from "./Greeting";

function App() {
  return (
    <div>
      <Greeting name="Raghul" />
      <Greeting name="Prabu" />
    </div>
  );
}

export default App;

// Child Component
function Greeting(props) {
  return <h2>Hello, {props.name} 👋</h2>;
}


Think of them like arguments in a function.

❤️ Why we need props:
React components are reusable. Instead of hardcoding data, we make components dynamic using props.


👋Why Props are Important

✌️They make components reusable and dynamic.
✌️Instead of hardcoding values, you pass them in.
✌️Props allow data flow from parent → child (one-way binding).


👋 Props Can Be Anything

Props are not limited to strings/numbers. They can be:

Strings
Numbers
Arrays
Objects
Functions




🖐️Prop Children

👍In React, you can send the content between the opening and closing tags of a component, to another component.

eg:
 <Childrenchild>
<h1> this is Front end developement courses </h1>
<h1>this is  react js courses complete  </h1>
</Childrenchild>

This can be accessed in the other component using the props.children property.
  <h1>{props.children}</h1>

From the Parent component, send the content between the opening and closing tags of the Son and Daughter components:



🖐️Props Destructuring

Definition:
👍Instead of writing props.name or props.age repeatedly, we can destructure props directly inside the function parameters.


function User({ name, age }) {
  return <h2>{name} is {age} years old</h2>;
}

// Usage
<User name="Raghul" age={22} />
<User name="Prabu" age={25} />





Note: React uses curly brackets to destructure props: {color}.