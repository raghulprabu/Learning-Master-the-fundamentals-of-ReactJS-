➡️React is a JavaScript library for building user interfaces.

➡️React is used to build single-page applications.

➡️React allows us to create reusable UI components.



❤️ How does React Work?

👍 React creates a VIRTUAL DOM in memory.

👍React creates a virtual DOM, which is the lightweight copy of the real DOM in the object form.
   what the changes are visible immediately after you save the file, you do not have to reload the browser!

👍With every change in the component state or props, React creates a new virtual DOM 
   compare/analyze the changes between the new virtual DOM

👍Updating a virtual DOM is much faster and efficient than 
  the actual DOM, as updating a virtual DOM does not require 
  heavy web browser processing like painting and recalibrating the space.
  It involves updating the JavaScript object directly

👍When the root elements of the Virtual DOM trees have different types,
   React’s diffing algorithm discards the entire old DOM tree and constructs a new one from scratch


👋 React Render HTML

   👍React renders HTML to the web page via a container, and a function called createRoot().

👋 The Container

   👍 this container is a <div id="root"></div> element in the index.html file.


👋 The createRoot Function

  👍The createRoot() function takes one argument, an HTML element.
  👍The purpose of the function is to define the HTML element where a React component should be displayed.




  👋 The render Method

  👍 Did you notice the render method?

  👍The render method defines what to render in the HTML container.

  👍 The result is displayed in the <div id="root"> element.


   import { createRoot } from 'react-dom/client'

    createRoot(document.getElementById('root')).render(
       <p>Welcome!</p>
      ) 

  Note: the element id does not have to be "root", but this is the standard convention.







Thinkinng React

✌️React idea → Break your app into small pieces (called components). 
Example: Button, Search bar, Table row.

 ✌️Visual states → Each component can look different depending on data. 
Example: “Out of stock” text turns red.

Data flow → Components are connected, and data passes from parent → child. 
Example: Search bar sends text → table filters products.



👉 In the tutorial, they show this by building a searchable product table:

Split into SearchBar + ProductTable + ProductRow.

Add states like “in stock / not in stock”.

Connect them so typing in search updates the table.

That’s all React is: break into components → handle states → connect with data flow 🚀