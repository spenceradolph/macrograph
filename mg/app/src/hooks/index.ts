import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Store } from "../store";
import { NodePin } from "../store/Nodes";

export const usePin = (pin: NodePin) => {
  const ref = useRef<HTMLDivElement>(null);

  const moveListener = useCallback((e: MouseEvent) => {
    Store.ui.setMouseDragLocation({ x: e.clientX, y: e.clientY });
  }, []);

  const upListener = useCallback(() => {
    window.removeEventListener("mouseup", upListener);
    window.removeEventListener("mousemove", moveListener);
  }, [moveListener]);

  usePinLocation(pin, ref);

  const ret = useMemo(
    () => ({
      props: {
        style: { pointerEvents: "all" } as const,
        onDoubleClick: () => Store.graph.disconnectPin(pin),
        onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation();
          Store.ui.setDraggingPin(pin);

          window.addEventListener("mousemove", moveListener);
          window.addEventListener("mouseup", upListener);
        },
        onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation();
          const dragginPin = Store.ui.draggingPin;
          if (dragginPin)
            Store.graph.connectPins({ from: dragginPin, to: pin }).then(() => {
              Store.ui.setDraggingPin();
            });
        },
      },
      ref,
    }),
    [moveListener, upListener, pin]
  );

  return ret;
};

export const usePinLocation = (
  pin: NodePin,
  ref: RefObject<HTMLDivElement>
) => {
  useLayoutEffect(() => {
    let rect = ref.current?.getBoundingClientRect()!;

    pin.setPosition({
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    });
  });
};
