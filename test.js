
(async function fe() {
	let a = 11;
	let b = await testQuery((input) => 5 + input);
	testResult(a + b);
})();




