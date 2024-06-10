import { Node } from "reactflow";

export default [
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
      parts: [{ name: "Part 1" }, { name: "Part 2" }, { name: "Part 3" }],
    },
  },
] as Node[];
