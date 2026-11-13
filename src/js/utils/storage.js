export const save = (key, item) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`vcds.${key}`, JSON.stringify(item));
    }
};

export const load = (key, defaultValue) => {
    if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(`vcds.${key}`);

        if (item) {
            return JSON.parse(item);
        }
    }

    return defaultValue;
};
