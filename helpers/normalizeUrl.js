export const normalizeUrl = (url) => {
    if (!url) return null;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};
