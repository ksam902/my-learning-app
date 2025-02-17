export const formatDate = (date: string | null): string => {
  if (!date) return 'No date set';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}; 