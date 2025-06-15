// import express from "express";
// import querystring from "querystring";
// import crypto from "crypto";
// import moment from "moment";
// import dotenv from "dotenv";

// dotenv.config();

// const vnPayCheckout = express.Router();

// // Route để tạo URL thanh toán VNPay
// vnPayCheckout.get("/create-payment", (req, res) => {
//   const tmnCode = process.env.VNP_TMN_CODE;
//   const secretKey = process.env.VNP_HASH_SECRET;
//   const vnpUrl = process.env.VNP_URL;
//   const returnUrl = process.env.VNP_RETURN_URL;

//   const date = new Date();

//   const createDate = moment(date).format("YYYYMMDDHHmmss");
//   const orderId = moment(date).format("HHmmss");
//   const amount = 100000; // 100,000 VND
//   const bankCode = "NCB";

//   const ipAddr = req.ip;

//   const vnp_Params = {
//     vnp_Version: "2.1.0",
//     vnp_Command: "pay",
//     vnp_TmnCode: tmnCode,
//     vnp_Locale: "vn",
//     vnp_CurrCode: "VND",
//     vnp_TxnRef: orderId,
//     vnp_OrderInfo: "Thanh toan don hang test",
//     vnp_OrderType: "other",
//     vnp_Amount: amount * 100, // VNPay yêu cầu x100
//     vnp_ReturnUrl: returnUrl,
//     vnp_IpAddr: ipAddr,
//     vnp_CreateDate: createDate,
//     vnp_BankCode: bankCode,
//   };

//   // Bước 1: Sort params theo thứ tự alphabet
//   const sortedParams = sortObject(vnp_Params);
//   const signData = querystring.stringify(sortedParams, { encode: false });

//   const hmac = crypto.createHmac("sha512", secretKey);
//   const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   sortedParams.vnp_SecureHash = secureHash;
//   const paymentUrl = `${vnpUrl}?${querystring.stringify(sortedParams, {
//     encode: false,
//   })}`;

//   res.redirect(paymentUrl);
// });

// // Route để xử lý callback sau khi thanh toán
// vnPayCheckout.get("/vnpay_return", (req, res) => {
//   const vnp_Params = req.query;
//   const secureHash = vnp_Params.vnp_SecureHash;

//   delete vnp_Params.vnp_SecureHash;
//   delete vnp_Params.vnp_SecureHashType;

//   const secretKey = process.env.VNP_HASH_SECRET;
//   const sortedParams = sortObject(vnp_Params);
//   const signData = querystring.stringify(sortedParams, { encode: false });

//   const hmac = crypto.createHmac("sha512", secretKey);
//   const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   if (secureHash === checkSum) {
//     // Giao dịch thành công
//     res.send("Thanh toán thành công");
//   } else {
//     res.send("Chữ ký không hợp lệ");
//   }
// });

// function sortObject(obj) {
//   const sorted = {};
//   const keys = Object.keys(obj).sort();
//   for (const key of keys) {
//     sorted[key] = obj[key];
//   }
//   return sorted;
// }

// export default vnPayCheckout;
