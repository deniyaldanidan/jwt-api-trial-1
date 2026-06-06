# JWT API Trials:

I'm building an Groceries API, It's functionalities are:

- List Groceries seperated by Categories
- Add/Remove to User's Cart
- Edit/Delete Category Info
- View/Edit/Delete Grocery Item Info
- Add/Remove to User's Wishlist (Favorites)
- Create/Update/Delete order for User

It has three roles:
- Visitor
- User
- Owner/Admin




> [!warning]
> This api got an huge flaw, Everytime an user sign-in, a new refresh-token is created in the DB. A malicious attacker can abuse it and make the DB unnecessarily crowded. 
>
> **To mitigate** this try to re-use the refresh-token from DB during sign-in. 
>
> Also limit no of active sessions (maybe like 3 or 4)
>
> Also run an periodic script to delete expired tokens. **OR** Delete expired tokens during `/auth/refresh` and `/auth/logout`.
>
> ### What i did?
> Add a check in => `/auth/sign-in` to see if user has more than 3 sessions in DB, if they did => I'll delete all the previous sessions in the DB before creating the current one. I'm only allowing 4 active sessions. **THIS IS NOT AN IDEAL SOLUTION, but this is an sample project i developed for the sole purpose to test my python-automation/networking skills so...**

> [!warning]
> **Another flaw is strong-password check is not implemented.**

> [!warning]
> **Another flaw is user doesn't have NAME**, so it will be difficult for delivery persons or Support Persons to contact the user. So User Table should have a name field and accept name-input when user is signing-up


> [!warning]
> Since `order_item` table is just storing the `item_id` not the actual values and `onDelete=cascade`, Dśeleting the related item will delete the order_item, Which will eventually alter the order or cause errors. To solve this, store item info's all in the order_item table itself, so user or admin won't lose the past order information on item-deletion or don't delete the item just deactivate or archive it using a seperate column like `archived=boolean` in Item-table same goes for `Item-Category` table.

> [!warning]
> When deleting User through `/user/delete-me`, user's order-items and orders also get deleted, Which is not good so remove the `onDelete=cascade` in DB and also make related api-endpoint's handle it without it throwing error

> [!warning]
> `changeOrderStatus: /admin/order/change-status/:id/:status` endpoint is not a proper way, Cuz I think each status should have its own endpoint. And also need more order-status(es) And an API-ENDPOINT for return request And also an status called `refunded` and also a way to track *Is-User_PAID-OR-NOT?*. I'm juz doin this way cuz I'm out of TIME....

> [!warning]
> API-Documentation is not done, Again **SO MUCH TO DO, TOO LI'L TIME**...

> [!warning]
> secure flag is set to false for the refresh cookie option in here: [helpers.ts](src/helpers/helpers.ts) Bcuz python's requests library wont send the refresh cookie to the localhost... The secure should be set to true

> [!Important]
> I'm not gonna correct these bugs anytime in the near future _bcuz_ **THIS IS JUST A SAMPLE API I DEVELOPED TO PRACTICE PYTHON NETWORKING/AUTOMATION.** [Click here to visit repo of the Python project](https://github.com/deniyaldanidan/jwt-api-trial-1-py-script)



## Roadmap:
- [x] Basic Setup
- [x] Setup Sqlite DB using Drizzle
- [x] Write Schema
- [x] Add Category API
- [x] Json-Syntax-Error Handler
- [x] Master Error Handler
- [x] Zod Error Handler
- [x] 404 HANDLER
- [x] Already Exists Error Handler
- [x] Setup Authentication & Authorization
  - [x] Write the JWT Structure and functions
  - [x] /sign-up
  - [x] /sign-in
  - [x] /refresh
  - [x] /logout
  - [x] Role-based Authorization Middleware
- [x] Edit Category Api
- [x] Delete Category Api
- [x] Add Item Api
- [x] List All-Items API
- [x] List Items by Category API
- [x] View Item API
- [x] Edit Item API
- [x] Delete Item API
- [x] Add Item to Cart API
- [x] Get Cart Items
- [x] Remove Item from Cart API
- [x] Clear User Cart API
- [x] Add Item to wishlist API
- [x] Get wishlist Items
- [x] Remove Item from wishlist API
- [x] Edit User Location API
- [x] View User location 
- [x] Create order API
- [x] View ALL user-orders API (USER)
- [x] View Order API (USER)
- [x] Cancel Order API (USER)
- [x] Change Order Status API (ADMIN)
- [x] View ALL ORDERS API (ADMIN)
- [x] View Order API (ADMIN)
- [x] Cancel Order API (ADMIN)
- [x] Delete User API
- [ ] Add API Documentation in README


## Schema(s):

![svg schema](./Grocery-Api-1-Schema.svg)

- [x] User-Table

- [x] User-Address-Table

- [x] Session-Table

- [x] Category-Table

- [x] Item-Table

- [x] Wishlist-Table

- [x] Cart-Table

- [x] Order-Table

- [x] Order-Item-Table

## Auth Info:

### Access-Token Structure:
```js
 sign(
  {userId:"122-ad21-112", username:"foo", role: "0000"}, 
  ACCESS_SECRET, 
  {expiresIn:"6h"}
 ); // expiresIn: 6 hours
```
### Refresh-Token Structure:
```js
sign(
  {username: "foo"},
  REFRESH_SECRET,
  {expiresIn: "3d"}
); // expiresIn: 3 days
```
### Bearer Token Structure:
```js
"Bearer jwt-comes-here"
```

