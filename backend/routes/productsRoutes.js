const express = require("express");
const router = express.Router();

// Backend product catalog for API testing/admin future use.
// The React UI currently uses src/data/products.js because it imports product images directly.
const products = [
  {
    id: "crc-cam-1",
    category: "Cameras",
    type: "Outdoor",
    name: "CRC Outdoor Camera – 8.0MP POE IP Camera - Full Color (30m)",
    price: 55,
  },
  {
    id: "crc-cam-2",
    category: "Cameras",
    type: "Indoor/Outdoor",
    name: "CRC Indoor/Outdoor Camera – 5.0MP POE IP Camera - 25m",
    price: 35,
  },
  {
    id: "crc-cam-3",
    category: "Cameras",
    type: "Compact",
    name: "CRC Compact Camera – 4.0MP POE IP Camera - H.265",
    price: 30,
  },
  {
    id: "crc-cam-4",
    category: "Cameras",
    type: "Indoor",
    name: "CRC Indoor Camera – 8.0MP POE IP Camera - Pro Full Color (30m)",
    price: 55,
  },
  {
    id: "crc-cam-5",
    category: "Cameras",
    type: "POE",
    name: "CRC Camera – 5.0MP POE IP Camera - Model 5",
    price: 45,
  },
  {
    id: "crc-nvr-4ch",
    category: "NVRs",
    type: "4 Channel",
    name: "CRC 4 Channel POE NVR – H.265 Network Recorder",
    price: 70,
  },
  {
    id: "crc-nvr-8ch",
    category: "NVRs",
    type: "8 Channel",
    name: "CRC 8 Channel POE NVR – Smart Security Recorder",
    price: 110,
  },
  {
    id: "crc-acc-poe-switch-4",
    category: "Accessories",
    type: "PoE Switch",
    name: "CRC 4 Port PoE Switch – For IP Camera Systems",
    price: 35,
  },
  {
    id: "crc-acc-bracket",
    category: "Accessories",
    type: "Bracket",
    name: "CRC CCTV Wall Bracket – Camera Mount Holder",
    price: 8,
  },
  {
    id: "crc-acc-power-supply",
    category: "Accessories",
    type: "Power Supply",
    name: "CRC 12V Camera Power Supply Adapter",
    price: 7,
  },
];

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

module.exports = router;