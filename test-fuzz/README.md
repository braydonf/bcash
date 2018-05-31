# Bcash Fuzz Testing

This is a collection of scripts and tests for running fuzz testing Script against multiple implementations.

## Build

Clone, build and install libbitcoinconsensus shared library:
```
git clone https://github.com/Bitcoin-ABC/bitcoin-abc.git
git checkout v0.17.1
cd bitcoin-abc
./autogen.sh
./configure --prefix=/path/to/build --disable-wallet --with-gui=no --disable-zmq --disable-bench --disable-tests --disable-gui-tests --with-miniupnpc=no
make -j 8
make install
```

We've used the `/path/to/build` as the prefix as we're likely going to have multiple builds that may conflict.


Build fuzz programs:
```
export CXXFLAGS="-I/path/to/build/include -L/path/to/build/lib"
make
```

## Notes

Fuzz testing against Node.js bindings to [libbitcoinconsensus](https://github.com/Bitcoin-ABC/bitcoin-abc/blob/master/doc/shared-libraries.md) is fragile, as the build process is dependent upon the build system for configuration in way that makes working with gyp build process crufty and error prone. So instead we have a simple C program linked to against libbitcoinconsensus that will take input from a file, similarly we have an identical version for bcash implementation. The results of the implementations can be compared by giving the same data to each program to execute. This should also provide compatability with tools such as [AFL](http://lcamtuf.coredump.cx/afl/).

## Related Links

- https://jonasnick.github.io/blog/2015/05/09/fuzzing-bitcoin-consensus/
- https://github.com/jonasnick/bitcoinconsensus_testcases
- https://github.com/bitcoin/bitcoin/pull/9172
- https://github.com/bitcoin/bitcoin/blob/217b416c727aaaaad939203b845a96fd638ded1e/doc/fuzzing.md