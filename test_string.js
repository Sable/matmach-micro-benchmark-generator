let as =
`
        // %test
// %test
`;
let arr = [as];
let statements = ["let a = 4;", "let b = 5;"];
let reg = /[ ]*\/\/ %test/g;
let res = as;
let reg_spaces = reg.exec(res);
while(reg_spaces!==null){
    let spaces = reg_spaces[0].replace(/\/\/ %test/g, "");
    let statement_string = statements.reduce((acc, item)=>acc+=`${spaces}${item}\n`,"");
    res = res.replace(/[ ]*\/\/ %test/,statement_string);
    reg_spaces = reg.exec(res);
    if(reg_spaces!== null)spaces = reg_spaces[0].replace(/\/\/ %test/g, "");
}
console.log(res);
// console.log(as.replace(/[\t]+%name/g,"messi"));
console.log(replaceVariable(as, "//","%test",statements));
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