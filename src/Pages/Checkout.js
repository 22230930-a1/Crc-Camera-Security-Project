import { payWithStripe } from "../api/stripe";

<button
  onClick={() =>
    payWithStripe(
      [{ name: "CRC Camera", price: 50, quantity: 1 }],
      { email: "test@test.com" }
    )
  }
>
  Pay by Visa
</button>
