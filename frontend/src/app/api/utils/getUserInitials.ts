export const getUserInitials = (fullName?: string): string => {
  if (!fullName || fullName.trim() === "") return "U";

  return fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
