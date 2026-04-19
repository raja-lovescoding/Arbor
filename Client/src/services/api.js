const API_BASE = "http://localhost:5000";

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

export const clearAuthToken = () => {
  authToken = null;
};

const buildHeaders = (headers = {}) => {
  if (!authToken) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${authToken}`,
  };
};

export const fetchConversations = async () => {
  const res = await fetch(`${API_BASE}/conversations`, {
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
};

export const createConversation = async (title = "New Chat") => {
  const res = await fetch(`${API_BASE}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error("Failed to create conversation");

  return res.json();
};

export const sendMessage = async (content, parentId, branchId, conversationId) => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify({ content, parentId, branchId, conversationId }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Failed to send message");
  }

  return res.json();
};

export const fetchMessages = async (conversationId) => {
  const res = await fetch(`${API_BASE}/chat?conversationId=${conversationId}`, {
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

export const createBranch = async (parentBranchId, lastMessageId, conversationId) => {
  const res = await fetch(`${API_BASE}/branches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify({ parentBranchId, lastMessageId, conversationId }),
  });

  if (!res.ok) throw new Error("Failed to create branch");

  return res.json();
};

export const fetchBranches = async (conversationId) => {
  const res = await fetch(`${API_BASE}/branches?conversationId=${conversationId}`, {
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
};

export const deleteBranch = async (branchId, conversationId) => {
  const res = await fetch(
    `${API_BASE}/branches/${branchId}?conversationId=${encodeURIComponent(conversationId)}`,
    {
      method: "DELETE",
      headers: buildHeaders(),
    }
  );

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Failed to delete branch");
  }

  return res.json();
};

export const deleteConversation = async (conversationId) => {
  const res = await fetch(`${API_BASE}/conversations/${conversationId}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Failed to delete conversation");
  }
  return res.json();
};

export const updateConversationTitle = async (conversationId, title) => {
  const res = await fetch(`${API_BASE}/conversations/${conversationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Failed to update conversation title");
  }
  return res.json();
};

export const updateBranchTitle = async (branchId, title, conversationId) => {
  const res = await fetch(`${API_BASE}/branches/${branchId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify({ title, conversationId }),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Failed to update branch title");
  }
  return res.json();
};
