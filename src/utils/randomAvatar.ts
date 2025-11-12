export const randomAvatar = () => {
  const seed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}&backgroundColor=ffdfbf`;
};
