// %imports

async function runner(...args){
    let output = 0;
    // %init
	// %gc
    // %pre
    let start = performance.now();
    // %content
    let diff = performance.now();
    // %post
	// %gc
    let result = {
        input:JSON.stringify((args)),
        output:output,
        time: (diff - start)/1000
    };
    console.log(JSON.stringify(result));
}

module.exports = {runner};
// %runner_call