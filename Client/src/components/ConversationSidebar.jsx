import { useState } from "react";
import { updateConversationTitle } from "../services/api";

const ConversationSidebar = ({
  conversations,
  activeConversationId,
  onSelect,
  onCreate,
  onDeleteConversation,
  onUpdateConversation,
  style,
}) => {
  const [openMenuConversationId, setOpenMenuConversationId] = useState(null);
  const [renamingConversationId, setRenamingConversationId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const handleRenameClick = (conversation) => {
    setRenamingConversationId(conversation._id);
    setRenameValue(conversation.title || "New Chat");
  };

  const handleRenameSave = async (conversationId) => {
    if (!renameValue.trim()) {
      setRenamingConversationId(null);
      return;
    }
    try {
      const updated = await updateConversationTitle(conversationId, renameValue);
      if (onUpdateConversation) {
        onUpdateConversation(updated);
      }
      setRenamingConversationId(null);
      setOpenMenuConversationId(null);
    } catch (err) {
      alert(err.message || "Failed to rename conversation");
    }
  };

  const handleRenameKeyDown = (e, conversationId) => {
    if (e.key === "Enter") {
      handleRenameSave(conversationId);
    } else if (e.key === "Escape") {
      setRenamingConversationId(null);
    }
  };

  return (
    <div
      style={{
        width: "240px",
        borderRight: "1px solid #d7dce5",
        padding: "12px",
        background: "#f3f4f6",
        overflowY: "auto",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Chats</h3>
        <button
          onClick={onCreate}
          style={{
            border: "1px solid #c8ced9",
            background: "#fff",
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          + New Chat
        </button>
      </div>

      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          onClick={() => {
            if (renamingConversationId !== conversation._id) {
              onSelect(conversation._id);
            }
          }}
          className={`conversation-item ${openMenuConversationId === conversation._id ? "is-menu-open" : ""}`}
          style={{
            padding: "9px",
            cursor: "pointer",
            borderRadius: "6px",
            background:
              conversation._id === activeConversationId ? "#e2e8f0" : "#f8fafc",
            marginBottom: "4px",
            border: "1px solid #e5e7eb",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {renamingConversationId === conversation._id ? (
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => handleRenameKeyDown(e, conversation._id)}
              onBlur={() => handleRenameSave(conversation._id)}
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                padding: "4px 6px",
                border: "1px solid #2563eb",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          ) : (
            <span
              style={{
                minWidth: 0,
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {conversation.title || "New Chat"}
            </span>
          )}
          <div className="conversation-actions">
            <button
              type="button"
              className="conversation-menu-trigger"
              aria-label="Conversation actions"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuConversationId((prev) =>
                  prev === conversation._id ? null : conversation._id
                );
              }}
            >
              <span className="menu-dot" />
              <span className="menu-dot" />
              <span className="menu-dot" />
            </button>

            {openMenuConversationId === conversation._id ? (
              <div className="actions-menu-card" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="conversation-rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameClick(conversation);
                  }}
                  style={{
                    display: "inline-flex",
                    border: "none",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    marginBottom: "6px",
                    fontSize: "12px",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="conversation-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    const ok = window.confirm("Delete this conversation?");
                    if (!ok) {
                      return;
                    }
                    if (onDeleteConversation) {
                      onDeleteConversation(conversation._id);
                    }
                    setOpenMenuConversationId(null);
                  }}
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>

        </div>
      ))}
    </div>
  );
};

export default ConversationSidebar;