"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://lulu:ml1284@ds123822.mlab.com:23822/nursing-reports";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://lulu:ml1284@ds123822.mlab.com:23822/nursing-reports";
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET || "WEST_HAM_UNITED";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
