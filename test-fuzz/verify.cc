/*!
 * verify.cc - verify script for fuzz testing
 * Copyright (c) 2018, the bcoin developers (MIT License).
 * Parts of this are based on https://github.com/jonasnick/bitcoinconsensus_testcases
 * https://github.com/bcoin-org/bcoin
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <errno.h>
#include <bitcoinconsensus.h>

#define LINE_MAX_HEX_LENGTH 20000
#define LINE_MAX_LENGTH 10000

int read_hex_line(const char *buf, int bufLen, unsigned char out[], int n)
{
    int i = 0;
    int j = 0;

    while (buf[i] != '\n' && buf[i] != '\0' && j < n && i + 1 < bufLen) {
        char b;
        sscanf(&buf[i], "%2hhx", &b);
        out[j] = b;
        i += 2;
        j += 1;
    }

    return j;
}

int read_file(const char *filepath,
              unsigned char scriptPubKey[], unsigned int *scriptPubKeyLen,
              unsigned char txTo[], unsigned int *txToLen,
              unsigned int *nIn, unsigned int *flags)
{
    FILE *fp = fopen(filepath, "r");
    if (fp == NULL)
        return ENOENT;

    char line[LINE_MAX_HEX_LENGTH];

    // first line is scriptPubKey (output script)
    if (fgets(line, LINE_MAX_HEX_LENGTH, fp) != NULL)
        *scriptPubKeyLen = read_hex_line(line, LINE_MAX_HEX_LENGTH, scriptPubKey, LINE_MAX_LENGTH);

    // second line is txTo (tx)
    if (fgets(line, LINE_MAX_HEX_LENGTH, fp) != NULL)
        *txToLen = read_hex_line(line, LINE_MAX_HEX_LENGTH, txTo, LINE_MAX_LENGTH);

    // third line is the nIn (input number)
    if (fgets(line, LINE_MAX_HEX_LENGTH, fp) != NULL)
        *nIn = (unsigned int)atoi(line);

    // fourth line are the script flags
    if (fgets(line, LINE_MAX_HEX_LENGTH, fp) != NULL)
        *flags = (unsigned int)atoi(line);

    fclose(fp);

    return 0;
}

int main(int argc, char *argv[])
{
    uint8_t scriptPubKey[LINE_MAX_HEX_LENGTH];
    unsigned int scriptPubKeyLen;
    uint8_t txTo[LINE_MAX_HEX_LENGTH];
    unsigned int txToLen;
    unsigned int nIn;
    unsigned int flags;
    int64_t amount = 0; // TODO include amount in test data

    int status = 0;
    const char *filepath = argv[1];
    status = read_file(filepath, scriptPubKey, &scriptPubKeyLen, txTo,
                       &txToLen, &nIn, &flags);

    if (status)
        return status;

    bitcoinconsensus_error err = bitcoinconsensus_ERR_OK;

    if (flags & bitcoinconsensus_SCRIPT_ENABLE_SIGHASH_FORKID ||
        flags & bitcoinconsensus_SCRIPT_FLAGS_VERIFY_WITNESS_DEPRECATED) {

        status = bitcoinconsensus_verify_script_with_amount(scriptPubKey, scriptPubKeyLen, amount,
                                                            txTo, txToLen, nIn, flags, &err);

    } else {
        status = bitcoinconsensus_verify_script(scriptPubKey, scriptPubKeyLen,
                                                txTo, txToLen, nIn, flags, &err);
    }

    printf("%d\n", status);

    return 0;
}
