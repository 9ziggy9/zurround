type FrameSpecification = {
  content: HTMLElement;
  headerText?: string;
  x?: number; y?: number;
  w?: number | string;
  h?: number | string;
}

type Frame = {
  id: `frame-${number}`;
  ref: HTMLDivElement;
  x: number;
  y: number;
}

interface FrameHandler {
  frames: {[id: Frame["id"]]: Frame};
  new:    (s: FrameSpecification) => Frame["id"];
};

function initFrameHandler(): FrameHandler {
  const __frames: FrameHandler["frames"] = {};

  function __newIdentifier(): Frame["id"] {
    const gapIdx = Object.keys(__frames)
      .map(key => parseInt(key.split("-")[1])) // array of num field of id.
      .sort((a, b) => a - b)                   // sort in ascending order.
      .findIndex((idNo, arrIdx) => idNo !== arrIdx + 1); // find disordered id.
    return gapIdx !== -1
      ? `frame-${gapIdx + 1}`
      : `frame-${Object.keys(__frames).length + 1}`;
  }

  function __attachBaseAttributes(
    div: HTMLDivElement, id: Frame["id"],
    x: number, y: number,
    w: number | string,
    h: number | string,
  ): void {
    div.setAttribute("class", "frame");
    div.style.left = `${x}px`;
    div.style.top  = `${y}px`
    div.style.width = `${w}`;
    div.style.height = `${h}`
    div.setAttribute("id", id);
  }

  function __attachHeaderClickLogic(div: HTMLDivElement): void {
    const header = div.children[0] as HTMLElement;
    if (!header) throw new Error("__attachFloatingLogic(): no header div found.");

    header.onmousedown = function(e) {
      e.stopPropagation();
      const dx: number = e.clientX - div.getBoundingClientRect().left;
      const dy: number = e.clientY - div.getBoundingClientRect().top;
      document.onmousemove = function(e) {
        div.style.left = `${e.clientX - dx}px`;
        div.style.top  = `${e.clientY - dy}px`;
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    }
  }

  const isWithinCorner = (
    cW: number, cH: number,
    x: number, y: number
  ): boolean => x >= 0 && x <= cW && y >= 0 && y <= cH;

  function __attachCornerClickLogic(div: HTMLDivElement): void {
    div.onmousedown = function(e) {
      const relX = div.getBoundingClientRect().right - e.clientX;
      const relY = div.getBoundingClientRect().bottom - e.clientY;
      const pseudoCorner = getComputedStyle(div, ":after");
      // slice is to remove px from string
      const pW = Number(pseudoCorner.getPropertyValue("width").slice(0,-2));
      const pH = Number(pseudoCorner.getPropertyValue("height").slice(0,-2));
      document.onmousemove = function(e) {
        if (isWithinCorner(pW, pH, relX, relY)) {
          const newW = e.clientX - div.getBoundingClientRect().left;
          const newH = e.clientY - div.getBoundingClientRect().top;
          div.style.width  = `${newW}px`;
          div.style.height = `${newH}px`;
        }
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      }
    }
  }

  function __generateFrameHeader(headerText: string): HTMLDivElement {
    const header = document.createElement("div");
    if (!header) throw new Error("Failed to generate header.");
    header.setAttribute("class", "frame-header");
    header.innerText = headerText;
    return header;
  }

  function __generateFrameContent(contentElement: HTMLElement): HTMLDivElement {
    const content = document.createElement("div");
    if (!content) throw new Error("Failed to generate content.");
    content.setAttribute("class", "frame-entry");
    content.appendChild(contentElement);
    return content;
  }

  function __extractSpecsOrDefault(s: FrameSpecification): {
    x: number, y: number, w: number | string, h: number | string,
    headerText: string,
  }{
    let {x, y, headerText, w, h} = s;
    return {
      x: x === undefined ? 0 : x,
      y: y === undefined ? 0 : y,
      w: w === undefined ? "25vw": w,
      h: h === undefined ? "10vh": h,
      headerText: headerText === undefined ? "" : headerText,
    };
  }

  function __newFrameAtPosition(spec: FrameSpecification): Frame["id"] {
    let {x, y, w, h, headerText} = __extractSpecsOrDefault(spec);
    const newFrameDiv = document.createElement("div");

    if (!newFrameDiv) throw new Error("Failed to create new frame.");

    const newFrameId  = __newIdentifier();

    __attachBaseAttributes(newFrameDiv, newFrameId, x, y, w, h);

    newFrameDiv.append(
      __generateFrameHeader(headerText || newFrameId),
      __generateFrameContent(spec.content),
    );

    __attachHeaderClickLogic(newFrameDiv);
    __attachCornerClickLogic(newFrameDiv);

    __frames[newFrameId] = {
      x, y,
      id:  newFrameId,
      ref: newFrameDiv,
    };

    const body = document.getElementsByTagName("body")[0];
    body!.appendChild(newFrameDiv);

    return newFrameId;
  }

  return {
    frames: __frames,
    new:    (s: FrameSpecification)  => __newFrameAtPosition(s),
  };
}

function main(): void {
  const fh: FrameHandler = initFrameHandler();

  const newWinContent = document.createElement("div");
  newWinContent.innerHTML = "<h3>Hello, Content!</h3>"

  const new2 = document.createElement("div");
  new2.innerHTML = "<h3>content2</h3>"

  const new3 = document.createElement("div");
  new3.innerHTML = "<h3>yeah yeah</h3>"

  fh.new({
    content: newWinContent,
    x: 0,
    y: 0,
  });
  fh.new({
    content: new2,
    x: 100,
    y: 300,
  });
  fh.new({
    content: new3,
    x: 200,
    y: 300,
    w: "200px",
    h: "400px",
  });
}

window.onload = main;
