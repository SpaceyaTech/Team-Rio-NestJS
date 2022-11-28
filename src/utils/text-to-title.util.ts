export const textToTitle = (text: string) => {
  const capitalized = [];
  text.split(' ').forEach((word) => {
    capitalized.push(
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
  });

  return capitalized.join(' ');
};
