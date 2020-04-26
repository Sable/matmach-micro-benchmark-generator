(export "runner" (func $runner))
(func $runner (param $args0 f64)(param $args1 f64)(param $args2 f64)(param $args3 f64)(param $args4 f64)
    (result f64)
    (local $i i32)(local $time f64)(local $output f64)
    ;; %init
    loop
        ;; %pre
        ;; %content
        ;; %post
        (set_local $i (i32.add (get_local $i)(i32.const 1)))
        (br_if 0 (i32.lt_s (get_local $i)(i32.const 10)))
    end
    ;; %pre
    call $tic
    drop
    ;; %content
    call $toc
    set_local $time
    ;; %post
    get_local $time
)  
