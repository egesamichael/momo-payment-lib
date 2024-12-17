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
    this.collectionKey = config.collectionKey;
    this.remittanceKey = config.remittanceKey;
    this.environment = config.environment || "sandbox";
    this.baseUrl = `https://${this.environment === "sandbox" ? "sandbox" : "api"}.momodeveloper.mtn.com`;
  }
  async getAuthToken(primaryKey) {
    try {
      const response = await import_axios.default.post(`${this.baseUrl}/token/`, null, {
        headers: {
          "Authorization": `Basic ${import_buffer.Buffer.from(`${this.apiUserId}:${this.apiKey}`).toString("base64")}`,
          "Ocp-Apim-Subscription-Key": primaryKey
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Error getting auth token:", error.response?.data || error.message);
      throw error;
    }
  }
  async requestPayment(payment) {
    if (!this.collectionKey) throw new Error("Collection key is required for payments.");
    const referenceId = (0, import_uuid.v4)();
    const authToken = await this.getAuthToken(this.collectionKey);
    try {
      await import_axios.default.post(
        `${this.baseUrl}/collection/v1_0/requesttopay`,
        {
          amount: payment.amount,
          currency: payment.currency,
          externalId: payment.refrence,
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
            "Ocp-Apim-Subscription-Key": this.collectionKey
          }
        }
      );
      return { referenceId };
    } catch (error) {
      console.error("Error requesting payment:", error.response?.data || error.message);
      throw error;
    }
  }
  async initiateTransfer(transfer) {
    if (!this.remittanceKey) throw new Error("Remittance key is required for transfers.");
    const referenceId = (0, import_uuid.v4)();
    const authToken = await this.getAuthToken(this.remittanceKey);
    try {
      await import_axios.default.post(
        `${this.baseUrl}/remittance/v1_0/transfer`,
        {
          amount: transfer.amount,
          currency: transfer.currency,
          externalId: transfer.externalId,
          payee: {
            partyIdType: "MSISDN",
            partyId: transfer.partyId
          },
          payerMessage: transfer.payerMessage,
          payeeNote: transfer.payeeNote
        },
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "X-Reference-Id": referenceId,
            "Ocp-Apim-Subscription-Key": this.remittanceKey
          }
        }
      );
      return { referenceId };
    } catch (error) {
      console.error("Error initiating transfer:", error.response?.data || error.message);
      throw error;
    }
  }
  async getPaymentStatus(referenceId) {
    if (!this.collectionKey) throw new Error("Collection key is required for payment status.");
    const authToken = await this.getAuthToken(this.collectionKey);
    try {
      const response = await import_axios.default.get(
        `${this.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Ocp-Apim-Subscription-Key": this.collectionKey,
            "X-Target-Environment": this.environment
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting transaction status:", error.response?.data || error.message);
      throw error;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MoMoClient
});
