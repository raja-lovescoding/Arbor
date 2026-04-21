const InputBox = ({ value, onChange, onSend, onSendButton }) => {
  const input = value || "";

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="Input-box">
      <input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="Input-box-field"
      />
      <button
        onClick={() => {
          if (typeof onSendButton === "function") {
            onSendButton();
          }
          handleSend();
        }}
        className="Send-message"
      >
        <img className="send-icon" src="/QT%20icons/send.png" alt="" />
      </button>
    </div>
  );
};

export default InputBox;