"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  MoMoClient: () => MoMoClient
});
module.exports = __toCommonJS(src_exports);

// src/momoClient.ts
var import_axios = __toESM(require("axios"));
var import_uuid = require("uuid");
var import_buffer = require("buffer");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var MoMoClient = class {
  constructor(config) {
    this.apiUserId = config.apiUserId;
    this.apiKey = config.apiKey;
    this.primaryKey = config.primaryKey;
    this.environment = config.environment || "sandbox";
    this.baseUrl = `https://${this.environment === "sandbox" ? "sandbox" : "api"}.momodeveloper.mtn.com`;
  }
  async getAuthToken() {
    try {
      const response = await import_axios.default.post(`${this.baseUrl}/collection/token/`, null, {
        headers: {
          "Authorization": `Basic ${import_buffer.Buffer.from(`${this.apiUserId}:${this.apiKey}`).toString("base64")}`,
          "Ocp-Apim-Subscription-Key": this.primaryKey
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Error getting auth token:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
  async requestPayment(payment) {
    const referenceId = (0, import_uuid.v4)();
    try {
      const authToken = await this.getAuthToken();
      await import_axios.default.post(
        `${this.baseUrl}/collection/v1_0/requesttopay`,
        {
          amount: payment.amount,
          currency: "EUR",
          externalId: "1234560096",
          payer: {
            partyIdType: "MSISDN",
            partyId: payment.phoneNumber
          }
        },
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "X-Reference-Id": referenceId,
            "X-Target-Environment": this.environment,
            "Ocp-Apim-Subscription-Key": this.primaryKey
          }
        }
      );
      return { referenceId };
    } catch (error) {
      console.error("Error requesting payment:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
  async getPaymentStatus(referenceId) {
    try {
      const authToken = await this.getAuthToken();
      const response = await import_axios.default.get(
        `${this.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Ocp-Apim-Subscription-Key": this.primaryKey,
            "X-Target-Environment": this.environment
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting transaction status:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MoMoClient
});
