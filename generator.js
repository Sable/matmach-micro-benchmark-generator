#!/usr/bin/env node
var argv = require('yargs')
    .usage('Usage: $0 -o [output file] -p [path to wasm file]')
    .alias("n","gen-native")
    .boolean("n")
    .describe("n","Whether to generate native calls or wasm interface calls")
    .argv;
const shelljs = require("shelljs");
const fs = require("fs");
// Object with experiment specification
const {benchmark_categories,  language_metadata} = require("./matmach_test");
const experiment_default_setup = {
    "iteration": 10,
    "input-size":"medium"
};
const iteration = 10;
const experiment_input_size = "medium";
// Copy latest version of library
// Set up
let matmach_native_libfolder = "./templates/js/lib/matmachjs-native/matmachjs";
let matmach_interface_libfolder = "./templates/js/lib/matmachjs-interface/matmachjs";
let matmach_wasm_native_libfolder = "./templates/wast/lib/matmachjs-wasm-native";
if(shelljs.test("-d",matmach_interface_libfolder))
    shelljs.rm("-r",matmach_interface_libfolder);
if(shelljs.test("-d",matmach_native_libfolder))
    shelljs.rm("-r", matmach_native_libfolder);
shelljs.cp("-r","./../../bin",matmach_native_libfolder);
shelljs.cp("-r","./../../bin",matmach_interface_libfolder);
shelljs.cp("-r","./../../src/wast/matmachjs.wat",matmach_wasm_native_libfolder);
shelljs.cp("-r","./../../bin/matmachjs-lib.js",matmach_wasm_native_libfolder);

const benchmark_json = fs.readFileSync("./templates/benchmark.json").toString();
const implementation_json = fs.readFileSync("./templates/implementation.json").toString();
// const experiment_benchmark_folder = "./experiment";
const experiment_benchmark_folder =
    `/Users/davidherrera/Documents/Research/Thesis/code/wu-wei-benchmarking-toolkit/benchmarks`;
// Go through each shape constructor and create wu-wei benchmark
Object.keys(benchmark_categories).forEach((benchmark_category)=>{
    let benchmark_desc = benchmark_categories[benchmark_category];
    benchmark_desc.benchmarks.forEach((benchmark_name) => {
        if( benchmark_desc.implementations && benchmark_desc.implementations.length > 0){
            benchmark_desc.implementations.forEach((impl)=>{
            if(!impl.include || impl.include.includes(benchmark_name)){
                const language_templates = language_metadata[impl.language].templates;// Templates library to use
                const language_comments = language_metadata[impl.language].comments;
                language_templates.forEach(({template_name, template_string, path_to_lib})=>{
            let benchmark_templated_name = `${benchmark_name}_${template_name}`; 
            // Create Benchmark
            let benchmark_folder = `${experiment_benchmark_folder}/${benchmark_templated_name}`;
            let benchmark_impl_folder = `${experiment_benchmark_folder}/${benchmark_templated_name}/implementations`;
            if(!shelljs.test("-d", benchmark_folder))
                shelljs.mkdir(benchmark_folder);
            if(!shelljs.test("-d", benchmark_impl_folder))
                shelljs.mkdir(benchmark_impl_folder);

            // Saves wu-wei benchmark.json file
            processBenchmarkJSONFile(experiment_benchmark_folder,benchmark_category,
                            benchmark_templated_name,benchmark_desc);

            // Iterate through implementations
           
                        const function_name =
                            (impl.hasOwnProperty("function_names")
                                &&impl.function_names.hasOwnProperty(benchmark_name))
                                ?impl.function_names[benchmark_name]:benchmark_name;
                        let implementation_folder = `${benchmark_impl_folder}/${impl.library}`;
                        processWuWeiImplementationJsonAndSupportFiles(benchmark_desc, implementation_folder,
                            benchmark_templated_name, impl, template_name, path_to_lib,
                            (impl.function_names&&impl.function_names[benchmark_name])?impl.function_names[benchmark_name]:benchmark_name);
                        processBenchmarkImplementationCode(implementation_folder,
                            template_string, language_comments, function_name, impl);

                    });
                }

            });
        }

    });
});


/**
 *
 * @param type
 * @param name
 * @param benchmark
 * @returns {string}
 */
function processBenchmarkJSONFile(experiment_benchmark_folder, benchmark_category, benchmark_name, benchmark_desc){
    let bench_json = benchmark_json.replace(/%name/g,benchmark_name);
    bench_json = bench_json.replace("%description",`MatmachJS ${benchmark_name}() ${benchmark_category} micro-benchmark`);
    // Benchmark Arguments
    bench_json = bench_json.replace("%small",JSON.stringify(benchmark_desc.inputs.small));
    bench_json = bench_json.replace("%medium",JSON.stringify(benchmark_desc.inputs.medium));
    bench_json = bench_json.replace("%large",JSON.stringify(benchmark_desc.inputs.large));

    // Copy Outputs
    bench_json = bench_json.replace("%small_output",benchmark_desc.expected_output.small);
    bench_json = bench_json.replace("%medium_output",benchmark_desc.expected_output.medium);
    bench_json = bench_json.replace("%large_output",benchmark_desc.expected_output.large);
    fs.writeFileSync(`${experiment_benchmark_folder}/${benchmark_name}/benchmark.json`, bench_json);
    return bench_json;
}

function createFileString(core_files){
    if(typeof core_files === "undefined") return "";
    return core_files.reduce((acc,file,i)=>{
        acc+= `{"file":"./${file}"}${(i!==core_files.length-1)?",":""}\n`;
        return acc;
    },"");
}

/**
 * Given a string code program, a comment_string, a variable to replace, and the replacement
 * statements, it replaces every variable by the statements while respecting tabs
 * @param original Original string
 * @param comment_string Comment string for language
 * @param variable
 * @param replacementArray
 * @returns {*}
 */
function replaceVariable(original,comment_string, variable, replacementArray){
    let var_replace = comment_string+" "+variable;
    let reg = new RegExp("[ ]*"+var_replace,"g");
    let reg_single = new RegExp("[ ]*"+var_replace);
    let var_rep_reg = new RegExp(var_replace, "g");
    let res = original;
    let reg_spaces = reg.exec(res);
    while(reg_spaces!==null){
        let spaces = reg_spaces[0].replace(var_rep_reg, "");
        let statement_string = replacementArray.reduce((acc, item)=>acc+=`${spaces}${item}\n`,"");
        res = res.replace(reg_single,statement_string);
        reg_spaces = reg.exec(res);
        if(reg_spaces!== null)spaces = reg_spaces[0].replace(var_rep_reg, "");
    }
    return res;
}


/**
 * Creates implementation.json file for benchmark
 * @param benchmark_folder Location where the actual benchmark implementation will be saved
 * @param benchmark_name Name for benchmark
 * @param impl Implementation specification for benchmark
 * @param template_name Given template name for language
 * @param path_to_lib Path to libraries of template name
 */
function processWuWeiImplementationJsonAndSupportFiles(benchmark_desc, implementation_folder, benchmark_name, impl, template_name, path_to_lib, function_name) {
    shelljs.rm("-rf", implementation_folder);
    shelljs.mkdir(implementation_folder); // Create benchmark folder
    const library_folder = `${path_to_lib}/${impl.library}/`;
    if(shelljs.test("-d",library_folder)) 
        shelljs.cp("-r",`${library_folder}/*`,`${implementation_folder}`); // Copy libraries
    let impl_json = implementation_json.replace(/\/\/ %runner-arguments/g,buildRunnerArgumentsJSON(benchmark_desc.inputs)); 
    impl_json = impl_json.replace(/\/\/ %libs/g,createFileString(shelljs.ls(library_folder)));
    impl_json = impl_json.replace(/%name/g, `${impl.library}`);
    impl_json = impl_json.replace(/%description/g,
        `${impl.library} function ${function_name}(), measuring ${template_name}`);
    impl_json = impl_json.replace(/%language/g, impl.language);
    impl_json = impl_json.replace(/\/\/ %core_files/g, createFileString(impl.core_files));
    fs.writeFileSync(`${implementation_folder}/implementation.json`,impl_json);
}
/**
 * Builds wu-weis runner-arguments
 * @param {JSON} inputs 
 */
function buildRunnerArgumentsJSON(inputs){
    let res_runner_args = [];
    if(typeof inputs.small === "object" ){
        for( parameter_key in inputs.small){
            let res_json = {};
            res_json.expand = "/experiment/input-size";
            res_json.path = `/${parameter_key}`;            
            res_runner_args.push(res_json);
        }
    }else{
        res_runner_args.push({ "expand": "/experiment/input-size" });
    }
   
    return JSON.stringify(res_runner_args);
}

/**
 * Sets up src for the benchmark implementation
 * @param benchmark_folder{string} Benchmark folder destination
 * @param template_string{string} Template for given language
 * @param language_comments{string} Tokens for language comments
 * @param function_name{string} Function name for given benchmark implementation
 * @param impl{Object} Actual implementation specification object
 */
function processBenchmarkImplementationCode(benchmark_folder, template_string, language_comments,function_name, impl) {
    // Prepare Code Template
    let benchmark_code = template_string;

    // Copy imports
    if(impl.imports) benchmark_code = replaceVariable(benchmark_code,
        language_comments,"%imports",
        impl.imports);

    // Copy variable initialization
    if(impl.init) benchmark_code = replaceVariable(benchmark_code,
        language_comments,"%init",
        impl.init);

    // Copy pre
    if(impl.pre) benchmark_code = replaceVariable(benchmark_code,
        language_comments,"%pre",
        impl.pre.map((str)=>str.replace(/%name/g,function_name)));

    // Copy content
    if(!impl.content)
        throw new Error("Implementation: ", impl, "must have a main benchmark content");
    benchmark_code = replaceVariable(benchmark_code,
        language_comments,"%content",
        impl.content.map((str)=>str.replace(/%name/g,function_name)));
    
    // Copy post
    if(impl.post) benchmark_code = replaceVariable(benchmark_code,
        language_comments,"%post",
        impl.post.map((str)=>str.replace(/%name/g,function_name)));

    fs.writeFileSync(`${benchmark_folder}/runner.${impl.language}`,benchmark_code);
}
