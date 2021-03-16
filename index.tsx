import * as React from "./my-react";

const Counter = () => {
  const [state, setState] = React.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
};

const App = (props) => (
  <div id="my-element">
    <h1>Hello {props.name}</h1>
    <section>
      <p>How are you?</p>
    </section>
    <Counter />
  </div>
);

const element = <App name="Espen" />;
const container = document.getElementById("root");

React.render(element, container);
