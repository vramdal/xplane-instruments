let symbol = new Symbol("OverriddenFunctions");

export function storeOverriddenFunc(obj, funcName, replacement) {
    obj[symbol] = Object.assign({}, obj[symbol], {[ funcName ]: obj.funcName});
    return replacement;
}

export function restoreOverriddenFunc(obj, funcName) {
    if (!obj[symbol] || !obj[symbol][funcName]) {
        return obj[funcName];
    }
    let original = obj[symbol][funcName];
    delete obj[symbol][funcName];
    return original;
}