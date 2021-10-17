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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var xumm_sdk_1 = require("xumm-sdk");
var ripple_lib_1 = require("ripple-lib");
var port = process.env.PORT || 3000;
var app = (0, express_1.default)();
app.use(express_1.default.json({
    type: ['application/json', 'text/plain'] // to support JSON-encoded bodies
}));
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '/build')));
var sdk = new xumm_sdk_1.XummSdk('da844f69-2220-4fe7-b609-4f671d3fc6ed', '3df2966a-46f3-4f03-bdfc-62613aa698dc');
var pingXumm = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ping;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sdk.ping()];
            case 1:
                ping = _a.sent();
                console.log("ping Xumm : " + JSON.stringify(ping));
                return [2 /*return*/];
        }
    });
}); };
pingXumm();
var api = new ripple_lib_1.RippleAPI({
    server: 'wss://xrplcluster.com' // Public cluster
});
var getCuratedAssets = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sdk.getCuratedAssets()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var createPayloadTransaction = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sdk.payload.create(payload, true)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var curatedAssetsResponse;
getCuratedAssets().then(function (res) {
    curatedAssetsResponse = res;
})
    .catch(function (ex) {
    console.log("Received an exception when calling Curated Assets API: " + ex);
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var count = 1;
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "/build", "index.html"));
    // res.sendFile(path.resolve('./index.html'));
});
app.get('/api/curatedAssets', function (req, res) {
    getCuratedAssets().then(function (resp) {
        res.json(resp);
    })
        .catch(function (ex) {
        console.log("Received an exception: " + ex);
    });
});
app.get('/api/issuers', function (req, res) {
    console.log('api/issuers called!');
    res.json(curatedAssetsResponse.issuers);
});
app.get('/api/issuers/:issuer/currencies', function (req, res) {
    var issuer = req.params.issuer;
    console.log("api/issuers/" + issuer + "/currencies called!");
    var currencies = curatedAssetsResponse.details[issuer].currencies;
    ;
    res.json(currencies);
});
app.post('/api/signTransaction', function (req, res) {
    console.log("api/signTransaction called!");
    console.log("Got body: ", req.body);
    var payload = {
        "Account": "rHwNMXJ2RpbzLi3M1ZXq3NyG3KC3vTDbR5",
        "Fee": "15000",
        "TransactionType": "TrustSet",
        "LimitAmount": {
            "currency": req.body.currency,
            "issuer": req.body.issuer,
            "value": "10"
        },
        "Flags": 131072
    };
    console.log("Sending payload request", payload);
    createPayloadTransaction(payload)
        .then(function (resp) {
        console.log("create trustset Payload response", resp);
        res.json(resp);
    })
        .catch(function (ex) {
        console.log("Received exception when creating payload", ex);
        res.status(500).json(ex);
    });
});
app.get('/api/count', function (req, res) {
    console.log('api/count called!');
    res.json(count++);
});
app.listen(port, function () {
    console.log("Now listening on port " + port);
});
var noImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
app.get('/api/obligations/:issuer', function (req, res) {
    var issuer = req.params.issuer;
    console.log("/api/obligations/" + issuer + " called!");
    api.connect().then(function () {
        api.getBalanceSheet(issuer)
            .then(function (resp) {
            var _a;
            console.log("Balance Sheet", JSON.stringify(resp));
            var currencyMap = new Map();
            (_a = resp.obligations) === null || _a === void 0 ? void 0 : _a.forEach(function (value) {
                currencyMap.set(value.currency, {
                    currency: value.currency,
                    name: value.currency,
                    avatar: noImageUrl
                });
            });
            res.json(Object.fromEntries(currencyMap.entries()));
        })
            .catch(function (ex) {
            console.error("Caught exception when getting balance sheet", ex);
            res.send(ex);
        })
            .finally(function () {
            api.disconnect();
        });
    });
});
api.on('error', function (errorCode, errorMessage) {
    console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', function () {
    console.log('connected');
});
api.on('disconnected', function (code) {
    // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
    // the code is 1000 for a normal closure
    console.log('disconnected, code:', code);
});
//# sourceMappingURL=index.js.map