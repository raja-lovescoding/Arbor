const ConversationSidebar = ({
  conversations,
  activeConversationId,
  onSelect,
  onCreate,
  onDeleteConversation,
  style,
}) => {
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
          className="conversation-item"
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
          <button
            type="button"
            className="conversation-delete"
            onClick={(e) => {
              e.stopPropagation();
              const ok = window.confirm("Delete this conversation?");
              if (!ok) {
                return;
              }
              if(onDeleteConversation) {
                onDeleteConversation(conversation._id);
              }
            }}
            style={{
              fontSize: "12px",
              color: "crimson",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Delete
          </button>

        </div>
      ))}
    </div>
  );
};

export default ConversationSidebar;