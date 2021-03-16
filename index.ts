interface Property extends Record<string, any> {
  children: string | Array<MyElement>;
}
interface MyElement {
  type: string;
  props: Property;
}

const element: MyElement = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};

const container = document.getElementById("root");

const node = document.createElement(element.type);
node["title"] = element.props.title;

const text = document.createTextNode("");
text["nodeValue"] = element.props.children as string;

node.appendChild(text);
container.appendChild(node);
