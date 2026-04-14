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

  const renderNode = (node, level = 1, isLast = false) => (
    <div
      key={node._id}
      className={`branch-node ${level === 1 ? "branch-node--root" : ""} ${isLast ? "branch-node--last" : ""}`}
      style={{ "--branch-level": level }}
    >
      <div
        onClick={() => onSelect(node._id)}
        className={`branch-item ${node._id === activeBranchId ? "is-active" : ""}`}
      >
        <span className="branch-title">{node.title || `Branch ${node._id.slice(-4)}`}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const ok = window.confirm("Delete this branch and its child branches?");
            if (!ok) return;
            if (onDeleteBranch) {
              onDeleteBranch(node._id);
            }
          }}
          className="branch-delete"
        >
          Delete
        </button>
      </div>

      {node.children.length > 0 ? (
        <div className="branch-children">
          {node.children.map((child, index) =>
            renderNode(child, level + 1, index === node.children.length - 1)
          )}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className="branch-sidebar"
      style={{
        ...style,
      }}
    >
      <h3>Branches</h3>
      {roots.map((root, index) => renderNode(root, 1, index === roots.length - 1))}
    </div>
  );
};

export default Sidebar;