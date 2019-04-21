# iot-api
Back end service using nodejs. The service with the following requirements:
Security: (OAuth)
users need to register to start using the system.
users need to login in order to start use the system.
all requests are secured to grant access to authorized users.
DB:
users can create orders with items.
users can update order with item if not proceeded.
users can delete order with item if not proceeded.
user can list orders with pagination and filters.
Integrations:
users will receive email when order is submitted  and on every order status change.
Queues:
When a user sets an order, the service should only place the order in a job queue.
Administration:
system admin can list all users and activate and deactivate users
system admin can list all in progress orders
system admin can reject orders
