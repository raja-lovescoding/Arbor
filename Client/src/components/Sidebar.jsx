const Sidebar = ({ branches, onSelect, activeBranchId, onDeleteBranch }) => {
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
        onClick={() => onSelect(node._id)}
        style={{
          paddingLeft: `${level * 12}px`,
          cursor: "pointer",
          background:
            node._id === activeBranchId ? "#ddd" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span>{node.title || `Branch ${node._id.slice(-4)}`}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const ok = window.confirm("Delete this branch and its child branches?");
            if (!ok) return;
            if (onDeleteBranch) {
              onDeleteBranch(node._id);
            }
          }}
          style={{ fontSize: "12px" }}
        >
          Delete
        </button>
      </div>

      {node.children.length > 0 &&
        node.children.map((child) =>
          renderNode(child, level + 1)
        )}
    </div>
  );

  return (
    <div style={{ width: "250px", borderLeft: "1px solid #ccc" }}>
      <h3>Branches</h3>
      {roots.map((root) => renderNode(root))}
    </div>
  );
};

export default Sidebar;