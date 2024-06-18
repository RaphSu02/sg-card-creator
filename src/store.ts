import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  updateEdge,
} from "reactflow";

import { initialNodes, initialEdges } from "./input";

export type CardNodeData = {
  name: string;
  strength: number;
  parts: { name: string; from?: string }[];
  partof: { nodeid: string; partid: string }[];
};

export type PendingEdgeConnection = {
  nodeId: string | null;
  handleId: string | null;
  handleType: string | null;
};

export type RFState = {
  nodes: Node[];
  edges: Edge[];

  onNodesChange: OnNodesChange;
  addNode: (node: Node) => void;
  onEdgesChange: OnEdgesChange;

  onConnect: OnConnect;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => void;

  updateCardName: (nodeId: string | null, name: string) => void;
  updateCardStrength: (nodeId: string | null, strength: number) => void;
  addCardPart: (nodeId: string | null, partName: string) => void;
  updateCardPartName: (
    nodeId: string | null,
    partIndex: number,
    name: string,
  ) => void;
  removeLastCardPart: (nodeId: string | null) => void;

  onEdgeAdd: (connection: Connection) => void;
  onEdgeRemove: (edge: Edge) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  addNode: (node: Node) => {
    get().onNodesChange([{ type: "add", item: node }]);
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    for (const change of changes) {
      if (change.type === "add") {
        get().onEdgeAdd(change.item as Connection);
      }

      if (change.type === "remove") {
        const edge = get().edges.find((edge) => edge.id === change.id);
        if (!edge) {
          console.error("Edge not found", change);
          return;
        }
        get().onEdgeRemove(edge);
      }
    }
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },

  onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => {
    get().onEdgeRemove(oldEdge);
    get().onEdgeAdd(newConnection);
    set({ edges: updateEdge(oldEdge, newConnection, get().edges) });
  },

  updateCardName: (nodeId: string | null, name: string) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, name } } : node,
      ),
    }));
  },
  updateCardStrength: (nodeId: string | null, strength: number) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, strength } }
          : node,
      ),
    }));
  },
  addCardPart: (nodeId: string | null, partName: string) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                parts: [...node.data.parts, { name: partName }],
              },
            }
          : node,
      ),
    }));
  },
  updateCardPartName: (
    nodeId: string | null,
    partIndex: number,
    name: string,
  ) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                parts: node.data.parts.map((part, index) =>
                  index === partIndex ? { name } : part,
                ),
              },
            }
          : node,
      ),
    }));
  },
  removeLastCardPart: (nodeId: string | null) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                parts: node.data.parts.slice(0, -1),
              },
            }
          : node,
      ),
    }));
  },

  onEdgeAdd: (connection: Connection) => {
    const sourceNode = get().nodes.find(
      (node) => node.id === connection.source,
    );
    const targetNode = get().nodes.find(
      (node) => node.id === connection.target,
    );

    if (!sourceNode || !targetNode) {
      console.error("Source or target node not found", connection);
      return;
    }
    if (
      connection.targetHandle === undefined ||
      connection.targetHandle === null
    ) {
      console.error("Target handle not found", connection);
      return;
    }

    sourceNode.data.partof.push({
      nodeid: targetNode.id,
      partid: connection.targetHandle,
    });
    targetNode.data.parts[parseInt(connection.targetHandle)].from =
      sourceNode.id;
  },
  onEdgeRemove: (edge: Edge) => {
    const sourceNode = get().nodes.find((node) => node.id === edge.source);
    const targetNode = get().nodes.find((node) => node.id === edge.target);

    if (!sourceNode || !targetNode) {
      console.error("Source or target node not found", edge);
      return;
    }
    if (edge.targetHandle === undefined || edge.targetHandle === null) {
      console.error("Target handle not found", edge);
      return;
    }

    sourceNode.data.partof = sourceNode.data.partof.filter(
      (part) =>
        part.nodeid !== targetNode.id || part.partid !== edge.targetHandle,
    );
    targetNode.data.parts[parseInt(edge.targetHandle)].from = undefined;
  },
}));

export default useStore;
