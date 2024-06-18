import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  ControlButton,
  NodeRemoveChange,
  Node,
  NodeResetChange,
  EdgeRemoveChange,
  EdgeResetChange,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";

import useStore, { CardNodeData, PendingEdgeConnection } from "./store";
import CardNode from "./CardNode";

import "reactflow/dist/style.css";

const nodeTypes = { cardNode: CardNode };

const selector = (state: {
  nodes: any;
  edges: any;
  setNodes: any;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onEdgeUpdate: any;
}) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onEdgeUpdate: state.onEdgeUpdate,
});

const generateRandomId = () => Math.random().toString(36).substring(2, 10);

function Flow() {
  const pendingEdgeConnection = useRef<PendingEdgeConnection | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    setNodes,
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

  const uploadNodes = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const nodeChanges: Array<NodeRemoveChange | NodeResetChange> = [];
      const edgeChanges: Array<EdgeRemoveChange | EdgeResetChange> = [];
      for (const node of nodes) {
        nodeChanges.push({ type: "remove", id: node.id });
      }
      for (const edge of edges) {
        edgeChanges.push({ type: "remove", id: edge.id });
      }

      const data: Array<Node<CardNodeData>> = JSON.parse(
        event.target?.result as string,
      );
      for (const node of data) {
        nodeChanges.push({ type: "reset", item: node });
        for (const part of node.data.partof) {
          edgeChanges.push({
            type: "reset",
            item: {
              id: `${node.id}-to-${part.nodeid}-${part.partid}`,
              source: node.id,
              sourceHandle: "card",
              target: part.nodeid,
              targetHandle: part.partid,
            },
          });
        }
      }

      onNodesChange(nodeChanges);
      onEdgesChange(edgeChanges);
    };
    reader.readAsText(file);
    setShowUpload(false);
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
        elevateEdgesOnSelect={true}
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Background />
        <Controls>
          <ControlButton onClick={downloadNodes}>
            <FontAwesomeIcon icon={fas.faDownload} style={{ color: "black" }} />
          </ControlButton>
          <ControlButton onClick={() => setShowUpload(true)}>
            <FontAwesomeIcon icon={fas.faUpload} style={{ color: "black" }} />
          </ControlButton>
        </Controls>
        {showUpload && (
          <Panel position="bottom-center">
            <div
              style={{
                padding: 15,
                backgroundColor: "red",
                border: "1px solid maroon",
                borderRadius: 15,
              }}
            >
              <input type="file" onChange={uploadNodes} />
            </div>
          </Panel>
        )}
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
