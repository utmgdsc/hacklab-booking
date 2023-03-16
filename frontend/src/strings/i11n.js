export const useString = (key, ...args) => {
    const strings = useStrings();
    const string = strings[key];
    if (string) {
        return string.replace(/%d/g, () => args.shift());
    }
    return key;
}
