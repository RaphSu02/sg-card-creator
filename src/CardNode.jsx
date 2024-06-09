import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

function CardNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="card-node">
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="name">Name:</label>
            </td>
            <td>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={data.name}
                className="nodrag"
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="strength">Strength:</label>
            </td>
            <td>
              <input
                id="strength"
                type="number"
                defaultValue={data.strength}
                onChange={onChange}
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
        {data.parts.map((part, index) => (
          <Handle
            key={index}
            type="target"
            position={Position.Left}
            style={{ position: "relative" }}
            id={`part-${index}`}
            isConnectable={isConnectable}
          />
        ))}
        {data.parts.map((part, index) => (
          <input
            key={index}
            id={`part-label-${index}`}
            type="text"
            title="Recipe Part"
            defaultValue={part.name}
            className="nodrag"
            style={{ marginLeft: -6 }}
          />
        ))}
        {data.parts.map((part, index) => (
          <button
            key={index}
            title="Remove Recipe Part"
            className="remove-button"
          >
            <FontAwesomeIcon icon={fas.faCircleMinus} className="nodrag" />
          </button>
        ))}
      </div>

      <div className="add-button">
        <button title="Add Recipe Part">
          <FontAwesomeIcon icon={fas.faCirclePlus} className="nodrag" />
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="card"
        isConnectable={isConnectable}
      />
    </div>
  );
}

CardNode.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    strength: PropTypes.number.isRequired,
    parts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  isConnectable: PropTypes.bool.isRequired,
};

export default CardNode;
