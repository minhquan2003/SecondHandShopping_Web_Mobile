// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import BackButton from "../../commons/BackButton";
// import { createOrder } from "../../hooks/Orders";
// import { createOrderDetail } from "../../hooks/Orderdetails";
// import { updateProduct } from "../../hooks/Products";
// import { removeFromCart } from "../../hooks/Carts";
// import { createNotification } from "../../hooks/Notifications";
// import io from "socket.io-client";
// import { IP } from "../../config";
// import { useLocationAddress } from "../../hooks/Users";

// const socket = io(`http://localhost:5555`);

// const Checkout = () => {
//   const userInfoString = sessionStorage.getItem("userInfo");
//   const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

//   const location = useLocation();
//   const navigate = useNavigate();

//   let cartItems = [];

//   if (location.state?.product) {
//     cartItems = [location.state.product];
//   } else {
//     cartItems = location.state?.cartItems || [];
//   }

//   // Tính tổng tiền
//   const totalAmount = cartItems.reduce(
//     (acc, item) => acc + item.product_quantity * item.product_price,
//     0
//   );

//   // State để lưu thông tin người dùng
//   const [fullName, setFullName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash"); // Mặc định là trả tiền khi nhận hàng
//   const [note, setNote] = useState(""); // State cho ghi chú
//   const [provinceId, setProvinceId] = useState("");
//   const [districtId, setDistrictId] = useState("");
//   const { provinces, districts } = useLocationAddress(provinceId);

//   useEffect(() => {
//     if (userInfo) {
//       setFullName(userInfo.name);
//       setPhoneNumber(userInfo.phone);
//       setAddress(userInfo.address);
//       setEmail(userInfo.email);
//       setProvinceId(userInfo.provinceId || "");
//       setDistrictId(userInfo.districtId || "");
//     }
//   }, [userInfo]);

//   const handleCheckout = async () => {
//     const userInfoString = sessionStorage.getItem("userInfo");
//     const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
//     // Kiểm tra các trường dữ liệu

//     let finalPaymentInfo = [];

//     if (!fullName || !phoneNumber || !address) {
//       alert(
//         "Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại và Địa chỉ."
//       );
//       return; // Dừng thực hiện nếu có trường không hợp lệ
//     }

//     const phonePattern = /^0\d{9}$/;
//     if (!phonePattern.test(phoneNumber)) {
//       alert("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
//       return;
//     }

//     if (cartItems.length === 0) {
//       alert(
//         "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán."
//       );
//       return; // Dừng thực hiện nếu giỏ hàng trống
//     }

//     let order;
//     let orderIds = [];

//     for (const item of cartItems) {
//       // Kiểm tra thông tin sản phẩm
//       if (!item.user_seller || !item.product_price || !item.product_quantity) {
//         alert("Thông tin sản phẩm không hợp lệ. Vui lòng kiểm tra lại.");
//         return; // Dừng thực hiện nếu thông tin sản phẩm không hợp lệ
//       }

//       const quanlity = -item.product_quantity;
//       const id = item.product_id;
//       const quanli = await updateProduct({ id, quanlity });
//       // alert(JSON.stringify(quanli));

//       if (
//         quanli.quantity < 0 ||
//         quanli.status == false ||
//         quanli.approve == false
//       ) {
//         alert(
//           "Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác."
//         );
//         const quanlity = item.product_quantity;
//         const quanli = await updateProduct({ id, quanlity });
//         navigate("/");
//         return;
//       }

//       // Tạo đơn hàng
//       order = await createOrder({
//         user_id_buyer: item.user_buyer,
//         user_id_seller: item.user_seller,
//         name: fullName,
//         phone: phoneNumber,
//         address: address,
//         total_amount: item.product_price * item.product_quantity, // Tổng tiền
//         note: note,
//         provinceId: provinceId,
//         districtId: districtId,
//       });

//       // alert(JSON.stringify(order));

//       orderIds.push({
//         id: order.data._id,
//         name_buyer: order.data.name,
//         phone: order.data.phone,
//       });

//       await createOrderDetail({
//         order_id: order.data._id,
//         product_id: item.product_id,
//         quantity: item.product_quantity,
//         price: item.product_price,
//       });

//       if (userInfo) {
//         const aa = await createNotification({
//           user_id_created: userInfo._id,
//           user_id_receive: userInfo._id,
//           message: `Bạn đã đặt thành công đơn hàng ${item.product_name}: ${order.data.total_amount} VNĐ.`,
//         });
//         // alert(JSON.stringify(aa));
//         socket.emit("sendNotification");
//       }

//       const aa = await createNotification({
//         user_id_created: userInfo._id,
//         user_id_receive: item.user_seller,
//         message: `Có đơn hàng ${item.product_name} của ${order.data.name} số điện thoại ${order.data.phone} đang chờ bạn xác nhận.`,
//       });
//       socket.emit("sendNotification");

//       const idCart = item._id;
//       if (!location.state?.product) {
//         await removeFromCart(idCart);
//       }

//       const newPaymentInfo = {
//         user_id_seller: cartItems[0].user_seller,
//         order_id: order.data._id,
//         product_id: item.product_id,
//         quantity: item.product_quantity,
//         price: item.product_price,
//       };
//     }

//     sessionStorage.setItem("orderIds", JSON.stringify(orderIds));

//     try {
//       if (paymentMethod === "onlinepay") {
//         navigate(`/payment/${order.data._id}`, { state: { cartItems } });
//       } else {
//         // Nếu chọn trả tiền khi nhận hàng, có thể chuyển hướng về trang chính hoặc thông báo
//         alert(
//           `Đơn hàng đã được tạo thành công! Bạn sẽ thanh toán khi nhận hàng.`
//         );
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error creating payment:", error);
//       alert(
//         "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại." + error
//       );
//     }
//     alert(`Đơn hàng đã được tạo thành công!`);
//   };

//   return (
//     <div className="p-5">
//       <div className="flex items-center mb-4">
//         <BackButton />
//         <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1>
//       </div>
//       <div className="flex space-x-10">
//         {/* Phần thông tin người nhận */}
//         <div className="flex-1 border rounded shadow-md p-5">
//           <h2 className="text-xl font-bold mb-4">Thông Tin Người Nhận</h2>
//           <input
//             type="text"
//             placeholder="Họ và Tên (bắt buộc)"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Số Điện Thoại (bắt buộc)"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             required
//           />
//           <select
//             value={provinceId}
//             onChange={(e) => setProvinceId(e.target.value)}
//             className={`border rounded p-2 w-full mb-2 ${
//               !provinceId ? "text-gray-400" : "text-black"
//             }`}
//           >
//             <option value="">Chọn tỉnh/thành</option>
//             {provinces.map((province) => (
//               <option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>
//                 {province.PROVINCE_NAME}
//               </option>
//             ))}
//           </select>

//           <select
//             value={districtId}
//             onChange={(e) => setDistrictId(e.target.value)}
//             className={`border rounded p-2 w-full mb-2 ${
//               !districtId ? "text-gray-400" : "text-black"
//             }`}
//           >
//             <option value="">Chọn quận/huyện</option>
//             {districts.map((district) => (
//               <option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>
//                 {district.DISTRICT_NAME}
//               </option>
//             ))}
//           </select>

//           <input
//             type="text"
//             placeholder="Địa chỉ chi tiết (bắt buộc)"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email (nếu có)"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//           />

//           {/* Trường ghi chú */}
//           <textarea
//             placeholder="Ghi chú (nếu có)"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             rows="4"
//           />

//           <h3 className="text-lg font-semibold mt-4">Phương Thức Thanh Toán</h3>
//           <div className="mt-2">
//             {/* <label>
//                             <input
//                                 type="radio"
//                                 value="qr"
//                                 checked={paymentMethod === 'qr'}
//                                 onChange={() => setPaymentMethod('qr')}
//                             />
//                             Quét Mã QR
//                         </label> */}
//             <label className="ml-4">
//               <input
//                 type="radio"
//                 value="onlinepay"
//                 checked={paymentMethod === "onlinepay"}
//                 onChange={() => setPaymentMethod("onlinepay")}
//               />
//               Thanh toán bằng thông tin tài khoản bên bán
//             </label>
//             <label className="ml-4">
//               <input
//                 type="radio"
//                 value="cash"
//                 checked={paymentMethod === "cash"}
//                 onChange={() => setPaymentMethod("cash")}
//               />
//               Trả Tiền Khi Nhận Hàng
//             </label>
//           </div>
//         </div>

//         {/* Phần hiển thị danh sách sản phẩm và tổng tiền */}
//         <div className="flex-1 border rounded shadow-md p-5">
//           <h2 className="text-xl font-bold mb-4">Chi Tiết Đơn Hàng</h2>
//           {cartItems.length > 0 ? (
//             <ul className="divide-y divide-gray-300">
//               {cartItems.map((item) => (
//                 <li
//                   key={item._id}
//                   className="flex items-center justify-between py-2"
//                 >
//                   <div className="flex items-center">
//                     <img
//                       src={item.product_imageUrl}
//                       alt={item.product_name}
//                       className="w-16 h-16 object-cover rounded mr-4"
//                     />
//                     <div>
//                       <h3 className="font-semibold">{item.product_name}</h3>
//                       <p className="text-gray-500">
//                         Đơn giá: {item.product_price.toLocaleString()} VNĐ
//                       </p>
//                       <p className="text-gray-500">
//                         Số lượng: {item.product_quantity}
//                       </p>
//                     </div>
//                   </div>

//                   <span className="font-bold">
//                     {(
//                       item.product_price * item.product_quantity
//                     ).toLocaleString() + " VNĐ"}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>Giỏ hàng trống.</p>
//           )}
//           <hr className="my-4" />
//           <div className="flex justify-between font-bold">
//             <span>Tổng Giá:</span>
//             <span>{totalAmount.toLocaleString()} VNĐ</span>
//           </div>
//           <button
//             onClick={handleCheckout}
//             className="mt-5 bg-blue-500 text-white rounded p-2 hover:bg-orange-600"
//           >
//             Thanh Toán
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import BackButton from "../../commons/BackButton";
// import { createOrder } from "../../hooks/Orders";
// import { createOrderDetail } from "../../hooks/Orderdetails";
// import { updateProduct } from "../../hooks/Products";
// import { removeFromCart } from "../../hooks/Carts";
// import { createNotification } from "../../hooks/Notifications";
// import { useLocationAddress, useUserById } from "../../hooks/Users";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io(`http://localhost:5555`);

// const Checkout = () => {
//   const userInfoString = sessionStorage.getItem("userInfo");
//   const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
//   const location = useLocation();
//   const navigate = useNavigate();
//   console.log("location.state:", location.state);

//   let cartItems = location.state?.product
//     ? [location.state.product]
//     : location.state?.cartItems || [];

//   const [fullName, setFullName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [note, setNote] = useState("");
//   const [provinceId, setProvinceId] = useState("");
//   const [districtId, setDistrictId] = useState("");
//   const [shippingOptions, setShippingOptions] = useState([]);
//   const [selectedShipping, setSelectedShipping] = useState("");
//   const [shippingCost, setShippingCost] = useState(0);

//   const { provinces, districts } = useLocationAddress(provinceId);
//   const sellerIds = [...new Set(cartItems.map((item) => item.user_seller))];
//   const sellerInfos = sellerIds.map((sellerId) => useUserById(sellerId));

//   const groupedItems = cartItems.reduce((acc, item) => {
//     const sellerId = item.user_seller;
//     if (!acc[sellerId]) {
//       acc[sellerId] = {
//         items: [],
//         total: 0,
//       };
//     }
//     acc[sellerId].items.push(item);
//     acc[sellerId].total += item.product_price * item.product_quantity;
//     return acc;
//   }, {});

//   useEffect(() => {
//     if (userInfo) {
//       setFullName(userInfo.name);
//       setPhoneNumber(userInfo.phone);
//       if (!address) setAddress(userInfo.address);
//       setEmail(userInfo.email);
//       if (!provinceId) setProvinceId(userInfo.provinceId || "");
//       if (!districtId) setDistrictId(userInfo.districtId || "");
//     }
//   }, [userInfo]);

//   useEffect(() => {
//     const fetchShippingPrices = async () => {
//       if (provinceId && districtId && sellerIds.length > 0) {
//         const sellerInfo = sellerInfos[0];
//         if (!sellerInfo) return;

//         const totalWeight = cartItems.reduce(
//           (sum, item) => sum + item.product_weight * item.product_quantity,
//           0
//         );

//         const totalPrice = cartItems.reduce(
//           (sum, item) => sum + item.product_price * item.product_quantity,
//           0
//         );

//         try {
//           const response = await axios.post(
//             "http://localhost:5555/orders/getShippingPrices",
//             {
//               SENDER_PROVINCE: 2,
//               SENDER_DISTRICT: 1231,
//               RECEIVER_PROVINCE: Number(provinceId),
//               RECEIVER_DISTRICT: Number(districtId),
//               PRODUCT_TYPE: "HH",
//               PRODUCT_WEIGHT: totalWeight,
//               PRODUCT_PRICE: totalPrice,
//               MONEY_COLLECTION: totalPrice.toString(),
//               TYPE: 1,
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           const options = Array.isArray(response.data) ? response.data : [];
//           setShippingOptions(options);

//           // Auto-select the first shipping option if none is selected
//           if (options.length > 0 && !selectedShipping) {
//             setSelectedShipping(options[0].MA_DV_CHINH);
//             setShippingCost(options[0].GIA_CUOC);
//           }
//         } catch (error) {
//           console.error("Error fetching shipping prices:", error);
//           setShippingOptions([]);
//           setSelectedShipping("");
//           setShippingCost(0); // Reset only on error
//         }
//       } else {
//         // Clear options and cost if province or district is not selected
//         setShippingOptions([]);
//         setSelectedShipping("");
//         setShippingCost(0);
//       }
//     };

//     fetchShippingPrices();
//   }, [provinceId, districtId, sellerIds, sellerInfos]);

//   const handleShippingSelection = (method) => {
//     setSelectedShipping(method);
//     const option = shippingOptions.find((opt) => opt.MA_DV_CHINH === method);
//     setShippingCost(option ? option.GIA_CUOC : 0);
//   };

//   const handleCheckout = async () => {
//     if (!fullName || !phoneNumber || !address || !provinceId || !districtId) {
//       alert(
//         "Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại, Địa chỉ, Tỉnh/Thành, Quận/Huyện."
//       );
//       return;
//     }

//     if (!selectedShipping) {
//       alert("Vui lòng chọn hình thức vận chuyển.");
//       return;
//     }

//     const phonePattern = /^0\d{9}$/;
//     if (!phonePattern.test(phoneNumber)) {
//       alert("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
//       return;
//     }

//     let orderIds = [];
//     for (const sellerId of Object.keys(groupedItems)) {
//       const items = groupedItems[sellerId].items;
//       const totalAmount = groupedItems[sellerId].total;

//       for (const item of items) {
//         const quanlity = -item.product_quantity;
//         const id = item.product_id;
//         const quanli = await updateProduct({ id, quanlity });

//         if (
//           quanli.quantity < 0 ||
//           quanli.status === false ||
//           quanli.approve === false
//         ) {
//           alert(
//             "Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác."
//           );
//           await updateProduct({ id, quanlity: item.product_quantity });
//           navigate("/");
//           return;
//         }

//         const order = await createOrder({
//           user_id_buyer: userInfo?._id || "",
//           user_id_seller: item.user_seller,
//           name: fullName,
//           phone: phoneNumber,
//           address: address,
//           total_amount: totalAmount + shippingCost / sellerIds.length, // Distribute shipping cost evenly
//           note: note,
//           provinceId: provinceId,
//           districtId: districtId,
//           shipping_method: selectedShipping,
//           shipping_cost: shippingCost / sellerIds.length,
//         });

//         orderIds.push({
//           id: order.data._id,
//           name_buyer: order.data.name,
//           phone: order.data.phone,
//         });

//         await createOrderDetail({
//           order_id: order.data._id,
//           product_id: item.product_id,
//           quantity: item.product_quantity,
//           price: totalAmount + shippingCost / sellerIds.length,
//         });

//         if (userInfo) {
//           await createNotification({
//             user_id_created: userInfo._id,
//             user_id_receive: userInfo._id,
//             message: `Bạn đã đặt thành công đơn hàng ${item.product_name}: ${order.data.total_amount} VNĐ.`,
//           });
//           socket.emit("sendNotification");
//         }

//         await createNotification({
//           user_id_created: userInfo?._id || "",
//           user_id_receive: item.user_seller,
//           message: `Có đơn hàng ${item.product_name} của ${order.data.name} số điện thoại ${order.data.phone} đang chờ bạn xác nhận.`,
//         });
//         socket.emit("sendNotification");

//         const idCart = item._id;
//         if (!location.state?.product) {
//           await removeFromCart(idCart);
//         }
//       }
//     }

//     sessionStorage.setItem("orderIds", JSON.stringify(orderIds));

//     try {
//       if (paymentMethod === "onlinepay") {
//         navigate(`/payment/${orderIds[0].id}`, { state: { cartItems } });
//       } else {
//         alert(
//           "Đơn hàng đã được tạo thành công! Bạn sẽ thanh toán khi nhận hàng."
//         );
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error creating payment:", error);
//       alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
//     }
//   };

//   return (
//     <div className="p-5">
//       <div className="flex items-center mb-4">
//         <BackButton />
//         <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1>
//       </div>
//       <div className="flex space-x-10">
//         <div className="flex-1 border rounded shadow-md p-5">
//           <h2 className="text-xl font-bold mb-4">Thông Tin Người Nhận</h2>
//           <input
//             type="text"
//             placeholder="Họ và Tên (bắt buộc)"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Số Điện Thoại (bắt buộc)"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             required
//           />
//           <select
//             value={provinceId}
//             onChange={(e) => {
//               setProvinceId(e.target.value);
//               setShippingCost(0);
//               setSelectedShipping("");
//               setShippingOptions([]);
//             }}
//             className={`border rounded p-2 w-full mb-2 ${
//               !provinceId ? "text-gray-400" : "text-black"
//             }`}
//           >
//             <option value="">Chọn tỉnh/thành</option>
//             {provinces.map((province) => (
//               <option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>
//                 {province.PROVINCE_NAME}
//               </option>
//             ))}
//           </select>
//           <select
//             value={districtId}
//             onChange={(e) => {
//               setDistrictId(e.target.value);
//               setShippingCost(0);
//               setSelectedShipping("");
//               setShippingOptions([]);
//             }}
//             className={`border rounded p-2 w-full mb-2 ${
//               !districtId ? "text-gray-400" : "text-black"
//             }`}
//           >
//             <option value="">Chọn quận/huyện</option>
//             {districts.map((district) => (
//               <option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>
//                 {district.DISTRICT_NAME}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder="Địa chỉ chi tiết (bắt buộc)"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email (nếu có)"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//           />
//           <textarea
//             placeholder="Ghi chú (nếu có)"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//             rows="4"
//           />
//           <h3 className="text-lg font-semibold mt-4">Hình Thức Vận Chuyển</h3>
//           <select
//             value={selectedShipping}
//             onChange={(e) => handleShippingSelection(e.target.value)}
//             className="border rounded p-2 w-full mb-2"
//           >
//             <option value="">Chọn phương thức vận chuyển</option>
//             {Array.isArray(shippingOptions) &&
//               shippingOptions.map((option) => (
//                 <option key={option.MA_DV_CHINH} value={option.MA_DV_CHINH}>
//                   {option.TEN_DICHVU} - {option.GIA_CUOC.toLocaleString()} VNĐ (
//                   {option.THOI_GIAN})
//                 </option>
//               ))}
//           </select>
//           <h3 className="text-lg font-semibold mt-4">Phương Thức Thanh Toán</h3>
//           <div className="mt-2">
//             <label className="ml-4">
//               <input
//                 type="radio"
//                 value="onlinepay"
//                 checked={paymentMethod === "onlinepay"}
//                 onChange={() => setPaymentMethod("onlinepay")}
//               />
//               Thanh toán bằng thông tin tài khoản bên bán
//             </label>
//             <label className="ml-4">
//               <input
//                 type="radio"
//                 value="cash"
//                 checked={paymentMethod === "cash"}
//                 onChange={() => setPaymentMethod("cash")}
//               />
//               Trả Tiền Khi Nhận Hàng
//             </label>
//           </div>
//         </div>
//         <div className="flex-1 border rounded shadow-md p-5">
//           <h2 className="text-xl font-bold mb-4">Chi Tiết Đơn Hàng</h2>
//           {sellerIds.length > 0 ? (
//             sellerIds.map((sellerId, index) => {
//               const sellerInfo = sellerInfos[index];
//               const sellerItems = groupedItems[sellerId].items;
//               const sellerTotal = groupedItems[sellerId].total;

//               return (
//                 <div key={sellerId} className="mb-10">
//                   <h3 className="text-lg font-semibold">
//                     Người bán: {sellerInfo?.name || "Đang tải..."}
//                   </h3>
//                   <ul className="divide-y divide-gray-300">
//                     {sellerItems.map((item) => (
//                       <li
//                         key={item._id}
//                         className="flex items-center justify-between py-2"
//                       >
//                         <div className="flex items-center">
//                           <img
//                             src={item.product_imageUrl}
//                             alt={item.product_name}
//                             className="w-16 h-16 object-cover rounded mr-4"
//                           />
//                           <div>
//                             <h3 className="font-semibold">
//                               {item.product_name}
//                             </h3>
//                             <p className="text-gray-500">
//                               Đơn giá: {item.product_price.toLocaleString()} VNĐ
//                             </p>
//                             <p className="text-gray-500">
//                               Số lượng: {item.product_quantity}
//                             </p>
//                           </div>
//                         </div>
//                         <span className="font-bold">
//                           {(
//                             item.product_price * item.product_quantity
//                           ).toLocaleString()}{" "}
//                           VNĐ
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="flex justify-between font-bold mt-2">
//                     <span>(Phí vận chuyển):</span>
//                     <span>{shippingCost.toLocaleString()} VNĐ</span>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p>Giỏ hàng trống.</p>
//           )}
//           <hr className="my-4" />
//           <div className="flex justify-between font-bold">
//             <span>Tổng Giá (bao gồm phí vận chuyển):</span>
//             <span>
//               {(
//                 Object.values(groupedItems).reduce(
//                   (acc, group) => acc + group.total,
//                   0
//                 ) + shippingCost
//               ).toLocaleString()}{" "}
//               VNĐ
//             </span>
//           </div>
//           <button
//             onClick={handleCheckout}
//             className="mt-5 bg-blue-500 text-white rounded p-2 hover:bg-orange-600"
//           >
//             Thanh Toán
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../commons/BackButton";
import { createOrder } from "../../hooks/Orders";
import { createOrderDetail } from "../../hooks/Orderdetails";
import { updateProduct } from "../../hooks/Products";
import { removeFromCart } from "../../hooks/Carts";
import { createNotification } from "../../hooks/Notifications";
import { useLocationAddress, useUsersByIds } from "../../hooks/Users";
import io from "socket.io-client";
import axios from "axios";
import { useMemo } from "react";

const socket = io(`http://localhost:5555`);

const Checkout = () => {
  const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = useMemo(() => {
    return location.state?.product
      ? [location.state.product]
      : location.state?.cartItems || [];
  }, [location.state]);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [shippingOptions, setShippingOptions] = useState([
    {
      MA_DV_CHINH: "LCOD",
      TEN_DICHVU: "TMĐT Tiết Kiệm thỏa thuận",
    },
    {
      MA_DV_CHINH: "SCN",
      TEN_DICHVU: "Chuyển phát nhanh",
    },
    {
      MA_DV_CHINH: "SHT",
      TEN_DICHVU: "Chuyển phát hỏa tốc",
    },
    {
      MA_DV_CHINH: "STK",
      TEN_DICHVU: "Chuyển phát tiết kiệm",
    },
    {
      MA_DV_CHINH: "VHT",
      TEN_DICHVU: "Hỏa tốc thỏa thuận",
    },
  ]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [shippingCosts, setShippingCosts] = useState({});

  const { provinces, districts } = useLocationAddress(provinceId);
  const sellerIds = useMemo(
    () => [...new Set(cartItems.map((item) => item.user_seller))],
    [cartItems]
  );
  const sellerInfos = useUsersByIds(sellerIds);

  const groupedItems = cartItems.reduce((acc, item) => {
    const sellerId = item.user_seller;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        items: [],
        total: 0,
      };
    }
    acc[sellerId].items.push(item);
    acc[sellerId].total += item.product_price * item.product_quantity;
    return acc;
  }, {});

  useEffect(() => {
    if (userInfo) {
      setFullName(userInfo.name);
      setPhoneNumber(userInfo.phone);
      if (!address) setAddress(userInfo.address);
      setEmail(userInfo.email);
      if (!provinceId) setProvinceId(userInfo.provinceId || "");
      if (!districtId) setDistrictId(userInfo.districtId || "");
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchShippingPrices = async () => {
      if (
        provinceId &&
        districtId &&
        sellerIds.length > 0 &&
        selectedShipping
      ) {
        const shippingCostMap = {};
        for (const sellerId of sellerIds) {
          const sellerItems = groupedItems[sellerId].items;
          const sellerInfo = sellerInfos.find((info) => info._id === sellerId);
          if (!sellerInfo) continue;

          const totalWeight = sellerItems.reduce(
            (sum, item) => sum + item.product_weight * item.product_quantity,
            0
          );
          const totalPrice = sellerItems.reduce(
            (sum, item) => sum + item.product_price * item.product_quantity,
            0
          );

          try {
            const response = await axios.post(
              "http://localhost:5555/orders/getShippingPrices",
              {
                SENDER_PROVINCE: Number(sellerInfo.provinceId) || 2, // Use seller's province
                SENDER_DISTRICT: Number(sellerInfo.districtId) || 1231, // Use seller's district
                RECEIVER_PROVINCE: Number(provinceId),
                RECEIVER_DISTRICT: Number(districtId),
                PRODUCT_TYPE: "HH",
                PRODUCT_WEIGHT: totalWeight,
                PRODUCT_PRICE: totalPrice,
                MONEY_COLLECTION: totalPrice.toString(),
                TYPE: 1,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const option = response.data.find(
              (opt) => opt.MA_DV_CHINH === selectedShipping
            );
            shippingCostMap[sellerId] = option ? option.GIA_CUOC : 0;
          } catch (error) {
            console.error(
              `Error fetching shipping price for seller ${sellerId}:`,
              error
            );
            shippingCostMap[sellerId] = 0;
          }
        }
        setShippingCosts(shippingCostMap);
      } else {
        setShippingCosts({});
      }
    };

    fetchShippingPrices();
  }, [provinceId, districtId, selectedShipping, sellerIds, sellerInfos]);

  const handleShippingSelection = (method) => {
    setSelectedShipping(method);
  };

  const handleCheckout = async () => {
    if (!fullName || !phoneNumber || !address || !provinceId || !districtId) {
      alert(
        "Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại, Địa chỉ, Tỉnh/Thành, Quận/Huyện."
      );
      return;
    }

    if (!selectedShipping) {
      alert("Vui lòng chọn hình thức vận chuyển.");
      return;
    }

    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(phoneNumber)) {
      alert("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
      return;
    }

    let orderIds = [];
    for (const sellerId of Object.keys(groupedItems)) {
      const items = groupedItems[sellerId].items;
      const totalAmount = groupedItems[sellerId].total;
      const sellerShippingCost = shippingCosts[sellerId] || 0;

      for (const item of items) {
        const quanlity = -item.product_quantity;
        const id = item.product_id;
        const quanli = await updateProduct({ id, quanlity });

        if (
          quanli.quantity < 0 ||
          quanli.status === false ||
          quanli.approve === false
        ) {
          alert(
            "Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác."
          );
          await updateProduct({ id, quanlity: item.product_quantity });
          navigate("/");
          return;
        }

        const order = await createOrder({
          user_id_buyer: userInfo?._id || "",
          user_id_seller: item.user_seller,
          name: fullName,
          phone: phoneNumber,
          address: address,
          total_amount: totalAmount + sellerShippingCost,
          note: note,
          provinceId: provinceId,
          districtId: districtId,
          shipping_method: selectedShipping,
          shipping_cost: sellerShippingCost,
        });

        orderIds.push({
          id: order.data._id,
          name_buyer: order.data.name,
          phone: order.data.phone,
        });

        await createOrderDetail({
          order_id: order.data._id,
          product_id: item.product_id,
          quantity: item.product_quantity,
          price: totalAmount + sellerShippingCost,
        });

        if (userInfo) {
          await createNotification({
            user_id_created: userInfo._id,
            user_id_receive: userInfo._id,
            message: `Bạn đã đặt thành công đơn hàng ${item.product_name}: ${order.data.total_amount} VNĐ.`,
          });
          socket.emit("sendNotification");
        }

        await createNotification({
          user_id_created: userInfo?._id || "",
          user_id_receive: item.user_seller,
          message: `Có đơn hàng ${item.product_name} của ${order.data.name} số điện thoại ${order.data.phone} đang chờ bạn xác nhận.`,
        });
        socket.emit("sendNotification");

        const idCart = item._id;
        if (!location.state?.product) {
          await removeFromCart(idCart);
        }
      }
    }

    sessionStorage.setItem("orderIds", JSON.stringify(orderIds));

    try {
      if (paymentMethod === "onlinepay") {
        navigate(`/payment/${orderIds[0].id}`, { state: { cartItems } });
      } else {
        alert(
          "Đơn hàng đã được tạo thành công! Bạn sẽ thanh toán khi nhận hàng."
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1>
      </div>
      <div className="flex space-x-10">
        <div className="flex-1 border rounded shadow-md p-5">
          <h2 className="text-xl font-bold mb-4">Thông Tin Người Nhận</h2>
          <input
            type="text"
            placeholder="Họ và Tên (bắt buộc)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            required
          />
          <input
            type="number"
            placeholder="Số Điện Thoại (bắt buộc)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            required
          />
          <select
            value={provinceId}
            onChange={(e) => {
              setProvinceId(e.target.value);
              setDistrictId(""); // Reset district when province changes
              setShippingCosts({}); // Reset shipping costs
              // Only reset selectedShipping if shipping options are invalid
            }}
            className={`border rounded p-2 w-full mb-2 ${
              !provinceId ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="">Chọn tỉnh/thành</option>
            {provinces.map((province) => (
              <option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>
                {province.PROVINCE_NAME}
              </option>
            ))}
          </select>
          <select
            value={districtId}
            onChange={(e) => {
              setDistrictId(e.target.value);
              setShippingCosts({}); // Reset shipping costs
              // Only reset selectedShipping if shipping options are invalid
            }}
            className={`border rounded p-2 w-full mb-2 ${
              !districtId ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>
                {district.DISTRICT_NAME}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Địa chỉ chi tiết (bắt buộc)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            required
          />
          <input
            type="email"
            placeholder="Email (nếu có)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          />
          <textarea
            placeholder="Ghi chú (nếu có)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            rows="4"
          />
          <h3 className="text-lg font-semibold mt-4">Hình Thức Vận Chuyển</h3>
          <select
            value={selectedShipping}
            onChange={(e) => handleShippingSelection(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          >
            <option value="">Chọn phương thức vận chuyển</option>
            {shippingOptions.map((option) => (
              <option key={option.MA_DV_CHINH} value={option.MA_DV_CHINH}>
                {option.TEN_DICHVU}
              </option>
            ))}
          </select>
          <h3 className="text-lg font-semibold mt-4">Phương Thức Thanh Toán</h3>
          <div className="mt-2">
            <label className="ml-4">
              <input
                type="radio"
                value="onlinepay"
                checked={paymentMethod === "onlinepay"}
                onChange={() => setPaymentMethod("onlinepay")}
              />
              Thanh toán bằng thông tin tài khoản bên bán
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Trả Tiền Khi Nhận Hàng
            </label>
          </div>
        </div>
        <div className="flex-1 border rounded shadow-md p-5">
          <h2 className="text-xl font-bold mb-4">Chi Tiết Đơn Hàng</h2>
          {sellerIds.length > 0 ? (
            sellerIds.map((sellerId, index) => {
              const sellerInfo = sellerInfos[index];
              const sellerItems = groupedItems[sellerId].items;
              const sellerTotal = groupedItems[sellerId].total;
              const sellerShippingCost = shippingCosts[sellerId] || 0;

              return (
                <div key={sellerId} className="mb-10">
                  <h3 className="text-lg font-semibold">
                    Người bán: {sellerInfo?.name || "Đang tải..."}
                  </h3>
                  <ul className="divide-y divide-gray-300">
                    {sellerItems.map((item) => (
                      <li
                        key={item._id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.product_imageUrl}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {item.product_name}
                            </h3>
                            <p className="text-gray-500">
                              Đơn giá: {item.product_price.toLocaleString()} VNĐ
                            </p>
                            <p className="text-gray-500">
                              Số lượng: {item.product_quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold">
                          {(
                            item.product_price * item.product_quantity
                          ).toLocaleString()}{" "}
                          VNĐ
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-bold mt-2">
                    <span>(Phí vận chuyển):</span>
                    <span>{sellerShippingCost.toLocaleString()} VNĐ</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Giỏ hàng trống.</p>
          )}
          <hr className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Tổng Giá (bao gồm phí vận chuyển):</span>
            <span>
              {(
                Object.values(groupedItems).reduce(
                  (acc, group) => acc + group.total,
                  0
                ) +
                Object.values(shippingCosts).reduce(
                  (acc, cost) => acc + cost,
                  0
                )
              ).toLocaleString()}{" "}
              VNĐ
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-5 bg-blue-500 text-white rounded p-2 hover:bg-orange-600"
          >
            Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
