import { useRef, useState } from "react";

const ResizablePanels = () => {
  const [topHeight, setTopHeight] = useState(300); // Initial height in pixels
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    const startY = e.clientY;
    const startHeight = topHeight;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const newHeight = startHeight + deltaY;
      setTopHeight(Math.max(newHeight, 100)); // Minimum height of 100px
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="topPane" style={{ height: `${topHeight}px` }}>
        Top Pane
      </div>
      <div className="resizerY" onMouseDown={handleMouseDown} />
      <div
        className="bottomPane"
        style={{ height: `calc(100% - ${topHeight + 5}px)` }}
      >
        Bottom Pane
      </div>
    </div>
  );
};

export default ResizablePanels;
