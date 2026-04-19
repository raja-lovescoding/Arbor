import { useState } from "react";

const ConversationSidebar = ({
  conversations,
  activeConversationId,
  onSelect,
  onCreate,
  onDeleteConversation,
  style,
}) => {
  const [openMenuConversationId, setOpenMenuConversationId] = useState(null);

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
          onClick={() => onSelect(conversation._id)}
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