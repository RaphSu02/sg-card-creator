import React, { useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "reactflow";

import "reactflow/dist/style.css";

import useStore, { PendingEdgeConnection } from "./store";
import CardNode from "./CardNode";

const nodeTypes = { cardNode: CardNode };

const selector = (state: {
  nodes: any;
  edges: any;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onEdgeUpdate: any;
}) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onEdgeUpdate: state.onEdgeUpdate,
});

const generateRandomId = () => Math.random().toString(36).substring(2, 10);

function Flow() {
  const pendingEdgeConnection = useRef<PendingEdgeConnection | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
  } = useStore(useShallow(selector));

  const onConnectStart = (_event: any, params: PendingEdgeConnection) => {
    pendingEdgeConnection.current = params;
  };

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!pendingEdgeConnection.current) return;
      const handleIsSource =
        pendingEdgeConnection.current.handleType === "source";

      if (event.target.classList.contains("react-flow__pane")) {
        const mousePosition = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode = {
          id: generateRandomId(),
          type: "cardNode",
          position: {
            x: mousePosition.x - (handleIsSource ? 8 : 240),
            y: mousePosition.y - (handleIsSource ? 82 : 65),
          },
          data: {
            name: "",
            strength: "",
            parts: [{ name: "Part 1" }],
            partof: [],
          },
          origin: [0.5, 0.0],
        };

        onNodesChange([{ type: "add", item: newNode }]);

        if (handleIsSource) {
          onEdgesChange([
            {
              type: "add",
              item: {
                id: generateRandomId(),
                source: pendingEdgeConnection.current.nodeId ?? "",
                target: newNode.id,
                sourceHandle: pendingEdgeConnection.current.handleId,
                targetHandle: "0",
              },
            },
          ]);
        } else {
          onEdgesChange([
            {
              type: "add",
              item: {
                id: generateRandomId(),
                source: newNode.id,
                target: pendingEdgeConnection.current.nodeId ?? "",
                sourceHandle: null,
                targetHandle: pendingEdgeConnection.current.handleId,
              },
            },
          ]);
        }
      }
    },
    [onNodesChange, onEdgesChange, screenToFlowPosition],
  );

  const downloadNodes = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(nodes, null, 2),
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        onEdgeUpdate={onEdgeUpdate}
        fitView
        style={{ backgroundColor: "#B8CEFF" }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Panel position="top-right">
          <button onClick={downloadNodes}>Download Nodes</button>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
