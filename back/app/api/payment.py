from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/payment")
async def payment_get():
    return {
        "code": -1,
        "text": "This endpoint only accepts POST requests."
    }


@router.post("/payment")
async def payment(request: dict):
    try:
        print("Received payment data:", request)
        print("Merchant ID:", request.get("merchantid"))
        print("Command:", request.get("comand"))
        print("Order ID:", request.get("order_id"))
        print("Amount:", request.get("amount"))
        print("Currency:", request.get("valute"))
        print("Params:", request.get("params"))
        print("Customer Name:", request.get("params", {}).get("customer_name"))
        print("Phone Number:", request.get("params", {}).get("phone_number"))
        print("Email:", request.get("params", {}).get("email"))


        order_id = request.get("order_id")
        if order_id == 12345:
            return {
                "code": 100,
                "text": "success"
            }
        else:
            return {
                "code": 50,
                "text": "Order not found",
            }
    except Exception as e:
        return {
            "code": -1,
            "text": e
        }


# {
#     "merchantid": "test_merchant",
#     "comand": "check",
#     "order_id": "123456789",
#     "amount": 10000,
#     "valute": 498,
#     "params": {
#         "customer_name": "John Doe",
#         "phone_number": "069123456",
#         "email": "john.doe@example.com"
#     }
# }
