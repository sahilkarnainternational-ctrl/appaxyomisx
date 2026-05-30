const cache = new Map();
export const getCache = (key) => {
    return cache.get(key);
};
export const setCache = (key, value) => {
    cache.set(key, value);
};
