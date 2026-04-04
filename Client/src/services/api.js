const API_BASE = "http://localhost:5000";

export const sendMessage = async (content, parentId) => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, parentId }),
  });

  return res.json();
};

export const fetchMessages = async () => {
  const res = await fetch(`${API_BASE}/chat`);
  return res.json();
};

export const createBranch = async (parentBranchId, lastMessageId) => {
  const res = await fetch(`${API_BASE}/branches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parentBranchId, lastMessageId }),
  });

  return res.json();
};

export const fetchBranches = async () => {
  const res = await fetch(`${API_BASE}/branches`);
  return res.json();
};