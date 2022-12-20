/*
 * Copyright (c) 2019 Snowflake Computing Inc. All rights reserved.
 */

const GlobalConfig = require('../../../lib/global_config');
const OcspResponseCache = require('../../../lib/agent/ocsp_response_cache');

const assert = require('assert');
const async = require('async');

describe('OCSP mode', function ()
{
  it('getOcspMode', function (done)
  {
    // insecure mode
    GlobalConfig.setInsecureConnect(true);
    assert.equal(GlobalConfig.getOcspMode(), GlobalConfig.ocspModes.INSECURE);

    // insecure mode + Fail open
    GlobalConfig.setOcspFailOpen(true);
    assert.equal(GlobalConfig.getOcspMode(), GlobalConfig.ocspModes.INSECURE);
    GlobalConfig.setInsecureConnect(false);
    assert.equal(GlobalConfig.getOcspMode(), GlobalConfig.ocspModes.FAIL_OPEN);

    GlobalConfig.setOcspFailOpen(false);
    assert.equal(GlobalConfig.getOcspMode(), GlobalConfig.ocspModes.FAIL_CLOSED);
    GlobalConfig.setOcspFailOpen(true);
    done();
  });

  it('OCSP no cache file', function (done)
  {
    var cache = new OcspResponseCache.OcspResponseCache();
    var cert = "testCertificate";
    var response = "testResponse";

    async.series(
      [
        function (callback)
        {
          // attempt to set entry when cache has not been initialized
          cache.set(cert, response);
          callback();
        }
      ],
      function ()
      {
        done();
      });
  });
});