# Bcash Fuzz Testing

This is a collection of scripts and tests for running fuzz testing Script against multiple implementations.

## Notes

Fuzz testing against Node.js bindings to [libbitcoinconsensus](https://github.com/Bitcoin-ABC/bitcoin-abc/blob/master/doc/shared-libraries.md) is fragile, as the build process is dependent upon the build system for configuration in way that makes working with gyp build process crufty and error prone. So instead we have a simple C program linked to against libbitcoinconsensus that will take input from a file, similarly we have an identical version for bcash implementation. The results of the implementations can be compared by giving the same data to each program to execute. This should also provide compatability with tools such as [AFL](http://lcamtuf.coredump.cx/afl/).

## Related Links

- https://jonasnick.github.io/blog/2015/05/09/fuzzing-bitcoin-consensus/
- https://github.com/jonasnick/bitcoinconsensus_testcases
- https://github.com/bitcoin/bitcoin/pull/9172
- https://github.com/bitcoin/bitcoin/blob/217b416c727aaaaad939203b845a96fd638ded1e/doc/fuzzing.md