const backendSDK = require("../amazonPay/PWAINBackendSDK");
const Joi = require("@hapi/joi");
const secretKeys = require("../../constants");

var config = {
  merchant_id: secretKeys.merchantId,
  access_key: secretKeys.accessKey,
  secret_key: secretKeys.secretKey,
  base_url: "amazonpay.amazon.in",
};
var client = new backendSDK(config);

var returnUrl = secretKeys.returnURL;

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: async () => {
      return "Home Page";
    },
  },
  {
    method: "GET",
    path: "/pay",
    options: {
      validate: {
        query: Joi.object({
          sellerOrderId: Joi.string(),
          orderTotalAmount: Joi.string(),
          orderTotalCurrencyCode: Joi.string(),
          transactionTimeout: Joi.string(),
          isSandbox: Joi.bool(),
        }),
      },
      handler: async (request, h) => {
        let requestParameters = {};

        // This is just to get rid of prototype null of the object
        Object.keys(request.query).forEach((key) => {
          requestParameters[key] = request.query[key];
        });

        var amazonPayPaymentUrl = client.getProcessPaymentUrl(
          requestParameters,
          returnUrl
        );
        return "https://" + amazonPayPaymentUrl;
      },
    },
  },
  {
    method: "GET",
    path: "/verifySignature",
    options: {
      validate: {
        query: Joi.object({
          signature: Joi.string(),
          orderTotalAmount: Joi.string(),
          sellerOrderId: Joi.string(),
          orderTotalCurrencyCode: Joi.string(),
          amazonOrderId: Joi.string(),
          reasonCode: Joi.string(),
          description: Joi.string(),
          transactionDate: Joi.string(),
          status: Joi.string(),
        }),
      },
      handler: async (request) => {
        var responseMap = {};
        // const X =
        //   "orderTotalCurrencyCode=INR&orderTotalAmount=1.00&signature=0ULzrSuhOtDlg9j%2BnfBU5IWMb8iZJE1%2F0Ry8TwqPnxM%3D&amazonOrderId=S04%2D6451840%2D7094681&description=Txn%20Success&reasonCode=001&transactionDate=1603709436697&sellerOrderId=1234532413489&status=SUCCESS";

        Object.keys(request.query).map((key) => {
          responseMap[key] = request.query[key];
        });
        const response = client.verifySignature(responseMap);
        console.log(response);
        return "Ok";
      },
    },
  },
  {
    method: "GET",
    path: "/listOrderRef",
    handler: async () => {
      let res = "Ok";
      const days7Back = new Date(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      );
      const days7Forward = new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      );
      var requestParameters = {};
      requestParameters["queryId"] = "12121";
      requestParameters["startTime"] = days7Back.toISOString();
      requestParameters["endTime"] = days7Forward.toISOString();

      client.listOrderReference(requestParameters, (response) => {
        console.log(response);
        res = JSON.stringify(response);
      });
      return "Ok";
    },
  },
];
