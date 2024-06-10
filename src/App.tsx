import React from "react";
import { useShallow } from "zustand/react/shallow";
import ReactFlow, { Controls, Background } from "reactflow";

import "reactflow/dist/style.css";

import useStore from "./store";
import CardNode from "./CardNode";

const nodeTypes = { cardNode: CardNode };

const selector = (state: {
  nodes: any;
  edges: any;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
}) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector),
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ backgroundColor: "#B8CEFF" }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
