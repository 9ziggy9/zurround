type Frame = {
  id: `frame-${number}`;
  ref: HTMLDivElement;
  x: number;
  y: number;
}

interface FrameHandler {
  frames:   {[id: Frame["id"]]: Frame};
  newFrame: (x: Frame["x"], y: Frame["y"]) => Frame["id"];
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

  function __newFrameAtPosition(x: Frame["x"], y: Frame["y"]): Frame["id"] {
    const newFrameDiv = document.createElement("div");
    if (!newFrameDiv) { throw new Error("Failed to create new frame."); }
    const newFrameId  = __newIdentifier();
    newFrameDiv.setAttribute("class", "frame");
    newFrameDiv.style.left = `${x}px`;
    newFrameDiv.style.top  = `${y}px`
    newFrameDiv.setAttribute("id", newFrameId);
    __frames[newFrameId] = {
      x, y,
      id:  newFrameId,
      ref: newFrameDiv,
    };
    return newFrameId;
  }

  return {
    frames:   __frames,
    newFrame: (x, y)  => __newFrameAtPosition(x,y),
  };
}

function main(): void {
  const draggedEl = document.getElementById("frame-1") as HTMLElement;
  if (!draggedEl) return;
  draggedEl.onmousedown = function(e) {
    console.log("Mouse down.");
    const dx: number = e.clientX - draggedEl.getBoundingClientRect().left;
    const dy: number = e.clientY - draggedEl.getBoundingClientRect().top;
    document.onmousemove = function(e) {
      console.log("Mouse move.");
      draggedEl.style.left = `${e.clientX - dx}px`;
      draggedEl.style.top  = `${e.clientY - dy}px`;
    };
    document.onmouseup = function () {
      console.log("Mouse up.");
      document.onmousemove = document.onmouseup = null;
    };
  }
}

window.onload = main;
