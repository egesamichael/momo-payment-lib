
# 🌐 MoMo Payments Library

A TypeScript library for integrating MTN MoMo API for payment collection and transaction status retrieval. This library simplifies working with MTN MoMo APIs, enabling quick integration into your Node.js or TypeScript projects.

---

## 📦 Installation

Install the package using npm:

```bash
npm install momo-payments-lib
```

---

## 🌟 Features

- 📥 Request payments via MTN MoMo API.
- 🔍 Check payment transaction status.
- 🌐 Supports both **sandbox** and **production** environments.

---

## 🛠️ Setup

### 1️⃣ **Environment Variables**

Add the following to your `.env` file:

```env
API_USER_ID=your_api_user_id
API_KEY=your_api_key
PRIMARY_KEY=your_primary_key
```

> Replace the placeholders with your actual MTN MoMo API credentials.

---

## 🚀 Usage

### **Import and Initialize**

Create an instance of `MoMoClient`:

```typescript
import { MoMoClient } from 'momo-payments-lib';

const momoClient = new MoMoClient({
  apiUserId: process.env.API_USER_ID || '', // Your API User ID
  apiKey: process.env.API_KEY || '',       // Your API Key
  primaryKey: process.env.PRIMARY_KEY || '', // Your Primary Key
  environment: 'sandbox',                  // Use 'sandbox' for testing or 'production' for live
});
```

---

### **Request Payment**

To initiate a payment:

```typescript
const requestPayment = async () => {
  try {
    const response = await momoClient.requestPayment({
      amount: 50.00,             // Payment amount
      currency: 'EUR',
      refrence: 'Your invoice number',
      phoneNumber: '256123456789', // Phone number to charge in MSISDN format
    });

    console.log('Payment initiated successfully:', response);
  } catch (error) {
    console.error('Error requesting payment:', error.message);
  }
};

requestPayment();
```

#### 📥 **Request Parameters**

| Parameter    | Type     | Description                                  |
|--------------|----------|---------------------------------------------|
| `amount`     | `number` | Amount to charge.                           |
| `currency`   | `string` | The currency you want to use.               |
| `refrence`   | `string` | Your Refrence number for the payment.       |
| `phoneNumber`| `string` | Receiver's phone number (MSISDN).           |

#### ✅ **Response**

```json
{
  "referenceId": "unique-identifier"
}
```

---

### **Check Payment Status**

To fetch the status of a payment:

```typescript
const checkPaymentStatus = async () => {
  try {
    const status = await momoClient.getPaymentStatus('reference-id-here');
    console.log('Payment status:', status);
  } catch (error) {
    console.error('Error checking payment status:', error.message);
  }
};

checkPaymentStatus();
```

#### 📊 **Status Response**

A successful status check returns:

```json
{
  "amount": "50.00",
  "currency": "EUR",
  "payer": {
    "partyIdType": "MSISDN",
    "partyId": "256123456789"
  },
  "status": "SUCCESSFUL",
  "reason": null
}
```

---

## 🛡️ Error Handling

Errors from the MTN API or network issues are caught and logged. Ensure your application has appropriate error handling when using these methods.

---

## 🔗 Example Full Integration

Here’s a complete integration example:

```typescript
import { MoMoClient } from 'momo-payments-lib';
import dotenv from 'dotenv';

dotenv.config();

const momoClient = new MoMoClient({
  apiUserId: process.env.API_USER_ID || '',
  apiKey: process.env.API_KEY || '',
  primaryKey: process.env.PRIMARY_KEY || '',
  environment: 'sandbox',
});

const processPayment = async () => {
  try {
    console.log('Requesting payment...');
    const paymentResponse = await momoClient.requestPayment({
      amount: '100.00',
      currency: 'UGX',
      refrence: 'Invoice001'
      phoneNumber: '256789012345',
    });

    console.log('Payment initiated:', paymentResponse);

    console.log('Checking payment status...');
    const status = await momoClient.getPaymentStatus(paymentResponse.referenceId);

    console.log('Payment status:', status);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

processPayment();
```

---

## 🤝 Contributing

1. Fork the repository.
2. Make your changes.
3. Submit a pull request.

---

## 📜 License

This library is licensed under the MIT License.

---

## 📝 Notes

- For **sandbox testing**, you must register your application on the MTN Developer Portal.
- Replace `256123456789` with valid MSISDN numbers.
