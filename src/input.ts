import { Edge, Node } from "reactflow";

const generateRandomId = () => Math.random().toString(36).substring(2, 10);

const idA = generateRandomId();
const idB = generateRandomId();

export const initialNodes = [
  {
    id: idA,
    type: "cardNode",
    position: {
      x: 0.10301109350238846,
      y: -0.26576862123612344,
    },
    data: {
      name: "Kartoffeln",
      picture: "kartoffeln.png",
      strength: 10,
      diet: "Vegan",
      probability: 0.2,
      parts: [],
      partof: [
        {
          nodeid: idB,
          partid: "0",
        },
      ],
    },
  },
  {
    id: idB,
    type: "cardNode",
    position: {
      x: 292.29160063391447,
      y: 16.504437400950884,
    },
    data: {
      name: "Pommes",
      picture: "pommes.png",
      strength: 15,
      diet: "Omnivore",
      probability: 0.03,
      parts: [
        {
          name: "Basis",
          from: [idA],
        },
      ],
      partof: [],
    },
  },
] as Node[];

export const initialEdges = [
  {
    id: idA + "-to-" + idB,
    source: idA,
    sourceHandle: "0",
    target: idB,
    targetHandle: "0",
  },
] as Edge[];
