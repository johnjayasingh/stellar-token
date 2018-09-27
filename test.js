const asyncFunction = async () => {
    await new Promise((resolve) => {
        setTimeout(_ => {
            console.log('Im Resolved')
            resolve()
        }, 5000)
    })
}

const anotherAsyncFunction = async () => {
    await asyncFunction();
    console.log('Not now');
}

anotherAsyncFunction().then(_ => {
    console.log('Cool')
})