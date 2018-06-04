# Bcash Fuzz Testing

This is a collection of scripts and tests for running fuzz testing Script against multiple implementations.

## Build and run tests

**Clone, build and install libbitcoinconsensus shared library**:
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


**Build fuzz program `verify`**:
```
CXXFLAGS="-I/path/to/build/include -L/path/to/build/lib" make
```

**To generate randomized data for testing**:
```
./generate.js verify
```
That will automatically generate files in the `./data` directory that can be used for input for testing.


**To run the tests**:
```
LD_LIBRARY_PATH="/path/to/build/lib" ./detect.js
```

This will use the `./data` directory as input sources and run both `verify.c` and `verify.js` to check that the result is the same.

## Notes

We've gone with building a C/C++ program linked to against `libbitcoinconsensus` using the intended build toolchain from Bitcoin-ABC with an identical bcash JavaScript/Node.js implementation. Both take input from a file and verify the execution of the script. This is done for a few reasons:

- Minimize debugging time when compiling Node.js bindings to `libbitcoinconsensus`. There is a shared and static library from the C++ implementation of Bitcoin Cash ([Bitcoin-ABC](https://www.bitcoinabc.org/)), however the build process is mostly dependent upon `autotools` for generation of files such as `config/bitcoin-config.h` and `ecmult_static_context.h` and some header files have been changed to assume C++ usage, when gcc and C is sometimes used, and some header files would be missing in that case.
- Compatibility with tools such as [American Fuzzy Lop (AFL)](https://en.wikipedia.org/wiki/American_fuzzy_lop_(fuzzer))
- Use the exact same code used in Bitcoin-ABC Minimize any differences that may be introduced by the build system.

## Related Links

- https://jonasnick.github.io/blog/2015/05/09/fuzzing-bitcoin-consensus/
- https://github.com/jonasnick/bitcoinconsensus_testcases
- https://github.com/bitcoin/bitcoin/pull/9172
- https://github.com/bitcoin/bitcoin/blob/217b416c727aaaaad939203b845a96fd638ded1e/doc/fuzzing.md