# Changelog

## [0.1.1](https://github.com/liblaf/api/compare/v0.1.0..v0.1.1) - 2025-06-02

### ✨ Features

- **routes:** add icons endpoint and refactor proxy logic - ([ca7f476](https://github.com/liblaf/api/commit/ca7f4761be4b5a03ecbbc584755c52dd60d03a89))
- enable CORS for all routes - ([e2089cc](https://github.com/liblaf/api/commit/e2089ccb3d778dd05ee484af42b13602c0765df6))

### 📝 Documentation

- **openapi:** add examples to proxy route parameters - ([140b6db](https://github.com/liblaf/api/commit/140b6dbba21b9ddd6accd9808bc8158da0bb62d7))

### ♻ Code Refactoring

- remove unused CORS middleware - ([fb75171](https://github.com/liblaf/api/commit/fb75171a40f2aa13537994a061a35eb01738f25d))

### ❤️ New Contributors

- [@liblaf](https://github.com/liblaf) made their first contribution

## [0.1.0](https://github.com/liblaf/api/compare/v0.0.0..v0.1.0) - 2025-06-02

### 💥 BREAKING CHANGES

- **api:** restructure mihomo subscription endpoint - ([0a64622](https://github.com/liblaf/api/commit/0a6462278033f6a5cc1b987eb83120a69fb2fa48))

### ✨ Features

- **routes:** add rules endpoint for sub-converter - ([a0a33ca](https://github.com/liblaf/api/commit/a0a33ca135338e424d8eb3bb5b0611d2c0518f83))

### 📝 Documentation

- **openapi:** add description and fix spec version - ([21bf689](https://github.com/liblaf/api/commit/21bf689290f3ac695f981c7a0b7cb5f9e5946de2))

## [0.0.0] - 2025-05-31

### 💥 BREAKING CHANGES

- update wrangler configuration - ([03cc997](https://github.com/liblaf/api/commit/03cc997b4b094af68a98e3e8738e22732574a241))
- reorganize codebase and update dependencies - ([7168c58](https://github.com/liblaf/api/commit/7168c588b24dbb4d15b74c1e0eed1f2b13c6b158))

### ✨ Features

- **convert:** refactor sing-box conversion logic for improved flexibility and extensibility - ([5286db2](https://github.com/liblaf/api/commit/5286db2ccd19e35d6b634eec89b3c77ef0b163c4))
- enhance root route to redirect based on user agent and add API reference route - ([12061d9](https://github.com/liblaf/api/commit/12061d99e8cd8ddf22331d8981fd24e6a5036d1d))
- add support for organizing imports in biome.jsonc - ([b5780a0](https://github.com/liblaf/api/commit/b5780a02da8d5769c806b0046b4bb873f9296dbe))
- add Telegram bot functionality to the application - ([5cc728f](https://github.com/liblaf/api/commit/5cc728fef2b798ea31d1083acb39ac8b2c822918))
- update dependencies and refactor routes - ([8722e9c](https://github.com/liblaf/api/commit/8722e9caf9b8104f453a8928da60ea77ccef44c1))
- add new endpoint for proxying requests - ([17e63af](https://github.com/liblaf/api/commit/17e63af602df44f980c232ca0a68f6994f7f084b))
- integrate new delay and IP functionality - ([97ee3e2](https://github.com/liblaf/api/commit/97ee3e2f3f16cbd345c76f15a708b612b04eea9c))

### 🐛 Bug Fixes

- **balance:** add new smart group for balancing outbound traffic - ([7f7d1af](https://github.com/liblaf/api/commit/7f7d1af4a50f5e0f2072bad307555cfd283d53db))
- **ci:** update API keys and URLs for improved security - ([af8fe2c](https://github.com/liblaf/api/commit/af8fe2ce0ec28b41ba7c1940a0c731c5ea944874))
- **ci:** update Cloudflare API secrets and variable names - ([0798979](https://github.com/liblaf/api/commit/07989798ae570a09e72dfc2f753b4bdccb990927))
- **convert:** update URLs to sub directory - ([49625af](https://github.com/liblaf/api/commit/49625affde666e89d3bc1de57522ac25818425ed))
- **convert:** update preprocess function for boolean values - ([571c62d](https://github.com/liblaf/api/commit/571c62d772e21211918d83db998c919ceb9b48ae))
- **convert-sing-box:** update default inbounds creation logic - ([3101b11](https://github.com/liblaf/api/commit/3101b118c3cb223dfd106e49a3b14a8a339d2342))
- **convert-sing-box:** update query schema in OpenAPI route - ([0936a86](https://github.com/liblaf/api/commit/0936a862fbfcccccbcccdb078b79c262cb0658f4))
- **delay:** correct default delay value and IP retrieval in delay routes - ([19c82b7](https://github.com/liblaf/api/commit/19c82b77c53679fd4fdea0c70d44aa702d90defc))
- **deploy:** update dependencies and fix color scheme switch logic - ([d551b29](https://github.com/liblaf/api/commit/d551b2966f58d2a17f7b4ac5f2b8e9a7330c94f0))
- **provider:** update Provider structure and fetch functions - ([d846646](https://github.com/liblaf/api/commit/d8466468cc44063245d4443c5283745583d9e178))
- **query.ts:** update default value for ipv6 to false - ([3bafd77](https://github.com/liblaf/api/commit/3bafd777c9a2ce8608bd8bcd5e3a8e1f638d8420))
- **sub:** enable `domain_strategy` - ([a0569f6](https://github.com/liblaf/api/commit/a0569f655ce522dfdb06f6d9d4622348d2e2edfe))
- **types:** correct outbound handling and add missing format field - ([9a57eb3](https://github.com/liblaf/api/commit/9a57eb31407e8d8b4dee5978f6ecbfad754a96f0))
- **types:** update external UI download URL and timestamp setting - ([129d999](https://github.com/liblaf/api/commit/129d9999ee8e6ea83f63fce041813342b5e372d9))
- **types/route:** corrected route rules structure for logical OR mode - ([9838b70](https://github.com/liblaf/api/commit/9838b70ec3cfc951db1d6a1b472c017a5da10b98))
- add KV namespace configuration to wrangler.toml for environment setup - ([fc5d6df](https://github.com/liblaf/api/commit/fc5d6df26fd8637613d4fa20e1f523795cf4475c))
- sanitize template output to prevent injection vulnerabilities - ([279f7b1](https://github.com/liblaf/api/commit/279f7b1b61a2a9b7a2dd88c82ad5bb580e3bd3fc))
- correct DNS server address for iOS preset - ([7619676](https://github.com/liblaf/api/commit/7619676ab7173304bd90075bf0225518766cf3f4))
- disable problematic logical routing rules - ([70952a3](https://github.com/liblaf/api/commit/70952a38aed5295eaf6ed01e055f262963b9a22e))
- correct response handling in route rules - ([d262462](https://github.com/liblaf/api/commit/d262462b700d6baca8d1f7b36f5800395590b879))
- refactor subscription info handling for clarity and maintainability - ([7cdc361](https://github.com/liblaf/api/commit/7cdc36159812e77e0963ec25792f28c9fbc52538))
- correct DNS server address and remove deprecated tun configuration - ([2774699](https://github.com/liblaf/api/commit/2774699814badd5c68b74a226ae824b384ef688f))
- update emoji indicators for record statuses - ([e22c8b1](https://github.com/liblaf/api/commit/e22c8b18efa1167e05b9e41186fa774234edbbed))
- correct inbound property names and apply query presets - ([2f4912b](https://github.com/liblaf/api/commit/2f4912b15d330e3f0f8376d9726955ee524b9dc7))
- improve error response format in error handler - ([e6fc8b3](https://github.com/liblaf/api/commit/e6fc8b37383da55507d7954e54b98e850a36a358))
- simplify DNS configuration and remove unused dependencies - ([f567a69](https://github.com/liblaf/api/commit/f567a6985d5b8a083c4141126a943f4e7eb255b7))
- standardize DNS query keys and improve JSON response formatting - ([4dac886](https://github.com/liblaf/api/commit/4dac88622b9b3f708c2bbc9bda9abdba4c88808c))
- enhance DNS rule logic for CN domain handling - ([cc7f7b8](https://github.com/liblaf/api/commit/cc7f7b83f1a306776fe5180e78d807598bdf7939))
- refine routing logic for direct outbound connections - ([97be38c](https://github.com/liblaf/api/commit/97be38cc75f5d826a58af193283092e306060b16))
- simplify default DNS server assignment using logical OR assignment - ([aa6343f](https://github.com/liblaf/api/commit/aa6343fe73497f6956617d0162428c9045b1f91b))
- refactor DNS configuration and subscription handling - ([1d93739](https://github.com/liblaf/api/commit/1d9373946bb1810ae16d33e7ce3a223f82584ff6))
- disable TCP fast open and multi-path options - ([f5b2c26](https://github.com/liblaf/api/commit/f5b2c2670a30d3b6c28cefcc0fc0714bae1cfed8))
- correct calculation and improve byte formatting - ([57db5e1](https://github.com/liblaf/api/commit/57db5e1e2b8e477aea2855b4d62af725f16b0e37))
- refactor - ([81403c8](https://github.com/liblaf/api/commit/81403c8fba58b02bff2198b9cdfe16ddee325f66))
- correct backend URL to resolve API connectivity issue - ([64439f3](https://github.com/liblaf/api/commit/64439f3f7b2ae1cccb668e3f40434e2a810e277e))
- improve configuration and add new provider - ([06cbdf4](https://github.com/liblaf/api/commit/06cbdf4cccd54d546b0d37cef6b679ce6e5729f1))
- correct country code comparison in filter method - ([2e7222a](https://github.com/liblaf/api/commit/2e7222ae04c512dabbc4dadf1b74b03d316b894e))
- handle undefined tag in outbound message - ([c168f55](https://github.com/liblaf/api/commit/c168f555815eb628a13caf4910e5a178a70b1a96))
- refactor SmartGroup implementations to use classes - ([96aa702](https://github.com/liblaf/api/commit/96aa702270f0c8017c73001af2edcf63da93181a))
- add support for new provider pattern - ([8f63c6c](https://github.com/liblaf/api/commit/8f63c6c5d9b8d71bd1bd0216254c40565461927d))
- correct logic in outbound rate validation - ([b493e95](https://github.com/liblaf/api/commit/b493e950cf194098221c6decff623e138a6f3ada))
- update remote binary URLs to use new file format - ([1ba5e6e](https://github.com/liblaf/api/commit/1ba5e6ef9647e72e33d656526adb9b7d9b894c3e))
- update import references to use uppercase for OUTBOUND_TAG in dns.ts, experimental.ts, outbound.ts, route.ts, shared.ts, convert.ts, group.ts, and query.ts - ([20781ce](https://github.com/liblaf/api/commit/20781ce994ec47b0dae2f169e321bf4b44a3cae3))
- append provider name to outbound tag - ([d56a786](https://github.com/liblaf/api/commit/d56a786d523ee0680ee0d91085150d30481a97c3))
- optimize SmartGroup extensions - ([cef017a](https://github.com/liblaf/api/commit/cef017afc69a1fbc4381ed2a04b8749384c965f2))
- update type in bot index to match changes in info module - ([3e196a0](https://github.com/liblaf/api/commit/3e196a0e1adea922bf155138a32380b39dfc8866))
- improve regex pattern for tag matching - ([370de04](https://github.com/liblaf/api/commit/370de04ec00691bb9af9bcfc905b6469b8f44814))
- refactor OpenAPIHono initialization - ([45c67d2](https://github.com/liblaf/api/commit/45c67d22503a63c0fa9704b17b5e16bc706a9445))
- correct import typo in eslint configuration - ([aef8b10](https://github.com/liblaf/api/commit/aef8b102261063963738c65928876cecd99b0144))
- update OneDrive outbounds array to empty - ([acb298c](https://github.com/liblaf/api/commit/acb298c3247a3d6ccad88a8d3a8c711c351ee436))
- refactor rate inference logic to use isEmby function - ([24c7f4f](https://github.com/liblaf/api/commit/24c7f4f07910e27b56d5b26c6a7583d27dc592ba))
- adjust rate inference logic to handle specific cases - ([57b35e9](https://github.com/liblaf/api/commit/57b35e946a5751c8d395367376cc4bfc3512c686))
- optimize outbounds filtering in Auto and Emby classes - ([4584a91](https://github.com/liblaf/api/commit/4584a915b5079d99167c772a48acfd1e53231f41))
- reorder DNS record processing for correct message generation - ([8ade810](https://github.com/liblaf/api/commit/8ade81075bca60e0e639b65a2846bcf7365bceef))
- remove unnecessary 'geosite:onedrive' entry from default DNS and route configurations - ([9078121](https://github.com/liblaf/api/commit/90781212daa9a4f8c8b906bc9f17deed3fea934a))
- update chat_id parameter type to string in bot send routes - ([1dc7d25](https://github.com/liblaf/api/commit/1dc7d254d1e0dbe16195f39d0f82f80d11134f31))
- refactor bot routes to separate send functionality into its own file - ([4d48a8c](https://github.com/liblaf/api/commit/4d48a8c26d68a70ec143ba3e19d82eb6f3b809b7))
- improve formatting of subscription information - ([1881653](https://github.com/liblaf/api/commit/1881653899ff4d60e4711d1493fb277b6113f0f1))
- improve Markdown formatting in bot replies - ([0f2d6da](https://github.com/liblaf/api/commit/0f2d6dab403c4027c8bcb45d915fa787d50f5be3))
- return message in newBot function to prevent undefined output - ([de83894](https://github.com/liblaf/api/commit/de83894f40ef34ea4fe6493987f31ff19d7a9dce))
- improve message formatting in newBot function - ([3d4e53d](https://github.com/liblaf/api/commit/3d4e53dcd48d20e6c2bab65c9205d1013726bb08))
- ensure correct environment variables are used in bot commands - ([8054180](https://github.com/liblaf/api/commit/80541806cc43af45ad0882534a9793a6db89d0ed))
- update bot command to use async/await for replying with chat ID - ([3475c8a](https://github.com/liblaf/api/commit/3475c8a22fd17f166b4aa4bc50df35c01357e319))
- update compatibility date in wrangler.toml - ([eb8c3c7](https://github.com/liblaf/api/commit/eb8c3c7e3011e8b38af8f1566c5d2579af71e79d))
- update defaultRoute function to include IPv6 parameter - ([ddaffde](https://github.com/liblaf/api/commit/ddaffdee8d3aa75d42a3df858b2b9e54ec574d0d))
- ensure secure HTTP requests by using fetchSafe instead of fetch - ([4e862ea](https://github.com/liblaf/api/commit/4e862ea75930c175b5990f177c6c6233b9c40d2a))
- update backend URL to new version - ([b0f53b8](https://github.com/liblaf/api/commit/b0f53b8174f13cc200b498d65ad8e5ef10557794))
- improve handling of outbound rules and color scheme selection - ([44118cb](https://github.com/liblaf/api/commit/44118cb10d2039924994227d8081844abaa8610c))
- update route summaries for IP and subscription endpoints - ([8849da0](https://github.com/liblaf/api/commit/8849da06a9788d4c69aff4e4c436053e255ee731))
- update route configuration for specific domain suffixes - ([6cb9ee3](https://github.com/liblaf/api/commit/6cb9ee38adbc33ba0c3a56dcf4b0b57f977d3bc1))
- exclude specific countries in AI group selection - ([cd8485e](https://github.com/liblaf/api/commit/cd8485e1a71d140ee556c33fc1fc7a55bca692d6))
- refactor group filtering logic for better performance - ([13dc99e](https://github.com/liblaf/api/commit/13dc99e72fcec5e443b2aa5a7fbb7de669ffc687))
- update URLs and domain suffix for improved routing - ([988480d](https://github.com/liblaf/api/commit/988480d9493e2864a9d1c39a7eb708bef6687df1))
- update regex patterns for country codes - ([87c1d90](https://github.com/liblaf/api/commit/87c1d906b4a2d6701b127e82db585d3ac6b6cfd8))
- update country regex patterns for accurate matching - ([9953fb4](https://github.com/liblaf/api/commit/9953fb499d4b424590586fc164d0e971b440c626))
- update environment variables and refine function parameters - ([d9da604](https://github.com/liblaf/api/commit/d9da60416ebb0bc1b2b1eccdd84b571c5af79b3c))
- corrected URL parameter and data handling in fetchSubConvert - ([e0e3c90](https://github.com/liblaf/api/commit/e0e3c9037c1238a459c952c5b949c96e5ddf8eb7))
- updated country codes and patterns - ([bd0d997](https://github.com/liblaf/api/commit/bd0d997afecb3c1a840ec096bb1fc8c820b0a24a))
- update route summaries for delayed responses - ([9dca2eb](https://github.com/liblaf/api/commit/9dca2eb60bceec1b58eab8fc44d95b9c45630270))

### ⬆️ Dependencies

- **deps:** update dependency @scalar/hono-api-reference to v0.7.4 (#90) - ([3cb265b](https://github.com/liblaf/api/commit/3cb265b26ac52179b99f4ee6e64e28bf7c47aba8))
- **deps:** update dependency @scalar/hono-api-reference to v0.7.3 (#87) - ([3471d4e](https://github.com/liblaf/api/commit/3471d4efdb5580276217bf1c3849f451ec0df653))
- **deps:** update dependency @liblaf/sub-converter to v0.1.4 (#84) - ([2f71004](https://github.com/liblaf/api/commit/2f7100436c59c162d0ea00d65dd6ee6179ebc6d2))
- **deps:** update dependency grammy to v1.35.1 (#85) - ([82a0778](https://github.com/liblaf/api/commit/82a07788f870ba6f143860bddca69222ebf13fd6))
- **deps:** update dependency @scalar/hono-api-reference to ^0.7.0 (#77) - ([57b86b9](https://github.com/liblaf/api/commit/57b86b9b75700c1c068c77bb8c6f64380f156c21))
- **deps:** update dependency hono to v4.7.5 (#80) - ([86c2468](https://github.com/liblaf/api/commit/86c24688fd1c4c2a3b7ad4d137bf3e05983ab178))
- **deps:** update dependency ua-parser-js to v2.0.3 (#79) - ([b1a5f03](https://github.com/liblaf/api/commit/b1a5f038a1d8d6a2a7e9c59220418c852fc11bac))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.181 (#73) - ([37ae525](https://github.com/liblaf/api/commit/37ae52509447c471cc89831b0298b3603825477b))
- **deps:** update dependency hono to v4.7.4 (#71) - ([76eac92](https://github.com/liblaf/api/commit/76eac92ec0fe58bfaec448cd9dae4e5a6424d1b3))
- **deps:** update dependency @liblaf/sub-converter to v0.1.3 (#67) - ([4a481f9](https://github.com/liblaf/api/commit/4a481f945d4137d50905d7fff5b1971ccf89674a))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.180 (#68) - ([ede5e2e](https://github.com/liblaf/api/commit/ede5e2e9e1ce1f3c44e3676b4a41b580eaba46c5))
- **deps:** update dependency @liblaf/sub-converter to ^0.1.0 (#65) - ([a3117b0](https://github.com/liblaf/api/commit/a3117b0007b52fe0ada695188e96a1d2dbfc0dcb))
- **deps:** update dependency @hono/zod-openapi to v0.19.2 (#64) - ([eb44877](https://github.com/liblaf/api/commit/eb4487745903b2f2debe6be28b62d35418bd6952))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.178 (#66) - ([c4df2c6](https://github.com/liblaf/api/commit/c4df2c6ce9ab8a263f2df75f0ebe5441c55598e6))
- **deps:** update dependency @hono/zod-openapi to ^0.19.0 (#62) - ([e41a5f3](https://github.com/liblaf/api/commit/e41a5f38d18471b43ce29f9b545a71802b3e6086))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.177 (#63) - ([96e9853](https://github.com/liblaf/api/commit/96e9853768daf4a052dacb5bab3f275cfcce3367))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.175 (#58) - ([4ac5033](https://github.com/liblaf/api/commit/4ac50334aae55beb375942c1036a9ac38f51d469))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.174 (#55) - ([49b856d](https://github.com/liblaf/api/commit/49b856d74fdfbc88c3ad566586a055fabbde152c))
- **deps:** update dependency hono to v4.7.2 (#57) - ([5b97d75](https://github.com/liblaf/api/commit/5b97d752f2b60f48c8048a4236d5cab7114ff2e6))
- **deps:** update dependency hono to v4.7.1 (#51) - ([be17667](https://github.com/liblaf/api/commit/be17667a721088be48e9be590c73e40790dd5c3f))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.173 (#50) - ([c6ce9da](https://github.com/liblaf/api/commit/c6ce9da52a304136af179b0e45226a2b87a309b4))
- **deps:** update dependency grammy to v1.35.0 (#49) - ([da4f8b7](https://github.com/liblaf/api/commit/da4f8b775171ca5cf8c437e20e26171f1e4763b0))
- **deps:** update dependency zod to v3.24.2 (#48) - ([5d62f81](https://github.com/liblaf/api/commit/5d62f81922d68681085e96fc7faa68dfec129c07))
- **deps:** update dependency @liblaf/sub-converter to ^0.0.17 (#45) - ([ce704da](https://github.com/liblaf/api/commit/ce704da6b001f12fe4438d6cd65a9a5a2bc996b1))
- **deps:** update dependency ua-parser-js to v2.0.2 (#46) - ([62018d9](https://github.com/liblaf/api/commit/62018d942d6d06282fbfb5cdb3056c0d52d8d12d))
- **deps:** update dependency hono to v4.7.0 (#44) - ([b3049a1](https://github.com/liblaf/api/commit/b3049a1b18e12b986bae82098f73f9d6dba4e070))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.172 (#43) - ([37efe16](https://github.com/liblaf/api/commit/37efe164f4779981191f433fc8faf7d65f31fc4c))
- **deps:** update dependency object-inspect to v1.13.4 (#42) - ([f08b896](https://github.com/liblaf/api/commit/f08b8960703f387a59af413f01a642345c543425))
- **deps:** update dependency @liblaf/sub-converter to ^0.0.16 (#36) - ([9b6c85f](https://github.com/liblaf/api/commit/9b6c85f817b3cfa8eb0de31c2decc112ff661a70))
- **deps:** update dependency @hono/zod-openapi to v0.18.4 (#37) - ([c58a510](https://github.com/liblaf/api/commit/c58a510a0dc324487ecef9f61b773d932d53f3a5))
- **deps:** update dependency ua-parser-js to v2.0.1 (#39) - ([638bc8a](https://github.com/liblaf/api/commit/638bc8ae72fc9a2a9e22e7a8b14fe0b889afdc8e))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.171 (#40) - ([e7142b4](https://github.com/liblaf/api/commit/e7142b495cb5bf8a735dc0e404a20ad043f22bd3))
- **deps:** update dependency hono to v4.6.20 (#33) - ([886b10f](https://github.com/liblaf/api/commit/886b10f7f7779f4d957ee221d73b755ee465a223))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.170 (#31) - ([3f8a824](https://github.com/liblaf/api/commit/3f8a82432a84d75558387f6f30133dda69c7677a))
- **deps:** update dependency hono to v4.6.19 (#23) - ([edf9c7b](https://github.com/liblaf/api/commit/edf9c7b3c15af023a953e77d9718e695229f4cb8))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.169 (#27) - ([8525aa1](https://github.com/liblaf/api/commit/8525aa18a7d2008d275f1b5abf5eea6c55299f2e))
- **deps:** update dependency grammy to v1.34.1 (#28) - ([9a3fe63](https://github.com/liblaf/api/commit/9a3fe637e68b5e5dfa3bcbdc1e2ba0ba207c7b53))
- **deps:** update dependency @liblaf/sub-converter to ^0.0.15 (#25) - ([1b66121](https://github.com/liblaf/api/commit/1b6612131cc9bb6a0939fa6935bbd3b2212ab593))
- **deps:** update dependency grammy to v1.34.0 (#24) - ([6f38716](https://github.com/liblaf/api/commit/6f387164543c4ed2e94188e779795841ff63313f))
- **deps:** update dependency @scalar/hono-api-reference to v0.5.168 (#22) - ([e1449da](https://github.com/liblaf/api/commit/e1449da59e06c4a4fd59febdb325f37601f00e5d))
- **deps:** update dependency date-fns to v4 - ([917dcef](https://github.com/liblaf/api/commit/917dcef43ab8e7ce3feee60858a439bfe78fc205))
- **deps:** update dependency @hono/zod-openapi to ^0.16.0 - ([60c96a2](https://github.com/liblaf/api/commit/60c96a2240ff89c168e949eacf2038dcc4b85c57))
- **deps:** update dependency @hono/zod-openapi to ^0.15.0 - ([f2b36cd](https://github.com/liblaf/api/commit/f2b36cd7883eb79d27fbf8bc1bc994ae73e93804))
- **deps:** update dependency @hono/zod-openapi to ^0.14.0 - ([9969a38](https://github.com/liblaf/api/commit/9969a382d4b1d069e10830d6e9bf8c73885d7870))
- **deps:** update dependency and fix Chinese text conversion - ([bd722d8](https://github.com/liblaf/api/commit/bd722d8049232d806de4c3d8e1e2c34fe6be9806))
- **deps:** update dependencies and fix IP handling - ([2111c3b](https://github.com/liblaf/api/commit/2111c3bdc61534af3d0b4768d778f8a5741d8854))

### 📝 Documentation

- add link to detailed API documentation - ([6755219](https://github.com/liblaf/api/commit/675521901505df753b24c21a6c8a5179f3a3b054))
- update README with new API endpoints - ([f415e22](https://github.com/liblaf/api/commit/f415e22ee480765c2f205a3331641814e02eec7d))
- update README with API status badges - ([d2b8e83](https://github.com/liblaf/api/commit/d2b8e83a5439cd531642d4359ef3cd1a3732cc90))
- update summary in appSubInfo.openapi route - ([9d3e3aa](https://github.com/liblaf/api/commit/9d3e3aa012db28dd152f1452091baa49906ddd17))

### 💄 Styles

- standardize indentation and formatting across the codebase - ([ab03f24](https://github.com/liblaf/api/commit/ab03f248468692d4653ebbfd03000a6b1afd3815))
- fix typo in tsconfig.json - ([44b3ff7](https://github.com/liblaf/api/commit/44b3ff7093241b7922cc492643d39d84dc9286c2))

### ♻ Code Refactoring

- consolidate profile fetching logic - ([1a2e43a](https://github.com/liblaf/api/commit/1a2e43a82e95db844ae3d88211af7e68d588b099))
- simplify subscription handling logic - ([6c5a46a](https://github.com/liblaf/api/commit/6c5a46ac0b5af2cac7f7261db3d5e80a6c45d487))
- improve error handling and add asset route - ([654358a](https://github.com/liblaf/api/commit/654358a794edaf6efb12e12f4813f0a91c598ef2))
- reorganize project structure and update dependencies - ([d383b4f](https://github.com/liblaf/api/commit/d383b4fc3ebe1245397f9acbb00f62c7114d37b1))
- comment out ad blocking rule in route configuration - ([26230ef](https://github.com/liblaf/api/commit/26230ef699ba98467842233b84d5ff40c7bc44da))
- reorganize code structure for clarity and maintainability - ([681e754](https://github.com/liblaf/api/commit/681e754308541acf3516971fe904a38f24a7c85a))

### 🔧 Continuous Integration

- **pre-commit:** auto fixes from pre-commit hooks - ([3b4af92](https://github.com/liblaf/api/commit/3b4af922f0489250eba440eb9cc550cd069e2897))
- remove unused deployment workflow - ([0a6e00f](https://github.com/liblaf/api/commit/0a6e00f000a962e9021e200d59e25f56e850e7cd))
- remove secrets - ([e04f756](https://github.com/liblaf/api/commit/e04f75645130497703aeec5bcbfc293be14b8b3c))
- update environment variables in CI workflow - ([c90f64c](https://github.com/liblaf/api/commit/c90f64c19a585acdd2642ed8a7b6fea1f9e16170))
- update CI workflow to include additional secrets - ([e371cf0](https://github.com/liblaf/api/commit/e371cf00ccc6bbec54ed72fa1c42d4dfa19f1a65))
- update CI workflow to deploy using Cloudflare Wrangler - ([550497c](https://github.com/liblaf/api/commit/550497c2bca8991f29a8f8fd7341e4f6dd906262))

### ❤️ New Contributors

- [@liblaf-bot[bot]](https://github.com/apps/liblaf-bot) made their first contribution in [#101](https://github.com/liblaf/api/pull/101)
- [@liblaf](https://github.com/liblaf) made their first contribution
- [@renovate[bot]](https://github.com/apps/renovate) made their first contribution in [#88](https://github.com/liblaf/api/pull/88)
- [@pre-commit-ci[bot]](https://github.com/apps/pre-commit-ci) made their first contribution in [#4](https://github.com/liblaf/api/pull/4)
