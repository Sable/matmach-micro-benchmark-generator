# Wu-wei benchmark generator

## Motivation

One of the aims of difficulties in benchmarking is to easily have a system to
manage, collect and reproduce experiments reliably. For compiler developers or
library writers are often necessary to have a way to test an existing benchmark
across different implementations, compilers, and environments, to this end, the
_Wu-wei benchmarking toolkit_(Wu-wei)[https://github.com/Sable/wu-wei-benchmarking-toolkit] was developed to offer the capability to test
reliably across systems, compilers, and environments and implementations. 
While designing the experiments to test and understand the performance of the (MatMachJS
Library)[https://github.com/Sable/matmachjs],  this library is a numerical
library with computational kernels written in _WebAssembly_, the library's API
is in _JavaScript_. Some of the questions that were of interest were:
- What is the performance of the library functions against other _JavaScript_
  numerical libraries such as [NumJS]() and [NdArray]()?
- What is the performance of the library functions against other known systems
  that use an embedded language for perfomance? To this end, the library
  functions were tested against SciPy Numpy library functions. 
- What are some of the overheads between the _JavaScript_ and _WebAssembly_
  interaction?

Lastly, since the run-time environments at hand are normally JITs, we wanted to
also test the benefit of JIT compilation.

## Example

--e.g. for a given function call such
as _ones()_ we wanted to find out how the call would fair if done compl
--e.g. for a given function call such
as _ones()_ we wanted to find out how the call would fair if done compl
Therefore the benchmarks produced were written across different 
In the library we wanted to test and understand the performance of individual library calls across different web engines, since the web engines are typically implemented as JITs, some of the interesting questions since the library was written in WebAssembly and the 
Another problem, often faced by compiler and library writers is that of producing test cases in a system that allows to easily verify performance. The purpose of this
repository is to provide a benchmark generation system for Wu-wei. The idea of
to use JSON objects and specify all the micro-benchmark information 


