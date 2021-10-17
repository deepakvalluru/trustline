import express, { response } from 'express';
import path from 'path';
import {XummSdk, XummTypes} from 'xumm-sdk';
import { ApplicationDetails, CuratedAssetsResponse, XummJsonTransaction, XrplTransactionType } from 'xumm-sdk/dist/src/types';
import { RippleAPI } from 'ripple-lib';

type currencyObj = {
    id?: number;
    issuer_id?: number;
    currency: string;
    name: string;
    avatar?: string;
    shortlist?: number;
};

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json({
  type: ['application/json', 'text/plain']        // to support JSON-encoded bodies
}))
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(path.join(__dirname, '/build')));

const sdk = new XummSdk('da844f69-2220-4fe7-b609-4f671d3fc6ed', '3df2966a-46f3-4f03-bdfc-62613aa698dc');
const pingXumm = async() => {
  const ping : ApplicationDetails = await sdk.ping();
  console.log("ping Xumm : " + JSON.stringify(ping));
}
  
pingXumm();

const api = new RippleAPI({
    server: 'wss://xrplcluster.com' // Public cluster
});

const getCuratedAssets = async() => {
  return await sdk.getCuratedAssets();
}

const createPayloadTransaction = async(payload : XummJsonTransaction) => {
  return await sdk.payload.create(payload, true);
}

var curatedAssetsResponse: CuratedAssetsResponse;

getCuratedAssets().then(res => {
  curatedAssetsResponse = res;
})
.catch(ex => {
  console.log("Received an exception when calling Curated Assets API: " + ex);
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var count = 1;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/build", "index.html"));
    // res.sendFile(path.resolve('./index.html'));
});

app.get('/api/curatedAssets', (req, res) => {
  getCuratedAssets().then(resp => {
    res.json(resp);
  })
  .catch(ex => {
    console.log("Received an exception: " + ex);   
  }) 
})

app.get('/api/issuers', (req, res) => {
  console.log('api/issuers called!');
  res.json(curatedAssetsResponse.issuers);
});

app.get('/api/issuers/:issuer/currencies', (req, res) => {
  const issuer = req.params.issuer;
  console.log(`api/issuers/${issuer}/currencies called!`);
  let currencies = curatedAssetsResponse.details[issuer].currencies;;
  res.json(currencies);
});

app.post('/api/signTransaction', (req, res) => {
  console.log(`api/signTransaction called!`);
  console.log("Got body: ", req.body);
  
  const payload = {
    "Account": "rHwNMXJ2RpbzLi3M1ZXq3NyG3KC3vTDbR5",
    "Fee": "15000",
    "TransactionType": "TrustSet" as XrplTransactionType,
    "LimitAmount": {
        "currency": req.body.currency,
        "issuer": req.body.issuer,
        "value": "10"
    },
    "Flags": 131072
  }

  console.log("Sending payload request", payload )

  createPayloadTransaction(payload)
  .then(resp => {
    console.log("create trustset Payload response", resp);
    res.json(resp);
  })
  .catch(ex => {
    console.log("Received exception when creating payload", ex);
    res.status(500).json(ex);
  })
  
})

app.get('/api/count', (req, res) => {
    console.log('api/count called!')
    res.json(count++);
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
})

const noImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";

app.get('/api/obligations/:issuer', (req, res) => {
    const issuer = req.params.issuer;
    console.log(`/api/obligations/${issuer} called!`);
    api.connect().then(() => {
        api.getBalanceSheet(issuer)
        .then(resp => {
            console.log("Balance Sheet", JSON.stringify(resp));

            let currencyMap : Map<string,currencyObj> = new Map<string, currencyObj>();
            resp.obligations?.forEach(value => {
                currencyMap.set(value.currency, {
                    currency: value.currency,
                    name: value.currency,
                    avatar: noImageUrl
                })
            })

            res.json(Object.fromEntries(currencyMap.entries()));            
        })
        .catch( ex => {
            console.error("Caught exception when getting balance sheet", ex);
            res.send(ex);
        })
        .finally( () => {
            api.disconnect();
        })
    });
});

api.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
    console.log('connected');
});
api.on('disconnected', (code) => {
    // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
    // the code is 1000 for a normal closure
    console.log('disconnected, code:', code);
});
