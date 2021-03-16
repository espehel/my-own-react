interface Properties extends Record<string, any> {
  children: Array<MyElement>;
}
interface MyElement {
  type: string;
  props: Properties;
}

interface Fiber extends MyElement {
  dom?: HTMLElement | Text;
  parent?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
}

let nextUnitOfWork: Fiber = null;
let wipRoot: Fiber = null;

const commitRoot = () => {
  commitWork(wipRoot.child);
  wipRoot = null;
};

const commitWork = (fiber?: Fiber) => {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

export const render = (element: MyElement, container: HTMLElement) => {
  wipRoot = {
    type: element.type,
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork = wipRoot;
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

const createDom = (fiber: Fiber) => {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
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

const workLoop = (deadline) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
};
requestIdleCallback(workLoop);

const performUnitOfWork = (fiber: Fiber): Fiber => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling: Fiber = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
};
