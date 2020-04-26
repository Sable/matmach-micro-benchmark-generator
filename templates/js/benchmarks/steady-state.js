// %imports

if(!performance){
	performance = {};
}else if(!performance.now){
    performance.now = Date.now;
}


async function runner(...args){
    let output = 0;
    // %init
	// %gc
    for(let i = 0;i<10;i++){
        // %pre
        // %content
        // %post
        // %gc
    }

    // %pre
    let start = performance.now();
    // %content
    let diff = performance.now();
    // %post
    // %gc
    let result = {
        input:JSON.stringify((args)),
        output:output,
        time:(diff - start)/1000
    };
    console.log(JSON.stringify(result));

}

module.exports = {runner};

// %runner_call