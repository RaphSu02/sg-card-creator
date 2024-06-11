import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Handle, NodeProps, Position, useNodeId } from "reactflow";

import "./card-node.css";
import useStore, { CardNodeData } from "./store";

export default function CardNode({ data }: NodeProps<CardNodeData>) {
  const nodeId = useNodeId();
  const updateName = useStore((state) => state.updateCardName);
  const updateStrength = useStore((state) => state.updateCardStrength);
  const addPart = useStore((state) => state.addCardPart);
  const updatePartName = useStore((state) => state.updateCardPartName);
  const removeLastPart = useStore((state) => state.removeLastCardPart);

  return (
    <div className="card-node">
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor={`${nodeId}-name`}>Name:</label>
            </td>
            <td>
              <input
                id={`${nodeId}-name`}
                type="text"
                defaultValue={data.name}
                onChange={(evt) => updateName(nodeId, evt.target.value)}
                className="nodrag"
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor={`${nodeId}-strength`}>Strength:</label>
            </td>
            <td>
              <input
                id={`${nodeId}-strength`}
                type="number"
                defaultValue={data.strength}
                onChange={(evt) =>
                  updateStrength(nodeId, parseInt(evt.target.value, 10))
                }
                className="nodrag"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          padding: 2,
          paddingTop: 6,
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gridTemplateRows: `repeat(${data.parts.length}, auto)`,
          gridAutoFlow: "column",
          rowGap: 8,
        }}
      >
        {data.parts.map((_, index: number) => (
          <Handle
            key={index}
            type="target"
            position={Position.Left}
            style={{ position: "relative" }}
            id={`${index}`}
          />
        ))}
        {data.parts.map(
          (
            part: { name: string | number | readonly string[] | undefined },
            index: number,
          ) => (
            <input
              key={index}
              id={`${nodeId}-part-label-${index}`}
              type="text"
              title="Recipe Part"
              defaultValue={part.name}
              onChange={(evt) =>
                updatePartName(nodeId, index, evt.target.value)
              }
              className="nodrag"
              style={{ marginLeft: -6 }}
            />
          ),
        )}
      </div>

      <div className="add-remove-buttons">
        <button
          title="Add Recipe Part"
          onClick={(evt) => addPart(nodeId, "")}
          className="add-button"
        >
          <FontAwesomeIcon icon={fas.faCirclePlus} className="nodrag" />
        </button>

        <button
          title="Remove Last Recipe Part"
          onClick={() => removeLastPart(nodeId)}
          className="remove-button"
        >
          <FontAwesomeIcon icon={fas.faCircleMinus} className="nodrag" />
        </button>
      </div>

      <Handle type="source" position={Position.Right} id="card" />
    </div>
  );
}
