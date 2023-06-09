function filter(items, fn) {
    const res = []

    for(let i = 0; i < items.length; i++) {
        if(fn(items[i])) {
            res.push(items[i])
        }
    }

    return res
}
