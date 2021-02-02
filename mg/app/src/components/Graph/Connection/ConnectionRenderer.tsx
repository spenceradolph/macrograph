import { useRef, useState, useLayoutEffect } from "react";
import { observer } from "mobx-react-lite";

import { Store } from "../../../store";
import Connection from "./Connection";
import MouseConnection from "./MouseConnection";
import { XYCoords } from "@macrograph/core";

const ConnectionRenderer = observer(({ onClick }: any) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [svgOffset, setSvgOffset] = useState<XYCoords>({
    x: 0,
    y: 0,
  });

  useLayoutEffect(() => {
    setSvgOffset(svgRef.current?.getBoundingClientRect()!);

    window.addEventListener("resize", () => {
      setSvgOffset(svgRef.current?.getBoundingClientRect()!);
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgRef.current?.clientWidth || 0} ${
        svgRef.current?.clientHeight || 0
      }`}
      className="absolute w-full h-full"
      onClick={onClick}
    >
      {Store.graph.connections.map((c) => (
        <Connection
          svgOffset={svgOffset}
          connection={c}
          key={`${c.output.id}->${c.input.id}`}
        />
      ))}
      <MouseConnection svgOffset={svgOffset} />
    </svg>
  );
});

export default ConnectionRenderer;
