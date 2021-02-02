import { Store } from "../../store";
import Node from "./Node";
import { observer } from "mobx-react-lite";

interface Props {
  selected?: number;
  setSelectedNode(i: number): void;
}

const NodesRenderer = observer(({ selected, setSelectedNode }: Props) => {
  const nodes: JSX.Element[] = [];
  Store.graph.nodes.forEach((node, id) =>
    nodes.push(
      <div key={id} className="relative">
        <Node
          node={node}
          selected={id === selected}
          onMouseDown={() => setSelectedNode(id)}
        />
      </div>
    )
  );
  return <>{nodes}</>;
});

export default NodesRenderer;
