"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var hardhat_1 = require("hardhat");
var name = "OpenAiSimpleLLM";
var i = 0;
var br = function () {
    console.log("#br ".concat(i++));
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var oracleAddress, agent, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                br();
                if (!process.env.ORACLE_ADDRESS) {
                    throw new Error("ORACLE_ADDRESS env variable is not set.");
                }
                br();
                oracleAddress = process.env.ORACLE_ADDRESS;
                br();
                return [4 /*yield*/, hardhat_1.ethers.deployContract(name, [oracleAddress], {})];
            case 1:
                agent = _a.sent();
                br();
                return [4 /*yield*/, agent.waitForDeployment()];
            case 2:
                _a.sent();
                br();
                console.log("".concat(name, " contract deployed to ").concat(agent.target));
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error("ERROR: ", e_1);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
// async function main() {
//   if (!process.env.ORACLE_ADDRESS) {
//     throw new Error("ORACLE_ADDRESS env variable is not set.");
//   }
//   const oracleAddress: string = process.env.ORACLE_ADDRESS;
//   console.log("#br0");
//   try {
//     await deployContractByName(oracleAddress, "OpenAiSimpleLLM");
//   } catch (error) {
//     console.error("Error deploying contract:", error);
//   }
//   console.log("#br1");
// }
// async function deployContractByName(oracleAddress: string, name: string) {
//   const agent = await ethers.deployContract(name, [oracleAddress], {});
//   await agent.waitForDeployment();
//   console.log(`${name} contract deployed to ${agent.target}`);
// }
// (async () => {
//   await main().catch(e => {
//   console.error(e);
//   process.exitCode = 1;
//   })
// })();
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
