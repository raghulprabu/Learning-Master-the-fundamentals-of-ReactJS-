🖐️ What is a Hook?
👍Hooks are functions that let you "hook into" React state and lifecycle features from functional components.
👍A common way to optimize re-rendering performance is to skip unnecessary work
👍it is Special functions for functional components.



🖐️Why needed?
Before hooks, we had to use class components for things like state and lifecycle. Hooks make it possible in function components, which are simpler.

👉 Think of hooks as shortcuts to add special powers to your components.



🚩Hook Rules
There are 3 rules for hooks:

👉Hooks can only be called inside React function components.
👉Hooks can only be called at the top level of a component.
eg: import { useState } from 'react';
👉Hooks cannot be conditional


Note: Hooks will not work in React class components.





Summary (Concept → Example → Real-Time)

Hooks = Special functions for functional components.

useState → Store values (like variables that survive renders).
🛒 Example: Cart items, dark/light mode toggle.

useEffect → Run side effects.
🌐 Example: Fetch API data when page loads.

Other Hooks → For context, optimization, and DOM access.

Real-Time → Every app (Login, Dashboard, E-commerce, Todo) uses hooks heavily.