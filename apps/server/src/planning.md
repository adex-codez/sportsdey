# palmpay value added services

## Query biller 
This is used to get information about biller so that you users can now what they can do

``` 
  Query Biller
  Request Path
  [POST] /api/v2/bill-payment/biller/query
  Copy to clipboardErrorCopied
  Parameter List
  Name	Type	Length	Required	Description
  sceneCode	String	-	Yes	Business scenario code【see detailed scenario codes】
  Return Values
  Name	Type	Length	Required	Description
  billerId	String	32	Yes	Operator ID
  billerName	String	32	Yes	Operator Name
  billerIcon	String	200	Yes	Operator Icon
  minAmount	Long	-	No	Minimum recharge amount for operator
  maxAmount	Long	-	No	Maximum recharge amount for operator
  status	Integer	-	No	Status: 0 - Unavailable, 1 - Available
  Postman Request Example
  request
  curl --location 'https://open-gw-daily.palmpay-inc.com/api/v2/bill-payment/biller/query' \
  --header 'Accept: application/json, text/plain, */*' \
  --header 'CountryCode: NG' \
  --header 'Authorization: Bearer 10241024' \
  --header 'Signature: D11A3E8CB478C0B0F40276DDA5AFD898' \
  --header 'Content-Type: application/json' \
  --data '{"requestTime":1713924173005,"nonceStr":"iWiRXn6ecx3ERxieekjTeBmXsRRE6D5E","version":"V2","sceneCode":"airtime"}'
  Copy to clipboardErrorCopied
  response
  {
    "respCode": "00000000",
    "respMsg": "success",
    "data": [
      {
        "billerId": "MTN",
        "billerName": "MTN",
        "billerIcon": "https:/xxx/MTN.png",
        "minAmount": 100,
        "maxAmount": 100000,
        "status": 1
      }
    ],
    "status": true
  }
  Copy to clipboardErrorCopied
  Common Error Codes
  Please refer to the document
  
  Business Error Codes
  Error Code	Error Description	Solution
  SBP.INVALID_PARAMETER	Invalid parameter	Check the request parameters and resend after making corrections
  SBP.INVALID_SCENE_CODE	Invalid scenario code	Check the scenario code and resend after making correctio
  
```

this is what scene code is 
```
  SceneCode
  Value	Description
  airtime	Airtime top-up
  data	Databundle top-up
  betting	Betting top-up
```


### Query
This shows packages under networks for airtime and data
```
  Query Item
  Request Path
  [POST] /api/v2/bill-payment/item/query
  Copy to clipboardErrorCopied
  Parameter List
  Name	Type	Length	Required	Description
  sceneCode	String	-	Yes	Business scenario code【see detailed scenario codes】
  billerId	String	32	Yes	Operator ID
  Return Values
  Name	Type	Length	Required	Description
  billerId	String	32	Yes	Carrier ID
  itemId	String	32	Yes	Package ID
  itemName	String	32	Yes	Package Name
  amount	Long	-	No	Package Amount
  minAmount	Long	-	No	Minimum Recharge Amount
  maxAmount	Long	-	No	Maximum Recharge Amount
  isFixAmount	Integer	-	No	Fixed Amount Flag 0-Non-fixed Amount 1-Fixed Amount
  status	Integer	-	No	Status 0:Unavailable 1:Available
  extInfo	Object	-	No	Extended Parameters
  ExtInfo Object Fields	Type	Length	Required	Description
  validityDate	Long	32	No	Package Validity Days
  itemSize	String	32	No	Package Size
  itemDescription	Map	-	No	Package Usage Instructions
  Postman Request Example
  request
  curl --location 'https://open-gw-daily.palmpay-inc.com/api/v2/bill-payment/item/query' \
  --header 'Accept: application/json, text/plain, */*' \
  --header 'CountryCode: NG' \
  --header 'Authorization: Bearer 10241024' \
  --header 'Signature: D11A3E8CB478C0B0F40276DDA5AFD898' \
  --header 'Content-Type: application/json' \
  --data '{"requestTime":1713924195586,"nonceStr":"6brpMN6ekD2kxZb2Xz7XQehadenFn8d3","version":"V2","billerId":"MTN","sceneCode":"airtime"}'
  Copy to clipboardErrorCopied
  response
  {
    "respCode": "00000000",
    "respMsg": "success",
    "data": [
      {
        "billerId": "MTN",
        "itemId": "5267001812",
        "itemName": "MTN Adaptable Amount",
        "amount": 10000,
        "maxAmount": null,
        "minAmount": null,
        "isFixAmount": 0,
        "status": 1
      }
    ]
  }
  Copy to clipboardErrorCopied
  Common Error Codes
  Please refer to the document
  
  Business Error Codes
  Error Code	Error Description	Solution
  SBP.INVALID_PARAMETER	Invalid parameter	Check the request parameters and resend after making corrections
  SBP.INVALID_SCENE_CODE	Invalid scenario code	Check the scenario code and resend after making corrections
  SBP.BILLER_DISABLE	Operator unavailable	Check if the Operator ID is correct or if the Operator status is available
```

## creating orders 
This allows users to pay for airtime or data

```
  Create Order
  Request Path
  [POST] /api/v2/bill-payment/order/create
  Copy to clipboardErrorCopied
  Parameter List
  Parameter List
  Name	Type	Length	Required	Description
  sceneCode	String	-	Yes	Business scenario code【see detailed scenario codes】
  outOrderNo	String	64	Yes	Merchant order number, customized by the merchant, up to 32 characters, supports letters, numbers, underscores, and must be unique within the merchant system
  amount	Long	-	Yes	Total order amount (unit: cents)
  notifyUrl	String	200	Yes	Payment notification callback URL
  billerId	String	32	Yes	Operator ID
  itemId	String	32	Yes	Package ID
  rechargeAccount	String	15	Yes	Recharge account (fill in the phone number)
  title	String	50	No	Order title
  description	String	200	No	Order description
  relationId	String	64	No	User-defined associated ID
  Return Values
  Name	Type	Length	Required	Description
  outOrderNo	String	64	Yes	Merchant order number
  orderNo	String	32	Yes	PalmPay platform order number
  orderStatus	Integer	2	Yes	Order status (see detailed order status)
  msg	String	8	No	Status description
  amount	Long	-	Yes	Total order amount (unit: cents)
  sceneCode	String	-	Yes	Business scenario code (see detailed scenario codes)
  Postman Request Example
  request
  curl --location 'https://open-gw-daily.palmpay-inc.com/api/v2/bill-payment/order/create' \
  --header 'Accept: application/json, text/plain, */*' \
  --header 'CountryCode: NG' \
  --header 'Authorization: Bearer 10241024' \
  --header 'Signature: D11A3E8CB478C0B0F40276DDA5AFD898' \
  --header 'Content-Type: application/json' \
  --data '{
      "requestTime": 1713943883031,
      "nonceStr": "w7WDWFze8rfBcy25yb6pXbFf7XirM2DK",
      "version": "V2",
      "outOrderNo": "MKiPaeQWMk2drrQrBBd6WPtx8wP8aNjx",
      "sceneCode": "airtime",
      "billerId": "MTN",
      "itemId": "5267001812000",
      "rechargeAccount": "023409551234900",
      "relationId": "isRXw8r68PsQmkSrJJJAtcSrDSCTWPyE",
      "amount": 10000,
      "notifyUrl": "http://xxx.cn"
  }'
  Copy to clipboardErrorCopied
  response
  {
    "respCode": "00000000",
    "respMsg": "success",
    "data": {
      "outOrderNo": "P86iMr6AGr2Mzx84QnNP3HC636pFcA10",
      "orderNo": "y421t3k8000",
      "orderStatus": 1,
      "msg": "SUCCESS",
      "amount": 8800,
      "sceneCode": "airtime"
    }
  }
  Copy to clipboardErrorCopied
  Common Error Codes
  Please refer to the document
  
  Business Error Codes
  Error Code	Error Description	Solution
  SBP.INVALID_PARAMETER	Invalid parameter	Check the request parameters and resend after making corrections
  SBP.INVALID_SCENE_CODE	Invalid scenario code	Check the scenario code and resend after making corrections
  SBP.BILLER_DISABLE	Operator unavailable	Check if the Operator ID is correct or if the Operator status is available
  SBP.ITEM_DISABLE	Item unavailable	Check if the Item ID is correct or if the Operator status is available
  SBP.BILLER_ITEM_MISMATCH	Operator and package mismatch	Check if the Operator ID matches with the Package ID
  SBP.AMOUNT_ABOVE_MAX_LIMIT	Recharge amount above maximum limit	Ensure the recharge amount is below the maximum amount
  SBP.AMOUNT_BELOW_MIN_LIMIT	Recharge amount below minimum limit	Ensure the recharge amount is above the minimum amount
  SBP.AMOUNT_MISMATCH	Recharge amount does not match the item amount	Ensure the recharge amount matches the fixed amount of the item if applicable
  SBP.MERCHANT_ERROR	Merchant error	Check if the merchant is operating normally
  SBP.MERCHANT_ACCOUNT_ERROR	Merchant account error	Check if the merchant account status is normal
  SBP.MERCHANT_ACCOUNT_STATUS_ERROR	Merchant account status error	Check if the merchant account status is normal
  SBP.MERCHANT_ACCOUNT_BALANCE_NOT_ENOUGH	Merchant account balance insufficient	Ensure the merchant account has sufficient balance
  SBP.TRADE_HAD_DEAL	External merchant order number duplicate	Check the transaction number provided and resend after making corrections 求
```
