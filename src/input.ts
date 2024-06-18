import { Edge, Node } from "reactflow";

export const initialNodes = [
  {
    id: "vp5s434s",
    type: "cardNode",
    position: {
      x: 0.10301109350238846,
      y: -0.26576862123612344,
    },
    data: {
      name: "Kartoffeln",
      strength: 10,
      parts: [],
      partof: [
        {
          nodeid: "83m9qsq8",
          partid: "0",
        },
      ],
    },
  },
  {
    id: "83m9qsq8",
    type: "cardNode",
    position: {
      x: 292.29160063391447,
      y: 16.504437400950884,
    },
    data: {
      name: "Pommes",
      strength: 15,
      parts: [
        {
          name: "Basis",
        },
      ],
      partof: [],
    },
  },
] as Node[];

export const initialEdges = [
  {
    id: "e1",
    source: "vp5s434s",
    sourceHandle: "0",
    target: "83m9qsq8",
    targetHandle: "0",
  },
] as Edge[];
