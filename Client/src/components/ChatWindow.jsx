import { useState } from "react";
import Message from "./Message";
import InputBox from "./InputBox";
import { fetchBranches, fetchMessages, sendMessage } from "../services/api";
import { getPath } from "../utils/getpath";
import { useEffect } from "react";
import Sidebar from "./Sidebar";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [activeBranchId, setActiveBranchId] = useState(null);
  useEffect(() => {
  const loadBranches = async () => {
    const data = await fetchBranches();
    setBranches(data);

    if (data.length > 0) {
      setActiveBranchId(data[0]._id);
    }
  };

  loadBranches();
}, []);
  useEffect(() => {
  const loadMessages = async () => {
    const data = await fetchMessages();
    setMessages(data);

    if (data.length > 0) {
      setActiveNodeId(data[data.length - 1]._id);
    }
  };

  loadMessages();
}, []);

  const handleSend = async (text) => {
    const data = await sendMessage(text, activeNodeId);

    const newMessages = [
      ...messages,
      data.user,
      data.assistant,
    ];

    setMessages(newMessages);

    // move active node to latest AI message
    setActiveNodeId(data.assistant._id);
  };

const visibleMessages = activeNodeId
  ? getPath(messages, activeNodeId)
  : messages;

  return (
    <div style={{ padding: "20px" }}>
      <h2>ConceptTree Chat</h2>
    <Sidebar
      branches={branches}
      onSelect={setActiveBranchId}
      activeBranchId={activeBranchId}
    />
    <div>
      {visibleMessages.map((msg) => (
      <Message
        key={msg._id}
        msg={msg}
        onSelect={setActiveNodeId}
        isActive={msg._id === activeNodeId}
        activeBranchId={activeBranchId}
        onBranchCreate={(branch) => {
        setBranches((prev) => [...prev, branch]);
        setActiveBranchId(branch._id);
        setActiveNodeId(branch.lastMessageId);
        }}
      />
      ))}
    </div>

      <InputBox onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;