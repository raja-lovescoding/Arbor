const DEFAULT_CONVERSATION_TITLE = "New Chat";
const DEFAULT_BRANCH_TITLE = "New Branch";
const MAX_TITLE_LENGTH = 48;

export const buildTitleFromContent = (content, fallback) => {
  const text = String(content || "").replace(/\s+/g, " ").trim();

  if (!text) {
    return fallback;
  }

  if (text.length <= MAX_TITLE_LENGTH) {
    return text;
  }

  return `${text.slice(0, MAX_TITLE_LENGTH - 3).trimEnd()}...`;
};

export const getConversationTitle = (content) =>
  buildTitleFromContent(content, DEFAULT_CONVERSATION_TITLE);

export const getBranchTitle = (content) =>
  buildTitleFromContent(content, DEFAULT_BRANCH_TITLE);

export const isDefaultConversationTitle = (title) =>
  !title || title === DEFAULT_CONVERSATION_TITLE;

export const isDefaultBranchTitle = (title) =>
  !title || title === DEFAULT_BRANCH_TITLE;
