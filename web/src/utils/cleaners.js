export const date = data => (new Date(data)).toLocaleDateString();

export const bool = data => (data === 'true' || data === true);
