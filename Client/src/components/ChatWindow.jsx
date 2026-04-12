import { useState } from "react";
import Message from "./Message";
import InputBox from "./InputBox";
import {
  createConversation,
  deleteBranch,
  deleteConversation,
  fetchBranches,
  fetchConversations,
  fetchMessages,
  sendMessage,
} from "../services/api";
import { getPath } from "../utils/getpath";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import ConversationSidebar from "./ConversationSidebar";

const ChatWindow = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [activeBranchId, setActiveBranchId] = useState(null);
  const [error, setError] = useState("");
  const [isAIloading, setIsAILoading] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      const conversationData = await fetchConversations();
      const safeConversations = Array.isArray(conversationData)
        ? conversationData
        : [];

      setConversations(safeConversations);

      if (safeConversations.length > 0) {
        setActiveConversationId(safeConversations[0]._id);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    const loadConversationData = async () => {
      if (!activeConversationId) {
        setMessages([]);
        setBranches([]);
        setActiveBranchId(null);
        setActiveNodeId(null);
        return;
      }

      const [branchData, messageData] = await Promise.all([
        fetchBranches(activeConversationId),
        fetchMessages(activeConversationId),
      ]);

      const safeBranches = Array.isArray(branchData) ? branchData : [];
      const safeMessages = Array.isArray(messageData) ? messageData : [];

      setBranches(safeBranches);
      setMessages(safeMessages);

      if (safeBranches.length > 0) {
        const latestBranch = safeBranches[safeBranches.length - 1];
        setActiveBranchId(latestBranch._id);
        setActiveNodeId(latestBranch.lastMessageId || null);
        return;
      }

      setActiveBranchId(null);
      setActiveNodeId(safeMessages.length > 0 ? safeMessages[safeMessages.length - 1]._id : null);
    };

    loadConversationData();
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeBranchId) return;

    const branch = branches.find((b) => b._id === activeBranchId);

    if (branch) {
      setActiveNodeId(branch.lastMessageId);
    }
  }, [activeBranchId, branches]);

  const handleCreateConversation = async () => {
    try {
      const conversation = await createConversation();
      if (!conversation?._id) {
        return;
      }

      setConversations((prev) => [conversation, ...prev]);
      setActiveConversationId(conversation._id);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create conversation");
    }
  };

  const handleSend = async (text) => {
    if (!activeConversationId) {
      return;
    }

    const currentActiveNodeId = activeNodeId;

    const tempUserMessage = {
      _id: `temp-user-${Date.now()}`,
      role: "user",
      content: text,
      parentId: currentActiveNodeId || null,
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setActiveNodeId(tempUserMessage._id);
    setIsAILoading(true);
    setError("");

    try {
      const data = await sendMessage(
        text,
        currentActiveNodeId,
        activeBranchId,
        activeConversationId
      );

      setMessages((prev) => {
        const withoutTemp = prev.filter((msg) => msg._id !== tempUserMessage._id);
        return [...withoutTemp, data.user, data.assistant];
      });
      setActiveNodeId(data.assistant._id);

      if (data.branch?._id) {
        setActiveBranchId(data.branch._id);
        setBranches((prev) => {
          const hasExisting = prev.some((b) => b._id === data.branch._id);

          if (hasExisting) {
            return prev.map((b) =>
              b._id === data.branch._id ? { ...b, ...data.branch } : b
            );
          }

          return [...prev, data.branch];
        });
      }

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === activeConversationId
            ? { ...conversation, lastMessageId: data.assistant._id }
            : conversation
        )
      );
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!activeConversationId) {
      return;
    }

    try {
      const result = await deleteBranch(branchId, activeConversationId);
      const deletedIdSet = new Set((result?.deletedIds || []).map((id) => String(id)));
      const remainingBranches = branches.filter(
        (branch) => !deletedIdSet.has(String(branch._id))
      );

      setBranches(remainingBranches);

      if (deletedIdSet.has(String(activeBranchId))) {
        if (remainingBranches.length > 0) {
          const nextActiveBranch = remainingBranches[remainingBranches.length - 1];
          setActiveBranchId(nextActiveBranch._id);
          setActiveNodeId(nextActiveBranch.lastMessageId || null);
        } else {
          setActiveBranchId(null);
          setActiveNodeId(messages.length > 0 ? messages[messages.length - 1]._id : null);
        }
      }

      setError("");
    } catch (err) {
      setError(err.message || "Failed to delete branch");
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await deleteConversation(conversationId);
      const newConversations = conversations.filter(
        (c) => c._id !== conversationId
      );
      setConversations(newConversations);

      if (activeConversationId === conversationId) {
        if (newConversations.length > 0) {
          const deletedIndex = conversations.findIndex(
            (c) => c._id === conversationId
          );
          const newActiveIndex = Math.max(0, deletedIndex - 1);
          setActiveConversationId(newConversations[newActiveIndex]._id);
        } else {
          setActiveConversationId(null);
        }
      }
      setError("");
    } catch (err) {
      setError(err.message || "Failed to delete conversation");
    }
  };

  const visibleMessages = activeNodeId ? getPath(messages, activeNodeId) : messages;

  return (
    <div style={{ display: "flex" }}>
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelect={setActiveConversationId}
        onCreate={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div style={{ flex: 1, padding: "20px" }}>
        <h2>ConceptTree Chat</h2>
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

        <div>
          {visibleMessages.map((msg) => (
            <Message
              key={msg._id}
              msg={msg}
              onSelect={setActiveNodeId}
              isActive={msg._id === activeNodeId}
              activeBranchId={activeBranchId}
              activeConversationId={activeConversationId}
              onBranchCreate={(branch) => {
                setBranches((prev) => [...prev, branch]);
                setActiveBranchId(branch._id);
                setActiveNodeId(branch.lastMessageId);
              }}
            />
          ))}
          {isAIloading ? (
            <div
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid gray",
                fontStyle: "italic",
                color: "#555",
              }}
            >
              Loading respoinse...
            </div>
          ) : null}
        </div>

        <InputBox onSend={handleSend} />
      </div>

      <Sidebar
        branches={branches}
        onSelect={setActiveBranchId}
        activeBranchId={activeBranchId}
        onDeleteBranch={handleDeleteBranch}
      />
    </div>
  );
};

export default ChatWindow;