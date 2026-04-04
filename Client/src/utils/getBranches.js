export const getBranches = (messages) => {
  const parentSet = new Set();

  messages.forEach((msg) => {
    if (msg.parentId) {
      parentSet.add(msg.parentId);
    }
  });

  // leaf = not a parent of any message
  return messages.filter((msg) => !parentSet.has(msg._id));
};