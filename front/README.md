# Project Overview

This project is an e-commerce platform that allows users to browse products, add items to their cart, and proceed to payment. The platform supports different user roles such as Regular User, Admin, and Guest, each with specific functionalities and permissions.

## Use Case Diagram

### Actors:
- **Regular User**: Can register, log in, browse products, add items to the cart, and make payments.
- **Admin**: Can manage products, view orders, and manage users.
- **Guest**: Can browse products but needs to register or log in to make a purchase.

### Use Cases:
1. **User Registration**
   - Actors: Regular User, Admin
   - Description: Users can register to create an account on the platform.
2. **User Login**
   - Actors: Regular User, Admin
   - Description: Registered users can log in to access their accounts.
3. **Browse Products**
   - Actors: Regular User, Admin, Guest
   - Description: All users can browse available products on the platform.
4. **Add to Cart**
   - Actors: Regular User
   - Description: Registered users can add products to their shopping cart.
5. **Checkout**
   - Actors: Regular User
   - Description: Users can proceed to payment and complete their purchase.
6. **Manage Products**
   - Actors: Admin
   - Description: Admins can add, update, and delete products on the platform.

## Activity Diagram - Standard Purchase Process

1. **User Logs In**: The user logs into the platform.
2. **Browse Products**: The user navigates through available products.
3. **Add Items to Cart**: The user adds selected items to the shopping cart.
4. **View Cart**: The user reviews the items in the cart.
5. **Proceed to Checkout**: The user proceeds to the checkout process.
6. **Enter Payment Details**: The user enters payment details.
7. **Confirm Payment**: The user confirms the payment.
8. **Order Confirmation**: The system confirms the order and displays the confirmation message.

## Class Diagram

### Classes:
1. **User**
   - Attributes: userId, fullName, email, password, role, address, phoneNumber
   - Methods: register(), login(), updateProfile()

2. **Product**
   - Attributes: productId, name, description, price, stockQuantity
   - Methods: addProduct(), updateProduct(), deleteProduct()

3. **Cart**
   - Attributes: cartId, userId, items (list of CartItem)
   - Methods: addItem(), removeItem(), calculateTotal()

4. **Order**
   - Attributes: orderId, userId, items (list of CartItem), totalAmount, paymentStatus
   - Methods: placeOrder(), cancelOrder()

5. **Admin**
   - Inherits from User
   - Additional Methods: manageProducts(), viewOrders(), manageUsers()

### Relationships:
- **User** can have multiple **Cart** items.
- **Cart** contains multiple **CartItem** (association with **Product**).
- **Order** is associated with a **User** and contains multiple **CartItem**.

## Project Summary

This project is designed to provide a seamless shopping experience for users while allowing administrators to manage the platform efficiently. It supports user registration, product management, shopping cart functionality, and payment processing. The project is structured with a focus on scalability, security, and user-friendliness.
