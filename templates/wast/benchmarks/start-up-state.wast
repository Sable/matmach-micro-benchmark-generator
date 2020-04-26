(export "runner" (func $runner))
(func $runner (param $args0 f64)(param $args1 f64)(param $args2 f64)(param $args3 f64)(param $args4 f64) 
    (result f64)
    (local $time f64)
    ;; %init
    ;; %pre
    call $tic
    drop
    ;; %content
    call $toc
    set_local $time
    ;; %post
    get_local $time
) 