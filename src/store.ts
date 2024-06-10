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
} from "reactflow";

import initialNodes from "./nodes";
import initialEdges from "./edges";

export type CardNodeData = {
  name: string;
  strength: number;
  parts: { name: string }[];
};

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateCardName: (nodeId: string | null, name: string) => void;
  updateCardStrength: (nodeId: string | null, strength: number) => void;
  updateCardPartName: (
    nodeId: string | null,
    partIndex: number,
    name: string,
  ) => void;
  addCardPart: (nodeId: string | null, partName: string) => void;
  removeLastPart: (nodeId: string | null) => void;
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
  onEdgesChange: (changes: EdgeChange[]) => {
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
  removeLastPart: (nodeId: string | null) => {
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
}));

export default useStore;
