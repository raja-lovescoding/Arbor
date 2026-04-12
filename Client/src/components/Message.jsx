import { createBranch } from "../services/api";

const renderInlineMarkdown = (text, keyPrefix) => {
  const value = String(text || "");
  const parts = value.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, idx) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);

    if (boldMatch) {
      return <strong key={`${keyPrefix}-b-${idx}`}>{boldMatch[1]}</strong>;
    }

    return <span key={`${keyPrefix}-t-${idx}`}>{part}</span>;
  });
};

const renderHeadingLine = (line, key) => {
  const match = line.match(/^(#{1,6})\s+(.*)$/);

  if (!match) {
    return null;
  }

  const level = match[1].length;
  const text = match[2];
  const fontSizeMap = {
    1: "1.55rem",
    2: "1.35rem",
    3: "1.2rem",
    4: "1.1rem",
    5: "1rem",
    6: "0.95rem",
  };

  return (
    <div
      key={key}
      style={{
        margin: "4px 0 8px",
        fontWeight: 700,
        fontSize: fontSizeMap[level],
        lineHeight: 1.35,
      }}
    >
      {renderInlineMarkdown(text, key)}
    </div>
  );
};

const renderPlainTextBlock = (text) => {
  const lines = String(text || "").split("\n");
  const nodes = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} style={{ margin: "6px 0 10px", paddingLeft: "20px" }}>
        {bulletBuffer.map((item, idx) => (
          <li key={`li-${idx}`} style={{ marginBottom: "4px" }}>
            {renderInlineMarkdown(item, `li-${idx}`)}
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  lines.forEach((line) => {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/);

    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1]);
      return;
    }

    flushBullets();

    if (!line.trim()) {
      nodes.push(<div key={`sp-${nodes.length}`} style={{ height: "8px" }} />);
      return;
    }

    const headingNode = renderHeadingLine(line.trim(), `h-${nodes.length}`);

    if (headingNode) {
      nodes.push(headingNode);
      return;
    }

    nodes.push(
      <p key={`p-${nodes.length}`} style={{ margin: "0 0 8px", whiteSpace: "pre-wrap" }}>
        {renderInlineMarkdown(line, `p-${nodes.length}`)}
      </p>
    );
  });

  flushBullets();
  return nodes;
};

const renderFormattedContent = (content) => {
  const parts = String(content || "").split(/```/);

  return parts.map((part, idx) => {
    const isCode = idx % 2 === 1;

    if (isCode) {
      return (
        <pre
          key={`code-${idx}`}
          style={{
            margin: "8px 0 10px",
            padding: "10px",
            background: "#0f172a",
            color: "#e2e8f0",
            borderRadius: "8px",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          <code>{part.trim()}</code>
        </pre>
      );
    }

    return <div key={`txt-${idx}`}>{renderPlainTextBlock(part)}</div>;
  });
};

const Message = ({
  msg,
  isActive,
  activeBranchId,
  activeConversationId,
  onBranchCreate,
}) => {
  return (
    <div
      style={{
        margin: "10px 0",
        padding: "12px",
        border: isActive ? "2px solid #2563eb" : "1px solid #cbd5e1",
        borderRadius: "10px",
        background: msg.role === "assistant" ? "#f8fafc" : "#ffffff",
        cursor: "default",
      }}
    >
      <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
      <div
        style={{
          marginTop: "8px",
          lineHeight: 1.5,
          color: "#0f172a",
          wordBreak: "break-word",
        }}
      >
        {renderFormattedContent(msg.content)}
      </div>

      <button
        onClick={async (e) => {
          e.stopPropagation();
          const newBranch = await createBranch(
            activeBranchId || null,
            msg._id,
            activeConversationId
          );

          if (onBranchCreate) {
            onBranchCreate(newBranch); // pass up
          }
        }}
        style={{
          marginTop: "10px",
          padding: "6px 12px",
          border: "1px solid #cbd5e1",
          background: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        New Branch
      </button>
    </div>
  );
};
export default Message;