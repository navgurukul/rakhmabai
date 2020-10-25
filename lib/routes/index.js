const backendSDK = require("../amazonPay/PWAINBackendSDK");
const Joi = require("@hapi/joi");

var config = {
  merchant_id: "AZ4WQCLDT2DF0",
  access_key: "AKIAJAKG6LME27HVCD3A",
  secret_key: "mMMy7b5lyLidQAoYFI+FUmlNgBuFSlBJkNyK+Xig",
  base_url: "amazonpay.amazon.in",
};
var client = new backendSDK(config);

var returnUrl = "https://YOUR_THANKYOU_PAGE_URL";

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
        return h.redirect("https://" + amazonPayPaymentUrl);
      },
    },
  },
  {
    method: "GET",
    path: "/verifySignature",
    handler: async (request) => {
      var responseMap = {};
      console.log(requestParameters);
      for (let propName in requestParameters) {
        responseMap[propName] = requestParameters[propName];
      }
      const response = client.verifySignature(responseMap);
      console.log(response);
      return "Ok";
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
