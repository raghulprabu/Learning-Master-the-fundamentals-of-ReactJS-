👋 React Props

➡️props stands for properties.
➡️Props are a way to pass data from a parent component to a child component.
➡️They work like function parameters and are read-only.
➡️In HTML terms, they’re similar to attributes.


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

JSX (components)



🖐️Prop destructuring
















🖐️Prop Children
In React, you can send the content between the opening and closing tags of a component, to another component.
eg:
 <Childrenchild>
<h1> this is Front end developement courses </h1>
<h1>this is  react js courses complete  </h1>
</Childrenchild>

This can be accessed in the other component using the props.children property.
  <h1>{props.children}</h1>

From the Parent component, send the content between the opening and closing tags of the Son and Daughter components: