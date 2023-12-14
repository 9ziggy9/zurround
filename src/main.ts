type Frame = {
  id: `frame-${number}`;
  ref: HTMLDivElement;
  x: number;
  y: number;
}

interface FrameHandler {
  frames: {[id: Frame["id"]]: Frame};
  new:    (x: Frame["x"], y: Frame["y"]) => Frame["id"];
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

  function __attachFloatingLogic(div: HTMLDivElement): void {
    div.onmousedown = function(e) {
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

  function __generateFrameHeader(headerText: string): HTMLDivElement {
    const header = document.createElement("div");
    if (!header) throw new Error("Failed to generate header.");
    header.setAttribute("class", "frame-header");
    header.innerText = headerText;
    return header;
  }

  function __generateFrameContent(): HTMLDivElement {
    const content = document.createElement("div");
    if (!content) throw new Error("Failed to generate content.");
    content.setAttribute("class", "frame-entry");
    content.innerText = "Testing Window Content";
    return content;
  }

  function __newFrameAtPosition(
    x: Frame["x"],
    y: Frame["y"],
    headerText?: string,
  ): Frame["id"] {
    const newFrameDiv = document.createElement("div");
    if (!newFrameDiv) throw new Error("Failed to create new frame.");
    __attachFloatingLogic(newFrameDiv);
    const newFrameId  = __newIdentifier();
    newFrameDiv.setAttribute("class", "frame");
    newFrameDiv.style.left = `${x}px`;
    newFrameDiv.style.top  = `${y}px`
    newFrameDiv.setAttribute("id", newFrameId);

    newFrameDiv.append(
      __generateFrameHeader(headerText || newFrameId),
      __generateFrameContent(),
    );

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
    new:    (x, y)  => __newFrameAtPosition(x,y),
  };
}

function main(): void {
  const fh: FrameHandler = initFrameHandler();
  fh.new(0,0);
}

window.onload = main;
