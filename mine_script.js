
const fs = require('fs');
const vm = require('vm');

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 9000;

const proc = (file, callback) => {
	const context = {
		console,
		testQuery: function(cb) {
			return new Promise(r => setTimeout(() => r(cb(100501)), 2000));
		},
		testResult: function(result) {
			callback(result);  // cb from init
		}
	};

	context.global = context;
	const sandbox = vm.createContext(context);	
	
	fs.readFile(file, "utf8", (err, src) => { 
		let script;
		try {
			script = new vm.Script(src, {timeout: PARSING_TIMEOUT});
		} catch (e) {
			console.dir(e);
			console.log('Parsing timeout');
			process.exit(1);
		}

		try {
			script.runInNewContext(sandbox, { timeout: EXECUTION_TIMEOUT});
		} catch(e) {
			console.dir(e);
			console.log('Execution timeout');
			process.exit(1);
		}
	});
}

module.exports = proc;

