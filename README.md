# Card Creator

This project allows for an easy creation of cards for [this game](https://github.com/janadorer/SGBonus). The core concept of the game is based on ingredient cards that can be combined to meals. The ingredients of meals can also be substituted.

Each card is modelled as follows:

```
Card {
    id: string; /* unique id generated automatically */
    data: {
        name: string; /* the name of the ingredient/meal */
        picture: string; /* path to the picture of the card */
        strength: number; /* base strength of the card (can cary for crafted cards) */
        diet: Diet; /* the maximum diet this card belongs to */
        parts: { name: string; from: string[] }[]; /* part of the meal and the corresponding cards that the part can be */
        partof: { nodeid: string; partid: string }[]; /* cards that can be crafted using this card */
    }
}
```

# Installation

Requirements: cou need to have `node` installed on your PC.

Download the repository, install the dependecies running

`npm install`

in the root folder. Start a local version by running

`npm start`

and use the link displayed in the console.

# Usage

You can add nodes by clicking and dragging from any handle (the black dots). You can delete nodes and edges by pressing `del` or `backspace`.

![How to add and delete nodes and edges.](/documentation/add-and-delete-nodes.gif)

You can edit the nodes freely and add/remove parts of the meal by pressing the add/minus buttons.

![How to modify nodes.](/documentation/modify-node.gif)

You can manipulate the view and store and load creations using the buttons on the bottom left.

![How to store and load](/documentation/control-buttons.png)
