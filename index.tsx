import * as React from "./my-react";

const App = (props) => (
  <div id="my-element">
    <h1>Hello {props.name}</h1>
    <section>
      <p>How are you?</p>
    </section>
  </div>
);
const element = <App name="Espen" />;
const container = document.getElementById("root");

React.render(element, container);
