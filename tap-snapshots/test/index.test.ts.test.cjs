/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/index.test.ts TAP should render a basic best bot report > must match snapshot 1`] = `
# Winning bot race submission
This is the top-ranked automated findings report, from cool-bot bot. All findings in this report will be considered known issues for the purposes of your C4 audit.
**An optional, bold markdown note**
## Summary

| |Issue|Instances| Gas Savings
|-|:-|:-:|:-:|
| [[H-0](#h-0)] | Bad things are afoot | 2| 0|
| [[M-0](#m-0)] | Code does not follow the best practice of check-effects-interaction | 4| 0|
| [[L-0](#l-0)] | Consider implementing two-step procedure for updating protocol addresses | 1| 0|
| [[N-0](#n-0)] | \`2**<n> - 1\` should be re-written as \`type(uint<n>).max\` | 21| 0|
| [[G-0](#g-0)] | \`do\`-\`while\` is cheaper than \`for\`-loops when the initial check can be skipped | 6| 0|
| [[D-0](#d-0)] | ~~\`abi.encodePacked()\` should not be used with dynamic types when passing the result to a hash function such as \`keccak256()\`~~ | 9| 0|
### High Risk Issues
### [H-0]<a name="h-0"></a> Bad things are afoot
The additions/multiplications may silently overflow because they're in \`unchecked\` blocks with no preceding value checks, which may lead to unexpected results
*There are 2 instance(s) of this issue:*
\`\`\`solidity
File: libraries/Math.sol

260:             uint256 inv = (3 * denominator) ^ 2;

\`\`\`

*GitHub* : [260](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L260-L260)
\`\`\`solidity
File: contracts/types/LeftRight.sol

57:              return self + uint256(int256(right));

\`\`\`

*GitHub* : [57](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/LeftRight.sol#L57-L57)
### Medium Risk Issues
### [M-0]<a name="m-0"></a> Code does not follow the best practice of check-effects-interaction
Code should follow the best-practice of [check-effects-interaction](https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-11-coding-patterns/topic/checks-effects-interactions/), where state variables are updated before any external calls are made. Doing so prevents a large class of reentrancy bugs.
*There are 4 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

/// @audit tickSpacing() called prior to this assignment
626:             s_accountLiquidity[positionKey_to] = fromLiq;

/// @audit tickSpacing() called prior to this assignment
627:             s_accountLiquidity[positionKey_from] = 0;

/// @audit tickSpacing() called prior to this assignment
629:             s_accountFeesBase[positionKey_to] = fromBase;

/// @audit tickSpacing() called prior to this assignment
630:             s_accountFeesBase[positionKey_from] = 0;

\`\`\`

*GitHub* : [626](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L626-L626),[627](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L627-L627),[629](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L629-L629),[630](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L630-L630)
### Low Risk Issues
### [L-0]<a name="l-0"></a> Consider implementing two-step procedure for updating protocol addresses
A copy-paste error or a typo may end up bricking protocol functionality, or sending tokens to an address with no known private key. Consider implementing a two-step procedure for updating protocol addresses, where the recipient is set as pending, and must 'accept' the assignment by making an affirmative call. A straight forward way of doing this would be to have the target contracts implement [EIP-165](https://eips.ethereum.org/EIPS/eip-165), and to have the 'set' functions ensure that the recipient is of the right interface type.
*There are 1 instance(s) of this issue:*
\`\`\`solidity
File: contracts/tokens/ERC1155Minimal.sol

/// @audit isApprovedForAll:  setApprovalForAll()
77       function setApprovalForAll(address operator, bool approved) public {
78           isApprovedForAll[msg.sender][operator] = approved;
79   
80           emit ApprovalForAll(msg.sender, operator, approved);
81:      }

\`\`\`

*GitHub* : [77](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/tokens/ERC1155Minimal.sol#L77-L81)
### NonCritical Risk Issues
### [N-0]<a name="n-0"></a> \`2**<n> - 1\` should be re-written as \`type(uint<n>).max\`
Earlier versions of solidity can use \`uint<n>(-1)\` instead. Expressions not including the \`- 1\` can often be re-written to accomodate the change (e.g. by using a \`>\` rather than a \`>=\`, which will also save some gas)
*There are 21 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

384:              s_AddrToPoolIdData[univ3pool] = uint256(poolId) + 2 ** 255;

1281:                     .mulDiv(collected0, totalLiquidity * 2 ** 64, netLiquidity ** 2)

1284:                     .mulDiv(collected1, totalLiquidity * 2 ** 64, netLiquidity ** 2)

\`\`\`

*GitHub* : [384](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L384),[1281](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1281),[1284](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1284)
\`\`\`solidity
File: contracts/libraries/Math.sol

311:              require(2 ** 64 > prod1);

338:              prod0 |= prod1 * 2 ** 192;

373:              require(2 ** 96 > prod1);

400:              prod0 |= prod1 * 2 ** 160;

435:              require(2 ** 128 > prod1);

462:              prod0 |= prod1 * 2 ** 128;

497:              require(2 ** 192 > prod1);

524:              prod0 |= prod1 * 2 ** 64;

\`\`\`

*GitHub* : [311](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L311),[338](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L338),[373](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L373),[400](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L400),[435](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L435),[462](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L462),[497](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L497),[524](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L524)
\`\`\`solidity
File: contracts/libraries/code4rena-devMath.sol

174:                      .mulDiv(Math.absUint(amount), 2 ** 192, uint256(sqrtPriceX96) ** 2)

181:                          2 ** 128,

\`\`\`

*GitHub* : [174](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/code4rena-devMath.sol#L174),[181](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/code4rena-devMath.sol#L181)
\`\`\`solidity
File: contracts/types/TokenId.sol

337:              if (optionRatios < 2 ** 64) {

339:              } else if (optionRatios < 2 ** 112) {

341:              } else if (optionRatios < 2 ** 160) {

343:              } else if (optionRatios < 2 ** 208) {

417:          if (optionRatios < 2 ** 64) {

419:          } else if (optionRatios < 2 ** 112) {

421:          } else if (optionRatios < 2 ** 160) {

423:          } else if (optionRatios < 2 ** 208) {

\`\`\`

*GitHub* : [337](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L337),[339](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L339),[341](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L341),[343](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L343),[417](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L417),[419](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L419),[421](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L421),[423](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L423)
### Gas Risk Issues
### [G-0]<a name="g-0"></a> \`do\`-\`while\` is cheaper than \`for\`-loops when the initial check can be skipped
\`for (uint256 i; i < len; ++i){ ... }\` -> \`do { ...; ++i } while (i < len);\`
*There are 6 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

550:         for (uint256 i = 0; i < ids.length; ) {

583:         for (uint256 leg = 0; leg < numLegs; ) {

860:         for (uint256 leg = 0; leg < numLegs; ) {

\`\`\`

*GitHub* : [550](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L550-L550),[583](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L583-L583),[860](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L860-L860)
\`\`\`solidity
File: contracts/multicall/Multicall.sol

14:          for (uint256 i = 0; i < data.length; ) {

\`\`\`

*GitHub* : [14](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/multicall/Multicall.sol#L14-L14)
\`\`\`solidity
File: contracts/tokens/ERC1155Minimal.sol

141:         for (uint256 i = 0; i < ids.length; ) {

187:             for (uint256 i = 0; i < owners.length; ++i) {

\`\`\`

*GitHub* : [141](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/tokens/ERC1155Minimal.sol#L141-L141),[187](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/tokens/ERC1155Minimal.sol#L187-L187)
### Refactoring Risk Issues
### Disputed Risk Issues
### [D-0]<a name="d-0"></a> ~~\`abi.encodePacked()\` should not be used with dynamic types when passing the result to a hash function such as \`keccak256()\`~~
These do not have consecutive dynamic typed arguments
*There are 9 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

594              bytes32 positionKey_from = keccak256(
595                  abi.encodePacked(
596                      address(univ3pool),
597                      from,
598                      id.tokenType(leg),
599                      liquidityChunk.tickLower(),
600                      liquidityChunk.tickUpper()
601                  )
602:             );

603              bytes32 positionKey_to = keccak256(
604                  abi.encodePacked(
605                      address(univ3pool),
606                      to,
607                      id.tokenType(leg),
608                      liquidityChunk.tickLower(),
609                      liquidityChunk.tickUpper()
610                  )
611:             );

945          bytes32 positionKey = keccak256(
946              abi.encodePacked(
947                  address(_univ3pool),
948                  msg.sender,
949                  _tokenType,
950                  _liquidityChunk.tickLower(),
951                  _liquidityChunk.tickUpper()
952              )
953:         );

1104                 keccak256(
1105                     abi.encodePacked(
1106                         address(this),
1107                         liquidityChunk.tickLower(),
1108                         liquidityChunk.tickUpper()
1109                     )
1110:                )

1353:            keccak256(abi.encodePacked(univ3pool, owner, tokenType, tickLower, tickUpper))

1380         bytes32 positionKey = keccak256(
1381             abi.encodePacked(address(univ3pool), owner, tokenType, tickLower, tickUpper)
1382:        );

1446:            keccak256(abi.encodePacked(univ3pool, owner, tokenType, tickLower, tickUpper))

\`\`\`

*GitHub* : [594](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L594-L602),[603](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L603-L611),[945](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L945-L953),[1104](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1104-L1110),[1353](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1353-L1353),[1380](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1380-L1382),[1446](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1446-L1446)
\`\`\`solidity
File: contracts/libraries/CallbackLib.sol

39                           keccak256(
40                               abi.encodePacked(
41                                   bytes1(0xff),
42                                   factory,
43                                   keccak256(abi.encode(features)),
44                                   Constants.V3POOL_INIT_CODE_HASH
45                               )
46:                          )

\`\`\`

*GitHub* : [39](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/CallbackLib.sol#L39-L46)
\`\`\`solidity
File: contracts/libraries/code4rena-devMath.sol

57:                  (uint64(uint256(keccak256(abi.encodePacked(token0, token1, fee)))) >> 32);

\`\`\`

*GitHub* : [57](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/code4rena-devMath.sol#L57-L57)
##Extras
An optional markdown based footnote section
`

exports[`test/index.test.ts TAP should render a basic report > must match snapshot 1`] = `
**An optional, bold markdown note**
## Summary

| |Issue|Instances| Gas Savings
|-|:-|:-:|:-:|
| [[H-0](#h-0)] | Bad things are afoot | 2| 0|
| [[M-0](#m-0)] | Code does not follow the best practice of check-effects-interaction | 4| 0|
| [[L-0](#l-0)] | Consider implementing two-step procedure for updating protocol addresses | 1| 0|
| [[N-0](#n-0)] | \`2**<n> - 1\` should be re-written as \`type(uint<n>).max\` | 21| 0|
| [[G-0](#g-0)] | \`do\`-\`while\` is cheaper than \`for\`-loops when the initial check can be skipped | 6| 0|
| [[D-0](#d-0)] | ~~\`abi.encodePacked()\` should not be used with dynamic types when passing the result to a hash function such as \`keccak256()\`~~ | 9| 0|
### High Risk Issues
### [H-0]<a name="h-0"></a> Bad things are afoot
The additions/multiplications may silently overflow because they're in \`unchecked\` blocks with no preceding value checks, which may lead to unexpected results
*There are 2 instance(s) of this issue:*
\`\`\`solidity
File: libraries/Math.sol

260:             uint256 inv = (3 * denominator) ^ 2;

\`\`\`

*GitHub* : [260](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L260-L260)
\`\`\`solidity
File: contracts/types/LeftRight.sol

57:              return self + uint256(int256(right));

\`\`\`

*GitHub* : [57](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/LeftRight.sol#L57-L57)
### Medium Risk Issues
### [M-0]<a name="m-0"></a> Code does not follow the best practice of check-effects-interaction
Code should follow the best-practice of [check-effects-interaction](https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-11-coding-patterns/topic/checks-effects-interactions/), where state variables are updated before any external calls are made. Doing so prevents a large class of reentrancy bugs.
*There are 4 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

/// @audit tickSpacing() called prior to this assignment
626:             s_accountLiquidity[positionKey_to] = fromLiq;

/// @audit tickSpacing() called prior to this assignment
627:             s_accountLiquidity[positionKey_from] = 0;

/// @audit tickSpacing() called prior to this assignment
629:             s_accountFeesBase[positionKey_to] = fromBase;

/// @audit tickSpacing() called prior to this assignment
630:             s_accountFeesBase[positionKey_from] = 0;

\`\`\`

*GitHub* : [626](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L626-L626),[627](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L627-L627),[629](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L629-L629),[630](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L630-L630)
### Low Risk Issues
### [L-0]<a name="l-0"></a> Consider implementing two-step procedure for updating protocol addresses
A copy-paste error or a typo may end up bricking protocol functionality, or sending tokens to an address with no known private key. Consider implementing a two-step procedure for updating protocol addresses, where the recipient is set as pending, and must 'accept' the assignment by making an affirmative call. A straight forward way of doing this would be to have the target contracts implement [EIP-165](https://eips.ethereum.org/EIPS/eip-165), and to have the 'set' functions ensure that the recipient is of the right interface type.
*There are 1 instance(s) of this issue:*
\`\`\`solidity
File: contracts/tokens/ERC1155Minimal.sol

/// @audit isApprovedForAll:  setApprovalForAll()
77       function setApprovalForAll(address operator, bool approved) public {
78           isApprovedForAll[msg.sender][operator] = approved;
79   
80           emit ApprovalForAll(msg.sender, operator, approved);
81:      }

\`\`\`

*GitHub* : [77](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/tokens/ERC1155Minimal.sol#L77-L81)
### NonCritical Risk Issues
### [N-0]<a name="n-0"></a> \`2**<n> - 1\` should be re-written as \`type(uint<n>).max\`
Earlier versions of solidity can use \`uint<n>(-1)\` instead. Expressions not including the \`- 1\` can often be re-written to accomodate the change (e.g. by using a \`>\` rather than a \`>=\`, which will also save some gas)
*There are 21 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

384:              s_AddrToPoolIdData[univ3pool] = uint256(poolId) + 2 ** 255;

1281:                     .mulDiv(collected0, totalLiquidity * 2 ** 64, netLiquidity ** 2)

1284:                     .mulDiv(collected1, totalLiquidity * 2 ** 64, netLiquidity ** 2)

\`\`\`

*GitHub* : [384](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L384),[1281](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1281),[1284](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1284)
\`\`\`solidity
File: contracts/libraries/Math.sol

311:              require(2 ** 64 > prod1);

338:              prod0 |= prod1 * 2 ** 192;

373:              require(2 ** 96 > prod1);

400:              prod0 |= prod1 * 2 ** 160;

435:              require(2 ** 128 > prod1);

462:              prod0 |= prod1 * 2 ** 128;

497:              require(2 ** 192 > prod1);

524:              prod0 |= prod1 * 2 ** 64;

\`\`\`

*GitHub* : [311](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L311),[338](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L338),[373](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L373),[400](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L400),[435](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L435),[462](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L462),[497](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L497),[524](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/Math.sol#L524)
\`\`\`solidity
File: contracts/libraries/code4rena-devMath.sol

174:                      .mulDiv(Math.absUint(amount), 2 ** 192, uint256(sqrtPriceX96) ** 2)

181:                          2 ** 128,

\`\`\`

*GitHub* : [174](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/code4rena-devMath.sol#L174),[181](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/code4rena-devMath.sol#L181)
\`\`\`solidity
File: contracts/types/TokenId.sol

337:              if (optionRatios < 2 ** 64) {

339:              } else if (optionRatios < 2 ** 112) {

341:              } else if (optionRatios < 2 ** 160) {

343:              } else if (optionRatios < 2 ** 208) {

417:          if (optionRatios < 2 ** 64) {

419:          } else if (optionRatios < 2 ** 112) {

421:          } else if (optionRatios < 2 ** 160) {

423:          } else if (optionRatios < 2 ** 208) {

\`\`\`

*GitHub* : [337](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L337),[339](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L339),[341](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L341),[343](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L343),[417](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L417),[419](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L419),[421](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L421),[423](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/types/TokenId.sol#L423)
### Gas Risk Issues
### [G-0]<a name="g-0"></a> \`do\`-\`while\` is cheaper than \`for\`-loops when the initial check can be skipped
\`for (uint256 i; i < len; ++i){ ... }\` -> \`do { ...; ++i } while (i < len);\`
*There are 6 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

550:         for (uint256 i = 0; i < ids.length; ) {

583:         for (uint256 leg = 0; leg < numLegs; ) {

860:         for (uint256 leg = 0; leg < numLegs; ) {

\`\`\`

*GitHub* : [550](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L550-L550),[583](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L583-L583),[860](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L860-L860)
\`\`\`solidity
File: contracts/multicall/Multicall.sol

14:          for (uint256 i = 0; i < data.length; ) {

\`\`\`

*GitHub* : [14](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/multicall/Multicall.sol#L14-L14)
\`\`\`solidity
File: contracts/tokens/ERC1155Minimal.sol

141:         for (uint256 i = 0; i < ids.length; ) {

187:             for (uint256 i = 0; i < owners.length; ++i) {

\`\`\`

*GitHub* : [141](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/tokens/ERC1155Minimal.sol#L141-L141),[187](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/tokens/ERC1155Minimal.sol#L187-L187)
### Refactoring Risk Issues
### Disputed Risk Issues
### [D-0]<a name="d-0"></a> ~~\`abi.encodePacked()\` should not be used with dynamic types when passing the result to a hash function such as \`keccak256()\`~~
These do not have consecutive dynamic typed arguments
*There are 9 instance(s) of this issue:*
\`\`\`solidity
File: contracts/SemiFungiblePositionManager.sol

594              bytes32 positionKey_from = keccak256(
595                  abi.encodePacked(
596                      address(univ3pool),
597                      from,
598                      id.tokenType(leg),
599                      liquidityChunk.tickLower(),
600                      liquidityChunk.tickUpper()
601                  )
602:             );

603              bytes32 positionKey_to = keccak256(
604                  abi.encodePacked(
605                      address(univ3pool),
606                      to,
607                      id.tokenType(leg),
608                      liquidityChunk.tickLower(),
609                      liquidityChunk.tickUpper()
610                  )
611:             );

945          bytes32 positionKey = keccak256(
946              abi.encodePacked(
947                  address(_univ3pool),
948                  msg.sender,
949                  _tokenType,
950                  _liquidityChunk.tickLower(),
951                  _liquidityChunk.tickUpper()
952              )
953:         );

1104                 keccak256(
1105                     abi.encodePacked(
1106                         address(this),
1107                         liquidityChunk.tickLower(),
1108                         liquidityChunk.tickUpper()
1109                     )
1110:                )

1353:            keccak256(abi.encodePacked(univ3pool, owner, tokenType, tickLower, tickUpper))

1380         bytes32 positionKey = keccak256(
1381             abi.encodePacked(address(univ3pool), owner, tokenType, tickLower, tickUpper)
1382:        );

1446:            keccak256(abi.encodePacked(univ3pool, owner, tokenType, tickLower, tickUpper))

\`\`\`

*GitHub* : [594](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L594-L602),[603](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L603-L611),[945](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L945-L953),[1104](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1104-L1110),[1353](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1353-L1353),[1380](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1380-L1382),[1446](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/SemiFungiblePositionManager.sol#L1446-L1446)
\`\`\`solidity
File: contracts/libraries/CallbackLib.sol

39                           keccak256(
40                               abi.encodePacked(
41                                   bytes1(0xff),
42                                   factory,
43                                   keccak256(abi.encode(features)),
44                                   Constants.V3POOL_INIT_CODE_HASH
45                               )
46:                          )

\`\`\`

*GitHub* : [39](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/CallbackLib.sol#L39-L46)
\`\`\`solidity
File: contracts/libraries/code4rena-devMath.sol

57:                  (uint64(uint256(keccak256(abi.encodePacked(token0, token1, fee)))) >> 32);

\`\`\`

*GitHub* : [57](https://github.com/code-423n4/2023-11-code4rena-dev/blob/2647928c33be4a58883110befd7fd065448478ef/contracts/libraries/code4rena-devMath.sol#L57-L57)
##Extras
An optional markdown based footnote section
`
