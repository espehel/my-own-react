interface Property extends Record<string, any> {
  children: Array<MyElement>;
}
interface MyElement {
  type: string;
  props: Property;
}

export const render = (element: MyElement, container: HTMLElement) => {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom as HTMLElement));

  container.appendChild(dom);
};

export const createElement = (
  type: string,
  props?: Record<string, any>,
  ...children: Array<MyElement | string | number>
): MyElement => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
};

const createTextElement = (text: any): MyElement => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};
