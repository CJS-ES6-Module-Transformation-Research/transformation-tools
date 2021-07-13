#!/bin/bash
cd /Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform
#cross-env TS_NODE_FILES=true mocha — exit — require ts-node/register — colors test/tests/*.ts
./clean
ts-mocha test/tests/*.ts
