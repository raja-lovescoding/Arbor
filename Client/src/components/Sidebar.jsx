import { getBranches } from "../utils/getBranches";

const Sidebar = ({ branches, onSelect, activeBranchId }) => {
  const map = {};
  const roots = [];

  branches.forEach((b) => {
    map[b._id] = { ...b, children: [] };
  });

  branches.forEach((b) => {
    if (b.parentBranchId) {
      map[b.parentBranchId]?.children.push(map[b._id]);
    } else {
      roots.push(map[b._id]);
    }
  });

  const renderNode = (node, level = 0) => (
    <div key={node._id}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: `${level * 12}px`,
          cursor: "pointer",
          background:
            node._id === activeBranchId ? "#ddd" : "transparent",
        }}
        onClick={() => onSelect(node._id)}
      >
        Branch
      </div>

      {node.children.map((child) =>
        renderNode(child, level + 1)
      )}
    </div>
  );

  return <div>{roots.map(renderNode)}</div>;
};

export default Sidebar;