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
  useReactFlow,
} from "reactflow";

import initialNodes from "./nodes";
import initialEdges from "./edges";

export type CardNodeData = {
  name: string;
  strength: number;
  parts: { name: string }[];
};

export type PendingEdgeConnection = {
  nodeId: string | null;
  handleId: string | null;
  handleType: string | null;
};

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  pendingEdgeConnection: PendingEdgeConnection | null;

  onNodesChange: OnNodesChange;
  addNode: (node: Node) => void;
  onEdgesChange: OnEdgesChange;

  onConnectStart: (
    event: React.MouseEvent,
    params: PendingEdgeConnection,
  ) => void;
  onConnect: OnConnect;
  onConnectEnd: (event: React.MouseEvent) => void;

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
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  pendingEdgeConnection: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  addNode: (node: Node) => {
    get().onNodesChange([{ type: "add", item: node }]);
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnectStart: (_event: React.MouseEvent, params: PendingEdgeConnection) => {
    console.log("onConnectStart", params);

    set({ pendingEdgeConnection: params });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  onConnectEnd: (event: any) => {
    if (get().pendingEdgeConnection == null) return;

    const { screenToFlowPosition } = useReactFlow();

    if (event.target.classList.contains("react-flow__node")) {
      console.log("onConnectEnd", event.target.classList);

      const newNode = {
        id: Math.random().toString(36).substring(2, 10),
        type: "cardNode",
        position: screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
        data: {
          name: null,
          strength: null,
          parts: [{ name: "Part 1" }],
        },
        origin: [0.5, 0.0],
      };

      get().addNode(newNode);

      const newEdge = {
        source: get().pendingEdgeConnection?.nodeId ?? "",
        target: newNode.id,
        sourceHandle:
          get().pendingEdgeConnection?.handleType === "source"
            ? get().pendingEdgeConnection?.handleId!
            : null,
        targetHandle:
          get().pendingEdgeConnection?.handleType === "target"
            ? get().pendingEdgeConnection?.handleId!
            : null,
      };
      set({
        edges: addEdge(newEdge, get().edges),
      });
    }
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },

  onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => {
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
}));

export default useStore;
