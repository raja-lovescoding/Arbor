import { useState } from "react";

const Sidebar = ({ branches, onSelect, activeBranchId, onDeleteBranch, style }) => {
  const [openMenuBranchId, setOpenMenuBranchId] = useState(null);

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
        className={`branch-item ${node._id === activeBranchId ? "is-active" : ""} ${openMenuBranchId === node._id ? "is-menu-open" : ""}`}
      >
        <span className="branch-title">{node.title || `Branch ${node._id.slice(-4)}`}</span>
        <div className="branch-actions">
          <button
            type="button"
            className="branch-menu-trigger"
            aria-label="Branch actions"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuBranchId((prev) => (prev === node._id ? null : node._id));
            }}
          >
            <span className="menu-dot" />
            <span className="menu-dot" />
            <span className="menu-dot" />
          </button>

          {openMenuBranchId === node._id ? (
            <div className="actions-menu-card" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const ok = window.confirm("Delete this branch and its child branches?");
                  if (!ok) return;
                  if (onDeleteBranch) {
                    onDeleteBranch(node._id);
                  }
                  setOpenMenuBranchId(null);
                }}
                className="branch-delete"
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
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