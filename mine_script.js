
const fs = require('fs');
const vm = require('vm');

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 9000;

const proc = (file, callback) => {
	console.log(`hello from vm. filename is ${file}`);

	const context = {
		console,
		testQuery: function(cb) {
			setTimeout(function() {console.log(cb(100500)); }, 2000);
		},

		testResult: function(result) {
			callback(result);  // cb from init
		},
		require: name => {
			if (name === 'fs') {
				console.log("module fs is restricted");
				return null;
			}
			return require(name);
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

	typeof(callback) === 'function' && callback();
}

module.exports = proc;

