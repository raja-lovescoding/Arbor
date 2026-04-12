const Sidebar = ({ branches, onSelect, activeBranchId, onDeleteBranch, style }) => {
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

  const renderNode = (node, level = 1) => (
    <div key={node._id}>
      <div
        onClick={() => onSelect(node._id)}
        style={{
          paddingLeft: `${level * 12}px`,
          paddingTop: "7px",
          paddingBottom: "7px",
          cursor: "pointer",
          background:
            node._id === activeBranchId ? "#e2e8f0" : "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          marginBottom: "5px",
          color: "#1f2937",
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
    <div
      style={{
        width: "250px",
        borderLeft: "1px solid #d7dce5",
        padding: "12px",
        boxSizing: "border-box",
        background: "#f3f4f6",
        overflow: "hidden",
        ...style,
      }}
    >
      <h3>Branches</h3>
      {roots.map((root) => renderNode(root))}
    </div>
  );
};

export default Sidebar;