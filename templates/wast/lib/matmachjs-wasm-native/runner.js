const wasmlib = require("./matmachjs-lib");
const { module_wasm } = require("./runner-wasm");
async function runner(...args){
    let module = await WebAssembly.instantiate(hexStringByteArray(module_wasm),wasmlib);
    let exports = module.instance.exports;
	// %gc
    let total_time = exports.runner(...args);
    let result = {
        input:JSON.stringify((args)),
        output:0,
        time: total_time
    };
    console.log(JSON.stringify(result));
};

function hexStringByteArray(str){
    let a = [];
    for (let i = 0, len = str.length; i < len; i+=2) {
        a.push(parseInt(str.substr(i,2),16));
    }
  return new Uint8Array(a);
}
module.exports = { runner };
// %runner_call