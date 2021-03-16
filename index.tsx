import * as React from "./my-react";

const element = (
  <div id="my-element">
    <h1>Hello</h1>
    <section>
      <p>How are you?</p>
    </section>
  </div>
);

const container = document.getElementById("root");

React.render(element, container);
