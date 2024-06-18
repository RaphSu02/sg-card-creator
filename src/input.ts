import { Edge, Node } from "reactflow";

const nodes = [
  {
    id: "node-1",
    type: "cardNode",
    position: { x: 0, y: 0 },
    data: {
      name: "Node 1",
      strength: 10,
      parts: [{ name: "Part 1" }],
      partof: [{ nodeid: "node-2", partid: "1" }],
    },
  },
  {
    id: "node-2",
    type: "cardNode",
    position: { x: 100, y: 180 },
    data: {
      name: "Node 2",
      strength: 10,
      parts: [
        { name: "Part 1" },
        { name: "Part 2", from: "node-1" },
        { name: "Part 3" },
      ],
      partof: [],
    },
  },
];

var edges: {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}[] = [];
for (const node of nodes) {
  for (const part of node.data.partof) {
    edges.push({
      id: `${node.id}-${part.nodeid}-${part.partid}`,
      source: node.id,
      sourceHandle: "card",
      target: part.nodeid,
      targetHandle: part.partid,
    });
  }
}

export const initialNodes = nodes as Node[];
export const initialEdges = edges as Edge[];
