export const getPath = (messages, activeId) => {
  const map = {};
  messages.forEach((msg) => {
    map[msg._id] = msg;
  });

  let path = [];
  let current = map[activeId];

  while (current) {
    path.push(current);
    current = current.parentId ? map[current.parentId] : null;
  }

  return path.reverse();
};