const fs = require("fs");
const shelljs = require("shelljs");
/**
 * Templates for each language
 * @type {{js: {comments: string, templates: Array}, py: {comments: string, templates: Array}}}
 */
const language_metadata = {
    js:{
        comments: "//",
        templates:[]
    },
    py:{
        comments: "#",
        templates:[]
    },
    wast:{
        comments: ";;",
        templates:[]
    }
};
// Test both with broadcasting and without broadcasting
/**
 * Actual object used to generate all benchmarks
 * @type {{constructors: {benchmarks: string[], implementations: *[], inputs: {small: number, medium: number, large: number}, expected_output: {small: number, medium: number, large: number}}}}
 */
const benchmark_categories = {
    constructors:{
        benchmarks:["randn","rand", "zeros", "ones", "eye", "zeros-access", "eye-access", "ones_js", "ones_wasm"],
        implementations:[
        //     {
        //         library:"matmachjs-wasm-native",
        //         init:["(local $arr i32)","(local $input_vec i32)"],
        //         include:["randn","rand", "zeros", "ones", "eye"],
        //         language:"wast",
        //         pre:[
        //             "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //             "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
        //             "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         ],
        //         content:["(set_local $arr (call $%name (get_local $input_vec)))"],
        //         post:["(call $free_macharray (get_local $arr))",
        //         "(call $free_macharray (get_local $input_vec))"]
        //     },
        //  {
        //     library:"matmachjs-native",
        //     init:["let arr;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["randn","rand", "zeros", "ones", "eye"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["input_vec = mr._wi.create_mxvector(2);",
        //         "mr._wi.set_array_index_f64(input_vec,1,args[0]);",
        //         "mr._wi.set_array_index_f64(input_vec,2,args[0]);"],
        //     content:["arr = mr._wi.%name(input_vec);"],
        //     post:["mr._wi.free_macharray(arr);","mr._wi.free_macharray(input_vec);"]
        // },{
        //     library:"matmachjs-interface",
        //     init:["let arr;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     include:["randn","rand", "zeros", "ones", "eye"],
        //     pre:["input_vec = [args[0],args[0]];"],
        //     language:"js",
        //     content:["arr = mr.%name(input_vec);"],
        //     post:["arr.free();"]
        // },
    //      {
    //           library:"matmachjs-interface",
    //         init:["let arr;","let input_vec;","let res;", "let mr = await MachRuntime.initializeRuntime();"],
    //         imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
    //         include:["ones_js"],
    //         function_names:{
    //             "ones_js":"ones_experimental",
    //         },
    //         pre:["input_vec = [args[0],args[0]];"],
    //         language:"js",
    //         content:["arr = mr.%name(input_vec);"],
    //         post:["arr.free();", "console.log(res);"] 
    //      },
    //      {
    //         library:"matmachjs-interface",
    //       init:["let arr;","let input_vec;","let res;", "let mr = await MachRuntime.initializeRuntime();"],
    //       imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
    //       include:["ones_wasm"],
    //       function_names:{
    //           "ones_wasm":"ones_experimental2",
    //       },
    //       pre:["input_vec = [args[0],args[0]];"],
    //       language:"js",
    //       content:["arr = mr.%name(input_vec);"],
    //       post:["arr.free();", "console.log(res);"] 
    //    },
        // {
        //     library:"numpy",
        //     include:["zeros-access"],
        //     imports:["import numpy as np"],
        //     language:"py",
        //     content:["arr = np.zeros((args[0], args[0]))","res = arr[1,1]"],
	    //     post:["print(arr.size)","print(res)"]
        // },
        // {
        //     library:"numpy",
        //     include:["eye-access"],
        //     imports:["import numpy as np"],
        //     language:"py",
        //     content:["arr = np.eye(args[0]))","res = arr[1,2]"],
	    //     post:["print(arr.size)","print(res)"]
        // },
        // {
        //     library:"matmachjs-interface",
        //     init:["let arr;","let input_vec;","let res;", "let mr = await MachRuntime.initializeRuntime();"],
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     include:["zeros_access","eye_access"],
        //     function_names:{
        //         "zeros_access":"zeros",
        //         "eye_access":"eye"
        //     },
        //     pre:["input_vec = [args[0],args[0]];"],
        //     language:"js",
        //     content:["arr = mr.%name(input_vec);","res = arr.get(2);"],
        //     post:["arr.free();", "console.log(res);"]
        // },
        // {
        //     library:"numpy",
        //     include:["eye"],
        //     imports:["import numpy as np"],
        //     language:"py",
        //     content:["arr = np.%name(args[0])"]
        // },
        // {
        //     library:"numpy",
        //     include:["rand","randn"],
        //     function_names:{
        //         "randn": "random.randn",
        //         "rand":"random.rand"
        //     },
        //     imports:["import numpy as np"],
        //     language:"py",
        //     content:["arr = np.%name(args[0], args[0])"],
	    //     post:["print(arr.size)"]
        // },
        // {
        //     library:"numpy",
        //     include:["ones","zeros"],
        //     imports:["import numpy as np"],
        //     pre:["input_vec = (args[0],args[0])"],
        //     language:"py",
        //     content:["arr = np.%name(input_vec)"],
        //     post:["print(arr.size)"]
        // },
        // {
        //     library:"numjs",
        //     init:["let input_vec;"],
        //     include:["zeros","ones","rand"],
        //     function_names: {
        //         "rand":"random"
        //     },
        //     imports:["const numjs = require(\"numjs\")"],
        //     pre:["input_vec = [args[0],args[0]]"],
        //     language:"js",
        //     content:["arr = numjs.%name(input_vec)"]
        // },
        // {
        //      library:"numjs",
        //      language:"js",
        //      imports:["const numjs = require(\"numjs\")"],
        //      include:["eye"],
        //      function_names: {
        //          "eye":"identity"
        //     },
        //     init:["let arr;"],
        //     content:["arr = numjs.%name(args[0])"]
        // }
        ],
        inputs:{ // Must be a string e.g. "[2,\"asda\",false]"
            "small":3000,
            "medium":5000,
            "large":7000
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        },
    
    },
    indexing_get:{
        benchmarks:["get_single_index","get_multiple_index","get_multiple_indeces","nd_indexing_solo"],
        implementations:[
        // {
        //     library:"matmachjs-native",
        //     language:"js",
        //     include:["get_single_index"],
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let arr;","let sum;","let mr = await MachRuntime.initializeRuntime();"],
        //     pre:["arr = mr.ones([args[0],args[0]]);","sum = 0"],
        //     content:
        //         ["for(let j = 0; j < args[0]**2;j++){",
        //         "   sum+=mr._wi.get_array_index_f64(arr._headerOffset, j+1);",
        //         "}"],
        //     post:["arr.free();","console.log(sum);"]
        // },
        // {
        //     library:"matmachjs-interface",
        //     language:"js",
        //     include:["get_single_index"],
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let arr;","let sum;","let mr = await MachRuntime.initializeRuntime();"],
        //     pre:["arr = mr.ones([args[0],args[0]]);","sum = 0;"],
        //     content:
        //         ["for(let j = 0; j < args[0]**2;j++){",
        //         "   sum+=arr._data[j];",
        //         "}"],
        //     post:["arr.free();","console.log(sum);"]
        // },{
        //     library:"matmachjs-wasm-native",
        //     language:"wast",
        //     include:["get_single_index"],
        //     init:["(local $input_vec i32)","(local $j i32)","(local $len i32)","(local $arr i32)", "(local $sum f64)"],
        //     pre:[
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(set_local $arr (call $ones (get_local $input_vec)))",
        //         "(set_local $sum (f64.const 0))",
        //         "(set_local $len (i32.load offset=4 align=4 (get_local $arr)))",
        //     ],
        //     content:[
        //             "(set_local $j (i32.const 1))",
        //             "loop",
        //             "  (set_local $sum ",
        //             "      (f64.add (get_local $sum)",
        //             "       (call $get_array_index_f64 (get_local $arr)(get_local $j))))",
        //             "   (set_local $j (i32.add (get_local $j)(i32.const 1)))",
        //             "   (br_if 0 (i32.le_s (get_local $j)(get_local $len)))",
        //             "end"
        //         ],
        //     post:[
        //     "(call $free_macharray (get_local $arr))",
        //     "(call $free_macharray (get_local $input_vec))",
        //     "(call $printDoubleNumber (get_local $sum))",
        //     "drop"]
        // },
        // {
        //     library:"numpy",
        //     language:"py",
        //     include:["get_single_index"],
        //     imports:["import numpy as np","import sys"],
        //     pre:["arr = np.ones((args[0]**2,))","sum=0"],
        //     content:["for j in range(args[0]**2):","\tsum+=arr[j]"],
        //     post:["sys.stderr.write(str(sum))"]
        // },
        // {
        //     library:"numjs",
        //     language:"js",
        //     imports:["const numjs = require(\"numjs\")"],
        //     include:["get_single_index"],
        //     init:["let sum;","let arr;"],
        //     pre:["sum = 0","arr = numjs.ones([args[0]**2])"],
        //     content:
        //     ["for(let j = 0; j < args[0]**2;j++){",
        //     "   sum+=arr.get(j);",
        //     "}"],
        //     post:["console.log(sum);"]
        // },
        // {
        //     library:"matmachjs-native",
        //     language:"js",
        //     include:["get_multiple_index"],
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let arr;","let sum;","let mr = await MachRuntime.initializeRuntime();",
        //         "let input_vec;"],
        //     pre:["arr = mr.ones([args[0],args[0]]);","sum = 0",
        //     "input_vec = mr._wi.create_mxvector(2);",
        //     ],
        //     content:
        //         ["for(let j = 0; j < args[0];j++){",
        //         "   for(let k = 0;k< args[0];k++){",
        //         "       mr._wi.set_array_index_f64(input_vec, 1, j+1);",
        //         "       mr._wi.set_array_index_f64(input_vec, 2, k+1);",
        //         "       sum+=mr._wi.get_array_value_multiple_indeces_f64(arr._headerOffset, input_vec);",
        //         "   }",
        //         "}"],
        //     post:[
        //         "arr.free();",
        //         "console.log(sum);",
        //         "mr._wi.free_macharray(input_vec);"
        //     ]
        // },
        {
            library:"matmachjs-interface",
            language:"js",
            include:["nd_indexing_solo"],
            imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
            init:["let arr;","let sum;","let mr = await MachRuntime.initializeRuntime();"],
            pre:["arr = mr.rand([args[0],args[0]]);","sum = 0;"],
            content:
                ["for(let j = 0; j < args[0];j++){",
                "   for(let k = 0;k< args[0];k++){",
                "       sum += arr.get_index(j,k);",
                "   }",
                "}"],
            post:["arr.free();","console.log(sum);"]
        },
        {
            library:"numpy",
            language:"py",
            include:["nd_indexing_solo"],
            imports:["import numpy as np","import sys"],
            pre:["arr = np.random.rand(args[0],args[0])","sum=0"],
            content:["for j in range(args[0]):",
                    "   for k in range(args[0]):",
                    "       sum += arr[j,k]",
                    ],
            post:["sys.stderr.write(str(sum))"]
        },
        // {
        //     library:"matmachjs-wasm-native",
        //     language:"wast",
        //     include:["get_multiple_index"],
        //     init:["(local $input_vec i32)","(local $input_vec_dim i32)",
        //     "(local $j i32)","(local $k i32)","(local $len i32)","(local $arr i32)", "(local $sum f64)"],
        //     pre:[
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(set_local $input_vec_dim (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(set_local $arr (call $ones (get_local $input_vec)))",
        //         "(set_local $sum (f64.const 0))",
        //         "(set_local $len (i32.trunc_s/f64 (get_local $args0)))",
        //     ],
        //     content:[
        //             "(set_local $j (i32.const 1))",
        //             "loop",
        //             "   (set_local $k (i32.const 1))",,
        //             "   loop",
        //             "       (call $set_array_index_f64 (get_local $input_vec_dim)(i32.const 1)(f64.convert_s/i32 (get_local $j)))",
        //             "       (call $set_array_index_f64 (get_local $input_vec_dim)(i32.const 2)(f64.convert_s/i32 (get_local $k)))",
        //             "       (set_local $sum ",
        //             "           (f64.add (get_local $sum)",
        //             "               (call $get_array_value_multiple_indeces_f64 (get_local $arr)(get_local $input_vec_dim))))",
        //             "           (set_local $k (i32.add (get_local $k)(i32.const 1)))",
        //             "           (br_if 0 (i32.le_s (get_local $k)(get_local $len)))",
        //             "   end",
        //             "   (set_local $j (i32.add (get_local $j)(i32.const 1)))",
        //             "   (br_if 0 (i32.le_s (get_local $j)(get_local $len)))",
        //             "end"
        //         ],
        //     post:[
        //     "(call $free_macharray (get_local $arr))",
        //     "(call $free_macharray (get_local $input_vec))",
        //     "(call $free_macharray (get_local $input_vec_dim))",
        //     "(call $printDoubleNumber (get_local $sum))",
        //     "drop"]
        // },
        {
            library:"numpy",
            language:"py",
            include:["get_multiple_index"],
            imports:["import numpy as np","import sys"],
            pre:["arr = np.ones((args[0],args[0]))","sum=0"],
            content:["for j in range(args[0]):",
                    "   for k in range(args[0]):",
                    "       sum+=arr[j,k]",
                    ],
            post:["sys.stderr.write(str(sum))"]
        },
        // {
        //     library:"numjs",
        //     language:"js",
        //     imports:["const numjs = require(\"numjs\")"],
        //     include:["get_multiple_index"],
        //     init:["let sum;","let arr;"],
        //     pre:["sum = 0","arr = numjs.ones([args[0],args[0]])"],
        //     content:
        //         ["for(let j = 0; j < args[0];j++){",
        //         "   for(let k = 0;k< args[0];k++){",
        //         "       sum+=arr.get(j,k);",
        //         "   }",
        //         "}"],
        //     post:["console.log(sum);"]
        // },
        // {
        //     library:"matmachjs-native",
        //     language:"js",
        //     include:["get_multiple_indeces"],
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let arr;","let res;","let mr = await MachRuntime.initializeRuntime();",
        //         "let input_vec;", "let indices;", "let scalar;"],
        //     pre:[
        //         "indices = mr.colon(1,2,args[0]);",
        //         "scalar = mr._wi.convert_scalar_to_mxarray(2);",
        //         "arr = mr.ones([args[0],args[0]]);",
        //         "input_vec = mr._wi.create_mxvector(2,5);",
        //     ],
        //     content:
        //         [
        //         "for(let j = 0;j<100;j++){",
        //             "mr._wi.set_array_index_i32(input_vec, 1, indices._headerOffset);",
        //             "mr._wi.set_array_index_i32(input_vec, 2, scalar);",
        //             "res = mr._wi.get_f64(arr._headerOffset, input_vec);",
        //         "}"
        //         ],
        //     post:[
        //         "arr.free();",
        //         "indices.free();",
        //         "console.log(mr._wi.numel(res));",
        //         "mr._wi.free_macharray(input_vec);",
        //         "mr._wi.free_macharray(scalar);",
        //         "mr._wi.free_macharray(res);"
        //     ]
        // },
        // {
        //     library:"matmachjs-interface",
        //     language:"js",
        //     include:["get_multiple_indeces"],
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let arr;","let res;","let mr = await MachRuntime.initializeRuntime();"],
        //     pre:[
        //         "indices = mr.colon(1,2,args[0]);",
        //         "arr = mr.ones([args[0],args[0]]);",
        //     ],
        //     content:
        //     [
        //         "for(let j = 0;j<100;j++){",
        //         "   res = arr.get(indices, 2);",
        //         "}"
        //     ],
        //     post:["arr.free();","console.log(res._numel);","res.free()","indices.free();"]
        // },{
        //     library:"matmachjs-wasm-native",
        //     language:"wast",
        //     include:["get_multiple_indeces"],
        //     init:["(local $indices i32)","(local $scalar i32)",
        //     "(local $input_vec i32)","(local $res i32)","(local $arr i32)","(local $j i32)"],
        //     pre:[
        //         "(set_local $j (i32.const 0))",
        //         "(set_local $indices (call $colon_three (f64.const 1)(f64.const 2)(get_local $args0)))",
        //         "(set_local $scalar (call $convert_scalar_to_mxarray (f64.const 2)))",
        //         "(set_local $arr (call $ones_2D (get_local $args0)(get_local $args0)))",
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 5)(i32.const 0)(i32.const 0)))"
        //     ],
        //     content:[
        //         "loop",
        //         "       (call $set_array_index_i32 (get_local $input_vec)(i32.const 1)(get_local $indices))",
        //         "       (call $set_array_index_i32 (get_local $input_vec)(i32.const 2)(get_local $scalar))",
        //         "       (set_local $res  (call $get_f64 (get_local $arr)(get_local $input_vec)))",
        //         "   (set_local $j (i32.add (get_local $j)(i32.const 1)))",
        //         "   (br_if 0 (i32.le_s (get_local $j)(i32.const 100)))",
        //         "end"

        //         ],
        //     post:[
        //         "(call $printDouble (i32.load offset=4 align=4 (get_local $res)))",
        //         "drop",
        //         "(call $free_macharray (get_local $arr))",
        //         "(call $free_macharray (get_local $input_vec))",
        //         "(call $free_macharray (get_local $indices))",
        //         "(call $free_macharray (get_local $scalar))",
        //         "(call $free_macharray (get_local $res))"
        //     ]
        // },
        // {
        //     library:"numpy",
        //     language:"py",
        //     include:["get_multiple_indeces"],
        //     imports:["import numpy as np","import sys"],
        //     pre:["arr = np.ones((args[0],args[0]))"],
        //     content:["for i in range(100):",
        //     "   res = arr[::2, 0]"],
        //     post:["sys.stderr.write(str(res.size))"]
        // },
        // {
        //     library:"numjs",
        //     language:"js",
        //     imports:["const numjs = require(\"numjs\")"],
        //     include:["get_multiple_indeces"],
        //     init:["let res;","let arr;"],
        //     pre:["arr = numjs.ones([args[0],args[0]])"],
        //     content:
        //         ["for(let i = 0;i<100;i++){","   res = arr.slice([null,null,2],[0,1,1]);","}"],
        //     post:["console.log(res.size);"]
        // }

    ],
        inputs:{ // Must be a string e.g. "[2,\"asda\",false]"
            "small":300,
            "medium":2000,
            "large":5000
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        },
    },
    standard_binary_ops_MM:{
        benchmarks:["plus_MM","times_MM","power_MM"],
        implementations:[
        // {
        //     library:"matmachjs-native",
        //     init:["let arr1;","let arr2;","let res;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["plus_MM","times_MM"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["input_vec = mr._wi.create_mxvector(2);",
        //         "mr._wi.set_array_index_f64(input_vec,1,args[0]);",
        //         "mr._wi.set_array_index_f64(input_vec,2,args[0]);",
        //         "arr1 = mr._wi.rand(input_vec);",
        //         "arr2 = mr._wi.rand(input_vec);"],
        //     content:["res = mr._wi.%name(arr1,arr2);"],
        //     post:[
        //         "mr._wi.free_macharray(arr1);",
        //         "mr._wi.free_macharray(arr2);",
        //         "mr._wi.free_macharray(res);",
        //         "mr._wi.free_macharray(input_vec);"]
        // },
        // {
        //     library:"matmachjs-native",
        //     init:["let arr1;","let arr2;","let res;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["power_MM"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["input_vec = [args[0],args[0]];",
        //         "arr1 = mr.rand(input_vec);",
        //         "arr2 = mr.empty(input_vec);","arr2.fill(2);"],
        //     content:["res = mr._wi.%name(arr1._headerOffset,arr2._headerOffset);"],
        //     post:[
        //         "arr1.free();",
        //         "arr2.free();","mr._wi.free_macharray(res);"]
        // },
        // {
        //     library:"matmachjs-wasm-native",
        //     include:["times_MM","plus_MM"],
        //     language:"wast",
        //     init:["(local $arr1 i32)","(local $arr2 i32)","(local $input_vec i32)","(local $res i32)"],
        //     pre:["(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(set_local $arr1 (call $rand (get_local $input_vec)))",
        //         "(set_local $arr2 (call $rand (get_local $input_vec)))"
        //     ],
        //     content:["(set_local $res (call $%name (get_local $arr1)(get_local $arr2)(i32.const 0)))"],
        //     post:[
        //         "(call $free_macharray (get_local $arr1))",
        //         "(call $free_macharray (get_local $arr2))",
        //         "(call $free_macharray (get_local $res))",
        //         "(call $free_macharray (get_local $input_vec))"
        //     ]
        // },
        // {
        //     library:"matmachjs-wasm-native",
        //     include:["power_MM"],
        //     language:"wast",
        //     init:["(local $arr1 i32)","(local $arr2 i32)","(local $input_vec i32)","(local $res i32)"],
        //     pre:["(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(set_local $arr1 (call $rand (get_local $input_vec)))",
        //         "(set_local $arr2 (call $rand (get_local $input_vec)))",
        //         "(call $fill (get_local $arr2)(f64.const 2))","drop"],
        //     content:["(set_local $res (call $%name (get_local $arr1)(get_local $arr2)(i32.const 0)))"],
        //     post:[
        //         "(call $free_macharray (get_local $arr1))",
        //         "(call $free_macharray (get_local $arr2))",
        //         "(call $free_macharray (get_local $res))",
        //         "(call $free_macharray (get_local $input_vec))"
        //     ]
        // },
        // {
        //     library:"matmachjs-interface",
        //     init:["let arr1;","let arr2;","let res;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["times_MM","plus_MM"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["input_vec = [args[0],args[0]];",
        //         "arr1 = mr.rand(input_vec);",
        //         "arr2 = mr.rand(input_vec);"],
        //     content:["res = mr.%name(arr1,arr2);"],
        //     function_names:{
        //         "times_MM":"mult",
        //         "plus_MM":"add"
        //     },
        //     post:[
        //         "res.free()",
        //         "arr1.free();",
        //         "arr2.free();"]
        // },
        // {
        //     library:"matmachjs-interface",
        //     init:["let arr1;","let res;","let arr2;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["power_MM"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["input_vec = [args[0],args[0]];",
        //         "arr1 = mr.rand(input_vec);",
        //         "arr2 = mr.empty(input_vec);","arr2.fill(2);"],
        //     content:["res = mr.%name(arr1,arr2);"],
        //     function_names:{
        //         "power_MM":"power"
        //     },
        //     post:[
        //         "res.free();",
        //         "arr1.free();",
        //         "arr2.free();"]
        // },
        // {
        //     library:"numpy",
        //     include:["plus_MM","times_MM"],
        //     language:"py",
        //     imports:["import numpy as np"],
        //     pre:[
        //         "arr1 = np.random.rand(args[0],args[0])",
        //         "arr2 = np.random.rand( args[0],args[0])"],
        //     function_names:{
        //         "plus_MM":"add",
        //         "times_MM":"multiply"
        //     },
        //     content:["res = np.%name(arr1, arr2);"]
        // },
        // {
        //     library:"numpy",
        //     include:["power_MM"],
        //     language:"py",
        //     imports:["import numpy as np"],
        //     pre:[
        //         "arr1 = np.random.rand(args[0],args[0])",
        //         "arr2 = np.empty((args[0],args[0]))",
        //         "arr2.fill(2);"],
        //     content:["res = np.power(arr1, arr2);"]
        // },
        // {
        //     library:"numjs",
        //     include:["plus_MM","times_MM"],
        //     language:"js",
        //     init:["let arr1;","let arr2;","let res;"],
        //     imports:["const numjs = require(\"numjs\");"],
        //     pre:[
        //         "arr1 = numjs.random([args[0],args[0]])",
        //         "arr2 = numjs.random([args[0],args[0]]);"],
        //     function_names:{
        //         "plus_MM":"add",
        //         "times_MM":"multiply"
        //     },
        //     content:["res = arr1.%name(arr2);"]
        // },
        // {
        //     library:"numjs",
        //     include:["power_MM"],
        //     language:"js",
        //     init:["let arr1;","let arr2;","let res;"],
        //     imports:["const numjs = require(\"numjs\");"],
        //     pre:[
        //         "arr1 = numjs.random([args[0],args[0]])",
        //         "arr2 = numjs.ones([args[0],args[0]]).multiply(2);"],
        //     content:["res = numjs.power(arr1, arr2);"]
        // }
        ],
        inputs:{ // Must be a string e.g. "[2,\"asda\",false]"
            "small":1000,
            "medium":5000,
            "large":10000
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }
    },
    standard_binary_ops_MM_broadcasting:{
        benchmarks:["plus_MM_broadcasting","times_MM_broadcasting","power_MM_broadcasting"],
        implementations:[
        // {
        //     library:"matmachjs-native",
        //     init:["let arr1;","let arr2;","let res;","let input_vec;","let input_vec2;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["plus_MM_broadcasting","times_MM_broadcasting"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["input_vec = mr._wi.create_mxvector(2);",
        //         "input_vec2 = mr._wi.create_mxvector(3);",
        //         "mr._wi.set_array_index_f64(input_vec,1,1000);",
        //         "mr._wi.set_array_index_f64(input_vec,2,args[0]);",
        //         "mr._wi.set_array_index_f64(input_vec2,1,1000);",
        //         "mr._wi.set_array_index_f64(input_vec2,2,args[0]);",
        //         "mr._wi.set_array_index_f64(input_vec2,3,5);",
        //         "arr1 = mr._wi.rand(input_vec);",
        //         "arr2 = mr._wi.rand(input_vec2);"
        //     ],
        //     content:["res = mr._wi.%name(arr1,arr2);"],
        //     post:[
        //         "mr._wi.free_macharray(arr1);",
        //         "mr._wi.free_macharray(arr2);",
        //         "mr._wi.free_macharray(res);",
        //         "mr._wi.free_macharray(input_vec);",
        //         "mr._wi.free_macharray(input_vec2);"
        //     ]
        // },
        // {
        //     library:"matmachjs-native",
        //     init:["let arr1;","let arr2;","let res;","let input_vec;","let input_vec2;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["power_MM_broadcasting"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["input_vec = [1000,args[0]];",
        //         "input_vec2 = [1000,args[0],5];",
        //         "arr1 = mr.rand(input_vec);",
        //         "arr2 = mr.empty(input_vec2);","arr2.fill(2);"],
        //     content:["res = mr._wi.%name(arr1._headerOffset,arr2._headerOffset);"],
        //     post:[
        //         "arr1.free();",
        //         "arr2.free();","mr._wi.free_macharray(res);"
        //     ]
        // },
        // {
        //     library:"matmachjs-wasm-native",
        //     include:["times_MM_broadcasting","plus_MM_broadcasting"],
        //     language:"wast",
        //     init:["(local $arr1 i32)","(local $arr2 i32)","(local $input_vec i32)","(local $input_vec2 i32)","(local $res i32)"],
        //     pre:[
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(f64.const 1000))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(set_local $input_vec2 (call $create_mxvector (i32.const 3)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 1)(f64.const 1000))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 2)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 3)(f64.const 5))",
        //         "(set_local $arr1 (call $rand (get_local $input_vec)))",
        //         "(set_local $arr2 (call $rand (get_local $input_vec2)))"
        //     ],
        //     content:["(set_local $res (call $%name (get_local $arr1)(get_local $arr2)(i32.const 0)))"],
        //     post:[
	     //        "(call $printDouble (call $numel (get_local $res)))",
        //         "drop",
	     //        "(call $free_macharray (get_local $arr1))",
        //         "(call $free_macharray (get_local $arr2))",
        //         "(call $free_macharray (get_local $res))",
        //         "(call $free_macharray (get_local $input_vec))",
        //         "(call $free_macharray (get_local $input_vec2))"
        //     ]
        // },
        // {
        //     library:"matmachjs-wasm-native",
        //     include:["power_MM_broadcasting"],
        //     language:"wast",
        //     init:["(local $arr1 i32)","(local $arr2 i32)","(local $input_vec i32)","(local $input_vec2 i32)","(local $res i32)"],
        //     pre:[
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(f64.const 1000))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(set_local $input_vec2 (call $create_mxvector (i32.const 3)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 1)(f64.const 1000))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 2)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 3)(f64.const 5))",
        //         "(set_local $arr1 (call $rand (get_local $input_vec)))",
        //         "(set_local $arr2 (call $rand (get_local $input_vec2)))",
        //         "(call $fill (get_local $arr2)(f64.const 2))","drop"],
        //     content:["(set_local $res (call $%name (get_local $arr1)(get_local $arr2)(i32.const 0)))"],
        //     post:[
        //         "(call $printDouble (call $numel (get_local $res)))",
	     //        "drop",
	     //        "(call $free_macharray (get_local $arr1))",
        //         "(call $free_macharray (get_local $arr2))",
        //         "(call $free_macharray (get_local $res))",
        //         "(call $free_macharray (get_local $input_vec))",
        //         "(call $free_macharray (get_local $input_vec2))"
        //     ]
        // },
        // {
        //     library:"matmachjs-interface",
        //     init:["let arr1;","let arr2;","let res;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     include:["times_MM_broadcasting","plus_MM_broadcasting"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:[
        //         "arr1 = mr.rand([1000, args[0]]);",
        //         "arr2 = mr.rand([1000, args[0],5]);"],
        //     content:["res = mr.%name(arr1,arr2);"],
        //     function_names:{
        //         "times_MM_broadcasting":"mult",
        //         "plus_MM_broadcasting":"add"
        //     },
        //     post:[
        //         "res.free()",
        //         "arr1.free();",
        //         "arr2.free();"]
        // },
        // {
        //     library:"matmachjs-interface",
        //     include:["power_MM_broadcasting"],
        //     init:["let arr1;","let res;","let arr2;","let input_vec;","let mr = await MachRuntime.initializeRuntime();"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     pre:["arr1 = mr.rand([1000,args[0]]);",
        //         "arr2 = mr.empty([1000,args[0],5]);","arr2.fill(2);"],
        //     content:["res = mr.%name(arr1,arr2);"],
        //     function_names:{
        //         "power_MM_broadcasting":"power"
        //     },
        //     post:[
        //         "res.free();",
        //         "arr1.free();",
        //         "arr2.free();"]
        // },
        // {
        //     library:"numpy",
        //     include:["plus_MM_broadcasting","times_MM_broadcasting"],
        //     language:"py",
        //     imports:["import numpy as np"],
        //     pre:[
        //         "arr1 = np.random.rand(1000,args[0],1)",
        //         "arr2 = np.random.rand(1000, args[0],5)"],
        //     function_names:{
        //         "plus_MM_broadcasting":"add",
        //         "times_MM_broadcasting":"multiply"
        //     },
        //     content:["res = np.%name(arr1, arr2);"]
        // },
        // {
        //     library:"numpy",
        //     include:["power_MM_broadcasting"],
        //     language:"py",
        //     imports:["import numpy as np"],
        //     pre:[
        //         "arr1 = np.random.rand(1000,args[0],1)",
        //         "arr2 = np.empty((1000,args[0],5))",
        //         "arr2.fill(2);"],
        //     content:["res = np.power(arr1, arr2);"]
        // }
        ],
        inputs:{ // Must be a string e.g. "[2,\"asda\",false]"
            "small":3000,
            "medium":5000,
            "large":10000
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }
    },
    unary_ops_M:{
        benchmarks:["abs","sqrt","sin"],
        implementations:[
        // {
        //     library:"matmachjs-native",
        //     include:["abs","sqrt","sin"],
        //     language:"js",
        //     function_names:{
        //         "abs":"abs_M",
        //         "sqrt":"sqrt_M",
        //         "sin":"sin_M",
        //     },
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let input_vec;","let arr1;","let arr2;","let mr = await MachRuntime.initializeRuntime();"],
        //     pre:["input_vec = mr._wi.create_mxvector(2);",
        //         "mr._wi.set_array_index_f64(input_vec,1,args[0]);",
        //         "mr._wi.set_array_index_f64(input_vec,2,args[0]);",
        //         "arr1 = mr._wi.rand(input_vec);"
        //     ],
        //     content:["arr2 = mr._wi.%name(arr1);"],
        //     post:["mr._wi.free_macharray(input_vec);",
        //     "mr._wi.free_macharray(arr1);",
        //     "mr._wi.free_macharray(arr2);"]
        // },
        // {
        //     library:"matmachjs-wasm-native",
        //     include:["abs","sqrt","sin"],
        //     language:"wast",
        //     function_names:{
        //         "abs":"abs_M",
        //         "sqrt":"sqrt_M",
        //         "sin":"sin_M",
        //     },
        //     init:["(local $input_vec i32)","(local $arr1 i32)", "(local $arr2 i32)"],
        //     pre:[
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(set_local $arr1 (call $randn (get_local $input_vec)))"
        //     ],
        //     content:["(set_local $arr2 (call $%name (get_local $arr1)(i32.const 0)))"],
        //     post:[
        //         "(call $free_macharray (get_local $input_vec))",
        //         "(call $free_macharray (get_local $arr1))",
        //         "(call $free_macharray (get_local $arr2))"
        //     ]
        // },
        // {
        //     library:"matmachjs-interface",
        //     include:["abs","sqrt","sin"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let arr1;", "let arr2;","let mr = await MachRuntime.initializeRuntime();"],
        //     pre:[
        //         "arr1 = mr.rand([args[0],args[0]]);"
        //     ],
        //     content:["arr2 = mr.%name(arr1);"],
        //     post:[
        //         "arr1.free();",
        //         "arr2.free();"
        //     ]
        // },
        // {
        //     library:"numpy",
        //     include:["abs","sqrt","sin"],
        //     language:"py",
        //     imports:["import numpy as np"],
        //     function_names:{
        //         "abs":"absolute"
        //     },
        //     pre:[
        //         "arr1 = np.random.rand(args[0],args[0])"],
        //     content:["arr2 = np.%name(arr1);"]
        // },
        // {
        //     library:"numjs",
        //     include:["abs","sqrt","sin"],
        //     language:"js",
        //     imports:["const numjs = require(\"numjs\");"],
        //     init:["let arr1;","let arr2"],
        //     pre:[
        //         "arr1 = numjs.random(args[0],args[0])"],
        //     content:["arr2 = numjs.%name(arr1);"]
        // }
        ],
        inputs:{
            "small":2000,
            "medium":3000,
            "large":4000
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }
    },
    concatanation:{
        benchmarks:["horzcat","vertcat"],
        implementations:[
        //     {
        //     library:"matmachjs-native",
        //     include:["vertcat"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let input_vec;","let arr1;","let arr2;","let res;","let mr = await MachRuntime.initializeRuntime();"],
        //     pre:[
        //         "input_vec = mr._wi.create_mxvector(2,5);",
        //         "arr1 = mr.rand([args[1],args[0]]);",
        //         "arr2 = mr.rand([args[2],args[0]]);",
        //         "mr._wi.set_array_index_i32(input_vec,1,arr1._headerOffset);",
        //         "mr._wi.set_array_index_i32(input_vec,2,arr2._headerOffset);",
        
        //     ],
        //     content:["res = mr._wi.%name(input_vec);"],
        //     post:[
        //         "mr._wi.free_macharray(res);",
        //     "mr._wi.free_macharray(input_vec);",
        //     "mr._wi.free_macharray(arr1._headerOffset);",
        //     "mr._wi.free_macharray(arr2._headerOffset);"]
        // },
        // {
        //     library:"matmachjs-native",
        //     include:["horzcat"],
        //     language:"js",
        //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
        //     init:["let input_vec;","let arr1;","let arr2;","let res;","let mr = await MachRuntime.initializeRuntime();"],
        //     pre:[
        //         "input_vec = mr._wi.create_mxvector(2,5);",
        //         "arr1 = mr.rand([args[0],args[1]]);",
        //         "arr2 = mr.rand([args[0],args[2]]);",
        //         "mr._wi.set_array_index_i32(input_vec,1,arr1._headerOffset);",
        //         "mr._wi.set_array_index_i32(input_vec,2,arr2._headerOffset);",
        
        //     ],
        //     content:["res = mr._wi.%name(input_vec);"],
        //     post:[
        //         "mr._wi.free_macharray(res);",
        //     "mr._wi.free_macharray(input_vec);",
        //     "mr._wi.free_macharray(arr1._headerOffset);",
        //     "mr._wi.free_macharray(arr2._headerOffset);"]
        // },
        // {
        //     library:"matmachjs-wasm-native",
        //     include:["horzcat"],
        //     language:"wast",
        //     init:["(local $input_vec3 i32)","(local $input_vec2 i32)","(local $input_vec i32)","(local $arr1 i32)","(local $res i32)", "(local $arr2 i32)"],
        //     pre:[
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(set_local $input_vec2 (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(set_local $input_vec3 (call $create_mxvector (i32.const 2)(i32.const 5)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args1))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 1)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 2)(get_local $args2))",
        //         "(set_local $arr1 (call $randn (get_local $input_vec)))",
        //         "(set_local $arr2 (call $randn (get_local $input_vec2)))",
        //         "(call $set_array_index_i32 (get_local $input_vec3)(i32.const 1)(get_local $arr1))",
        //         "(call $set_array_index_i32 (get_local $input_vec3)(i32.const 2)(get_local $arr2))"
        //     ],
        //     content:["(set_local $res (call $horzcat (get_local $input_vec3)))"],
        //     post:[
        //         "(call $printDoubleNumber (call $size_dim (get_local $res)(i32.const 1)))",
        //         "drop",
        //         "(call $printDoubleNumber (call $size_dim (get_local $res)(i32.const 2)))",
        //         "drop",
        //         "(call $free_macharray (get_local $input_vec))",
        //         "(call $free_macharray (get_local $input_vec2))",
        //         "(call $free_macharray (get_local $input_vec3))",
        //         "(call $free_macharray (get_local $res))",
        //         "(call $free_macharray (get_local $arr1))",
        //         "(call $free_macharray (get_local $arr2))"
        //     ]
        // },
        // {
        //     library:"matmachjs-wasm-native",
        //     include:["vertcat"],
        //     language:"wast",
        //     init:["(local $input_vec3 i32)","(local $input_vec2 i32)","(local $input_vec i32)","(local $arr1 i32)","(local $res i32)", "(local $arr2 i32)"],
        //     pre:[
        //         "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(set_local $input_vec2 (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
        //         "(set_local $input_vec3 (call $create_mxvector (i32.const 2)(i32.const 5)(i32.const 0)(i32.const 0)))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args1))",
        //         "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 1)(get_local $args2))",
        //         "(call $set_array_index_f64 (get_local $input_vec2)(i32.const 2)(get_local $args0))",
        //         "(set_local $arr1 (call $randn (get_local $input_vec)))",
        //         "(set_local $arr2 (call $randn (get_local $input_vec2)))",
        //         "(call $set_array_index_i32 (get_local $input_vec3)(i32.const 1)(get_local $arr1))",
        //         "(call $set_array_index_i32 (get_local $input_vec3)(i32.const 2)(get_local $arr2))"
        //     ],
        //     content:["(set_local $res (call $vertcat (get_local $input_vec3)))"],
        //     post:[
        //         "(call $printDoubleNumber (call $size_dim (get_local $res)(i32.const 1)))",
        //         "drop",
        //         "(call $printDoubleNumber (call $size_dim (get_local $res)(i32.const 2)))",
        //         "drop",
        //         "(call $free_macharray (get_local $input_vec))",
        //         "(call $free_macharray (get_local $input_vec2))",
        //         "(call $free_macharray (get_local $input_vec3))",
        //         "(call $free_macharray (get_local $res))",
        //         "(call $free_macharray (get_local $arr1))",
        //         "(call $free_macharray (get_local $arr2))"
        //     ]
        
        // },
        {
            library:"matmachjs-interface",
            include:["horzcat"],
            language:"js",
            imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
            init:["let arr1;", "let arr2;","let res;","let mr = await MachRuntime.initializeRuntime();"],
            pre:[
                "arr1 = mr.rand([args[0],args[1]]);","arr2 = mr.rand([args[0],args[2]]);"
            ],
            content:["res = mr.%name(arr1,arr2);"],
            post:[
                "console.log(res._shape);",
                "arr1.free();",
                "arr2.free();",
                "res.free();"
            ]
        },
        {
            library:"matmachjs-interface",
            include:["vertcat"],
            language:"js",
            imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
            init:["let arr1;", "let arr2;","let res;","let mr = await MachRuntime.initializeRuntime();"],
            pre:[
                "arr1 = mr.rand([args[1],args[0]]);","arr2 = mr.rand([args[2],args[0]]);"
            ],
            content:["res = mr.vertcat(arr1,arr2);"],
            post:[
                "console.log(res._shape);",
                "arr1.free();",
                "arr2.free();",
                "res.free();"
            ]
        },
        // {
        //     library:"numpy",
        //     include:["horzcat"],
        //     language:"py",
        //     imports:["import numpy as np"],
        //     function_names:{
        //         "horzcat":"hstack"
        //     },
        //     pre:[
        //         "arr1 = np.random.rand(args[0],args[1])",
        //         "arr2 = np.random.rand(args[0],args[2])"],
        //     content:["res = np.%name((arr1,arr2));"]
        // },
        // {
        //     library:"numpy",
        //     include:["vertcat"],
        //     language:"py",
        //     imports:["import numpy as np"],
        //     function_names:{
        //         "vertcat":"vstack"
        //     },
        //     pre:[
        //         "arr1 = np.random.rand(args[1],args[0])",
        //         "arr2 = np.random.rand(args[2],args[0])"],
        //     content:["res = np.%name((arr1,arr2));"]
        // },
        // {
        //     library:"numjs",
        //     include:["horzcat"],
        //     language:"js",
        //     imports:["const numjs = require(\"numjs\");"],
        //     init:["let arr1;","let arr2","let res;"],
        //     function_names:{
        //         "horzcat":"concatenate"
        //     },
        //     pre:[
        //         "arr1 = numjs.random(args[0],args[1])","arr2 = numjs.random(args[0],args[2])"],
        //     content:["res = numjs.%name(arr1,arr2);"]
        // },
        // {
        //     library:"numjs",
        //     include:["vertcat"],
        //     language:"js",
        //     function_names:{
        //         "vertcat":"concatenate"
        //     },
        //     imports:["const numjs = require(\"numjs\");"],
        //     init:["let arr1;","let arr2", "let res;"],
        //     pre:[
        //         "arr1 = numjs.random(args[1],args[0])","arr2 = numjs.random(args[2],args[0])"],
        //     content:["res = numjs.%name(arr1.T,arr2.T);"]
        // }
    ],
        inputs:{
            "small":{
                "dim1":2000,
                "dim2":150,
                "dim3":50
            },
            "medium":{
                "dim1":5000,
                "dim2":150,
                "dim3":50
            },
            "large":{
                "dim1":10000,
                "dim2":150,
                "dim3":50
            }
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }
    },

    // // fill: {
    // //     benchmarks:["fill"],
    // //     implementations:[
    // //     {
    // //         library:"matmachjs-interface",
    // //         include:["fill"],
    // //         language:"js",
    // //         imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
    // //         init:["let arr1;","let mr = await MachRuntime.initializeRuntime();"],
    // //         pre:[
    // //             "arr1 = mr.zeros([args[0],args[0]]);"
    // //         ],
    // //         content:["arr1.fill(args[1]);"],
    // //         post:[
    // //             "arr1.free();",
    // //         ]
    // //     },
    // //     {
    // //         library:"matmachjs-native",
    // //         include:["fill"],
    // //         language:"js",
    // //         imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
    // //         init:["let arr1;","let mr = await MachRuntime.initializeRuntime();"],
    // //         pre:[
    // //             "arr1 = mr.zeros([args[0],args[0]]);"
    // //         ],
    // //         content:["mr._wi.fill(arr1._headerOffset, args[1]);"],
    // //         post:[
    // //             "arr1.free();",
    // //         ]
    // //     },
    // //     {
    // //         library:"matmachjs-wasm-native",
    // //         init:["(local $arr i32)","(local $input_vec i32)"],
    // //         include:["fill"],
    // //         language:"wast",
    // //         pre:[
    // //             "(set_local $input_vec (call $create_mxvector (i32.const 2)(i32.const 0)(i32.const 0)(i32.const 0)))",
    // //             "(call $set_array_index_f64 (get_local $input_vec)(i32.const 1)(get_local $args0))",
    // //             "(call $set_array_index_f64 (get_local $input_vec)(i32.const 2)(get_local $args0))",
    // //             "(set_local $arr (call $%name (get_local $input_vec)))"
    // //         ],
    // //         content:["(call $fill (get_local $arr)(get_local $args1))"],
    // //         post:["(call $free_macharray (get_local $arr))",
    // //         "(call $free_macharray (get_local $input_vec))"]
    // //     }

    // // ],
    // //     inputs:{
    // //         "small":{
    // //             "arr_size": 1000,
    // //             "fill_val":30
    // //         },
    // //         "medium":{
    // //             "arr_size": 3000,
    // //             "fill_val":30
    // //         },
    // //         "large":{
    // //             "arr_size": 5000,
    // //             "fill_val":30
    // //         }
    // //     },
    // //     expected_output:{
    // //         "small":0, // Must be a string
    // //         "medium":0,
    // //         "large":0
    // //     }
    // // },
    // // Matrix Concatanation.
    // // mtimes
    // // mean
    // // sum
    // // colon
    
    colon:{
        benchmarks:["colon"],
        implementations:[
            // {
            //     library:"numpy",
            //     language:"py",
            //     imports:["import numpy as np"],
            //     content :["arr = np.arange(args[0]-1,args[2],args[1])"]
            // },
            // {
            //     library:"numjs",
            //     language:"js",
            //     imports:["const numjs = require(\"numjs\");"],
            //     init:["let arr;"],
            //     include:["colon"],
            //     content:["arr = numjs.arange(args[0]-1,args[2],args[1]);"],
            // },
            // {
            //     library: "matmachjs-interface",
            //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
            //     init:["let arr;","let mr = await MachRuntime.initializeRuntime();"],
            //     language:"js",
            //     include:["colon"],
            //     content:["arr = mr.colon(args[0],args[1],args[2]);"],
            //     post: ["console.log(arr._numel)", "arr.free();" ]
            // },
            // {
            //     library: "matmachjs-wasm-native",
            //     language:"wast",
            //     init:["(local $arr i32)"],
            //     include:["colon"],
            //     content:["(set_local $arr (call $colon_three (get_local $args0)(get_local $args1)(get_local $args2)))"],
            //     post: [ "(call $printDouble (call $numel (get_local $arr)))","drop","(call $free_macharray (get_local $arr))"]
            // },
            // {
            //     library: "matmachjs-native",
            //     language:"js",
            //     imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
            //     init:["let arr;", "let mr = await MachRuntime.initializeRuntime();"],
            //     language:"js",
            //     include:["colon"],
            //     content:["arr = mr._wi.colon_three(args[0],args[1],args[2]);"],
            //     post: ["console.log(mr._wi.numel(arr))", "mr._wi.free_macharray(arr);" ]
            // }
        ],
        inputs:{
            "small": {
              low:-1000000,
              step:1,
              high:100000
            },
            "medium":{
                low:-2000000,
                step:1,
                high:200000
            },
            "large":{
                low:-5000000,
                step:1,
                high:500000
            }
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }
    },
    binary_SM:{
        benchmarks:["power_SM","times_SM"],
        implementations:[
            {
                library:"numpy",
                language:"py",
                imports:["import numpy as np"],
                function_names:{
                    "power_SM":"power",
                    "times_SM":"multiply"
                },
                pre :["arr = np.random.randn(args[0],args[0])","sca= args[1]"],
                content:["res = np.%name(arr, sca)"]
            },
            {
                library:"numjs",
                language:"js",
                imports:["const numjs = require(\"numjs\");"],
                init:["let arr;", "let sca;","let res;"],
                pre:["arr = numjs.random([args[0],args[0]])","sca = args[1]"],
                function_names:{
                    "power_SM":"pow",
                    "times_SM":"multiply"
                },
                content:["res = arr.%name(sca)"]
            },
            {
                library: "matmachjs-interface",
                imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
                init:["let arr;","let mr = await MachRuntime.initializeRuntime();","let sca;","let res;"],
                language:"js",
                function_names:{
                    "power_SM":"power",
                    "times_SM":"mult"
                },
                pre:["arr = mr.rand([args[0],args[0]])","sca = args[1]"],
                content:["res = mr.%name(arr,sca)"],
                post: [ "res.free()", "arr.free();" ]
            }, 
        ],        
        inputs:{
            "small": {
              low:1000,
              sca:3
            },
            "medium":{
                low:5000,
                sca:3
            },
            "large":{
                low:10000,
                sca:3
            }
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }
    },
    reductions_dim:{
        benchmarks:["sum", "mean"],
        implementations:[
            {
                library:"numpy",
                language:"py",
                imports:["import numpy as np"],
                pre :["arr = np.random.randn(args[0],args[0],args[0])"],
                content:["res = np.%name(arr, axis=1)"]
            },
            {
                library: "matmachjs-interface",
                imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
                init:["let arr;","let mr = await MachRuntime.initializeRuntime();","let res;"],
                language:"js",
                pre:["arr = mr.rand([args[0],args[0],args[0]])"],
                content:["res = mr.%name(arr,{ axis: 1 })"],
                post: [ "res.free()", "arr.free();" ]
            }

        ],        
        inputs:{
            "small": 10,
            "medium": 100,
            "large":1000
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }

    },
    reductions_all:{
        benchmarks:["sum_all","mean_all"],
        implementations:[
            {
                library:"numpy",
                language:"py",
                imports:["import numpy as np"],
                function_names:{
                    "sum_all":"sum",
                    "mean_all":"mean"
                },
                pre :["arr = np.random.randn(args[0],args[0],args[0])"],
                content:["res = np.%name(arr)"],
                post:["print(res)"]
            },
            {
                library: "matmachjs-interface",
                imports:["const { MachRuntime } = require(\"./matmachjs/classes/macharray/MachRuntime\");"],
                init:["let arr;","let mr = await MachRuntime.initializeRuntime();","let res;"],
                language:"js",
                function_names:{
                    "sum_all":"sum",
                    "mean_all":"mean"
                },
                pre:["arr = mr.rand([args[0],args[0],args[0]])"],
                content:["res = mr.%name(arr)"],
                post: [ "arr.free();","console.log(res)" ]
            },
            {
                library:"numjs",
                language:"js",
                imports:["const numjs = require(\"numjs\");"],
                init:["let arr;","let res;"],
                pre:["arr = numjs.random([args[0],args[0], args[0]])"],
                function_names:{
                    "sum_all":"sum",
                    "mean_all":"mean"
                },
                content:["res = arr.%name()"],
                post:["console.log(res);"]
            },
        ],        
        inputs:{
            "small": 10,
            "medium": 100,
            "large":1000
        },
        expected_output:{
            "small":0, // Must be a string
            "medium":0,
            "large":0
        }
    }
};
// Call to populate the templates
populateLanguageTemplates();


module.exports = {
    benchmark_categories,
    language_metadata
};

/**
 * Reads templates and adds the to the language_templates object
 */
function populateLanguageTemplates(){
    Object.keys(language_metadata)
        .forEach(( language)=>{
            let folder = `./templates/${language}`;
            let template_names = shelljs.ls(`${folder}/benchmarks`);
            if(template_names.length > 0){
                language_metadata[language]
                    .templates = template_names.map((name)=>{
                    return {
                        template_name:   name.substring(0, name.lastIndexOf(".")),
                        template_string: fs.readFileSync(folder+
                            "/benchmarks/"+ name).toString(),
                        path_to_lib:`${folder}/lib`
                    };
                });
            }
        });
}