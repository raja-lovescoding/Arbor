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
          style={{
            padding: "9px",
            cursor: "pointer",
            borderRadius: "6px",
            background:
              conversation._id === activeConversationId ? "#e2e8f0" : "#f8fafc",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            border: "1px solid #e5e7eb",
            color: "#1f2937",
          }}
        >
          {conversation.title || "New Chat"}
          <button
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
              marginLeft: "8px",
              fontSize: "12px",
              color: "crimson",
              border: "none",
              background: "transparent",
              cursor: "pointer",
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