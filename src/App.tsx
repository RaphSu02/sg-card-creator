import React from "react";
import { useShallow } from "zustand/react/shallow";
import ReactFlow, { Controls, Background } from "reactflow";

import "reactflow/dist/style.css";

import useStore from "./store";
import CardNode from "./CardNode";

const nodeTypes = { cardNode: CardNode };

const selector = (state) => ({
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
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

/*
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Background,
} from "reactflow";

import "reactflow/dist/style.css";

import CardNode from "./CardNode";

import "./card-node.css";

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

const initialNodes = [
  {
    id: "node-1",
    type: "cardNode",
    position: { x: 0, y: 0 },
    data: {
      name: "Node 1",
      strength: 10,
      parts: [{ name: "Part 1" }],
    },
  },
  {
    id: "node-2",
    type: "cardNode",
    position: { x: 100, y: 180 },
    data: {
      name: "Node 2",
      strength: 10,
      parts: [{ name: "Part 1" }, { name: "Part 2" }],
    },
  },
];

const initialEdges = [
  { id: "edge-1", source: "node-1", target: "node-2", targetHandle: "part-1" },
];

const nodeTypes = { cardNode: CardNode };

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
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
        style={rfStyle}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
 */
