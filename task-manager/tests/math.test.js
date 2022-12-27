test('Hello, World!!!', () => {
    // assertion
    expect(12).toBe(12)
})

// first way to test ASYNC calls
test('Async Testing', (done) => {
    setTimeout(() => {
        expect(12).toBe(12)
        done()
    }, 2000);
})

// second way to test ASYNC calls
// test('Async Testing', async () => {
    // const sum = await new xyz()
    // expect(sum).toBe(sum);
// })

// test('Failure', () => {
//     throw new Error();
// })