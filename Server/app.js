const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { Product } = require("./models/product");
const keyMiddileWare = require("./utils/key");
// require("dotenv").config();

app.use(express.json());

// app.use(keyMiddileWare());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/products", (req, res) => {
  res.json([
    new Product(
      "1",
      "Wireless Headphones",
      99.99,
      149.99,
      "/products/Headphone.jpg",
      "High-quality wireless headphones with noise cancellation.",
      "Electronics",
      25,
      "SoundMagic",
      5,
      ["audio", "wireless", "headphones"],
      [
        "wireless headphones",
        "bluetooth headphones",
        "noise cancelling headphones",
      ],
      `### Experience the Best Sound Quality
  
  Headphones are personal audio devices, small loudspeaker drivers worn on or around the head, that convert electrical signals into sound for private listening. They are electroacoustic transducers, available in styles like over-ear, on-ear, and in-ear (earbuds), and can connect to audio sources via wires or wireless Bluetooth technology. A headset is a combination of headphones and a microphone for audio and communication purposes
  - **Advanced Noise Cancellation Technology**: Immerse yourself in your music without distractions.
  - **Long Battery Life**: Enjoy up to 30 hours of playback on a single charge.
  - **Comfortable Fit**: Designed for all-day listening with a lightweight and ergonomic over-ear design.
  - **Quick Charge**: Get 2 hours of playback with just a 5-minute charge.
  - **Voice Assistant Compatibility**: Easily integrate with your favorite voice assistants for hands-free control.
  - **Foldable Design**: Conveniently store and carry your headphones wherever you go.
  
  ### Physical Details
  | Property   | Value       |
  |------------|-------------|
  | **Width**  | 7.5 inches  |
  | **Height** | 8.5 inches  |
  | **Length** | 3.5 inches  |
  | **Weight** | 250g        |
  | **Extra**  | Foldable design for portability |
  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tristique vestibulum orci sit amet accumsan. Nunc odio augue, egestas eget arcu sit amet, dapibus scelerisque mauris. Donec rutrum eros at justo consectetur mattis eget ut augue. Morbi tempus nulla non diam ultricies laoreet. Pellentesque congue felis enim, eget bibendum lorem molestie vitae. Donec consectetur tristique arcu nec vehicula. Donec porttitor facilisis nisl vitae maximus. Sed sit amet elit sit amet odio varius volutpat. Sed porttitor mattis tellus, ac elementum mi malesuada ac. Duis neque ex, pellentesque quis arcu et, mollis ultrices purus. Nam at posuere orci. Praesent auctor risus mi, at lacinia sem aliquet quis. Praesent rhoncus ultrices enim, sit amet pulvinar leo tincidunt et. Sed ultricies non lorem varius lacinia.
  `,
      [
        { label: "Connectivity", value: "Bluetooth 5.0, USB-C" },
        { label: "Battery Life", value: "30 hours playback" },
        { label: "Weight", value: "250g" },
        { label: "Driver Size", value: "40mm" },
        { label: "Frequency Response", value: "20Hz - 20kHz" },
        { label: "Impedance", value: "32 Ohms" },
      ],
      [
        "Active Noise Cancellation",
        "Quick Charge - 5 min charge for 2 hours playback",
        "Built-in Microphone for Calls",
        "Comfortable Over-Ear Design",
        "Foldable for Easy Storage",
        "Compatible with Voice Assistants",
      ],
      [
        "/products/Headphone.jpg",
        "/products/Headphone2.jpg",
        "/products/Headphone.jpg",
      ],
      4,
      45
    ),
    new Product(
      "2",
      "Bluetooth Speaker",
      59.99,
      89.99,
      "/products/Speaker.webp",
      "Portable Bluetooth speaker with excellent sound quality.",
      "Audio",
      30,
      "SoundWave",
      4.8,
      ["bluetooth", "speaker", "portable"],
      ["portable bluetooth speaker", "wireless speaker", "outdoor speaker"],
      `### Enjoy Music Anywhere
  
  Bluetooth speakers are wireless audio devices that connect to your smartphone, tablet, or other devices via Bluetooth technology. They are portable, easy to use, and provide high-quality sound for indoor and outdoor use.
  
  - **Superior Sound Quality**: Crystal-clear audio with deep bass.
  - **Long Battery Life**: Up to 20 hours of playback on a single charge.
  - **Water-Resistant**: Perfect for outdoor use with IPX7 rating.
  - **Compact and Lightweight**: Easy to carry anywhere.
  - **Bluetooth 5.0**: Stable and fast wireless connection.
  - **Built-in Microphone**: Hands-free calling support.
  
  ### Physical Details
  | Property   | Value       |
  |------------|-------------|
  | **Width**  | 6.5 inches  |
  | **Height** | 2.5 inches  |
  | **Length** | 2.5 inches  |
  | **Weight** | 400g        |
  | **Extra**  | Water-resistant design |
  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tristique vestibulum orci sit amet accumsan. Nunc odio augue, egestas eget arcu sit amet, dapibus scelerisque mauris. Donec rutrum eros at justo consectetur mattis eget ut augue. Morbi tempus nulla non diam ultricies laoreet. Pellentesque congue felis enim, eget bibendum lorem molestie vitae. Donec consectetur tristique arcu nec vehicula. Donec porttitor facilisis nisl vitae maximus. Sed sit amet elit sit amet odio varius volutpat. Sed porttitor mattis tellus, ac elementum mi malesuada ac. Duis neque ex, pellentesque quis arcu et, mollis ultrices purus. Nam at posuere orci. Praesent auctor risus mi, at lacinia sem aliquet quis. Praesent rhoncus ultrices enim, sit amet pulvinar leo tincidunt et. Sed ultricies non lorem varius lacinia.
      `,
      [
        { label: "Connectivity", value: "Bluetooth 5.0, AUX" },
        { label: "Battery Life", value: "20 hours playback" },
        { label: "Weight", value: "400g" },
        { label: "Water Resistance", value: "IPX7" },
        { label: "Frequency Response", value: "60Hz - 20kHz" },
        { label: "Charging Port", value: "USB-C" },
      ],
      [
        "Crystal-Clear Sound",
        "IPX7 Water-Resistant",
        "20 Hours Battery Life",
        "Compact and Portable",
        "Bluetooth 5.0 Connectivity",
        "Built-in Microphone for Calls",
      ],
      [
        "/products/Speaker.webp",
        "/products/Speaker.webp",
        "/products/Speaker.webp",
      ],
      4.8,
      75
    ),
    new Product(
      "3",
      "Portable Power Bank",
      49.99,
      79.99,
      "/products/Battery.png",
      "Compact and high-capacity power bank for charging on the go.",
      "Accessories",
      50,
      "ChargePro",
      4.5,
      ["portable", "power bank", "charging"],
      ["portable charger", "power bank", "fast charging"],
      `### Stay Powered Anywhere
  
  Power banks are portable devices designed to recharge your electronic gadgets on the go. They store electrical energy in a battery and can charge devices like smartphones, tablets, and more. Ideal for travel, outdoor activities, or emergencies.
  - **High Capacity**: 20,000mAh battery to charge multiple devices.
  - **Fast Charging**: Supports Quick Charge 3.0 and USB-C Power Delivery.
  - **Compact Design**: Lightweight and easy to carry.
  - **Multiple Ports**: Charge up to 3 devices simultaneously.
  - **LED Indicator**: Displays remaining battery life.
  - **Safety Features**: Overcharge and short-circuit protection.
  
  ### Physical Details
  | Property   | Value       |
  |------------|-------------|
  | **Width**  | 2.8 inches  |
  | **Height** | 5.9 inches  |
  | **Length** | 0.9 inches  |
  | **Weight** | 300g        |
  | **Extra**  | LED battery indicator |
  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tristique vestibulum orci sit amet accumsan. Nunc odio augue, egestas eget arcu sit amet, dapibus scelerisque mauris. Donec rutrum eros at justo consectetur mattis eget ut augue. Morbi tempus nulla non diam ultricies laoreet. Pellentesque congue felis enim, eget bibendum lorem molestie vitae. Donec consectetur tristique arcu nec vehicula. Donec porttitor facilisis nisl vitae maximus. Sed sit amet elit sit amet odio varius volutpat. Sed porttitor mattis tellus, ac elementum mi malesuada ac. Duis neque ex, pellentesque quis arcu et, mollis ultrices purus. Nam at posuere orci. Praesent auctor risus mi, at lacinia sem aliquet quis. Praesent rhoncus ultrices enim, sit amet pulvinar leo tincidunt et. Sed ultricies non lorem varius lacinia.
      `,
      [
        { label: "Capacity", value: "20,000mAh" },
        { label: "Input", value: "USB-C, Micro-USB" },
        { label: "Output", value: "USB-A, USB-C" },
        { label: "Weight", value: "300g" },
        { label: "Charging Time", value: "4 hours" },
        {
          label: "Safety Features",
          value: "Overcharge protection, Short-circuit protection",
        },
      ],
      [
        "High Capacity 20,000mAh",
        "Supports Quick Charge 3.0",
        "USB-C Power Delivery",
        "Charge 3 Devices Simultaneously",
        "Compact and Lightweight",
        "LED Battery Indicator",
      ],
      [
        "/products/Battery.png",
        "/products/Battery.png",
        "/products/Battery.png",
      ],
      4.5,
      120
    ),
    new Product(
      "4",
      "LED Light Strips",
      29.99,
      49.99,
      "/products/LEDStrips.jpg",
      "Customizable LED light strips for home decoration.",
      "Lighting",
      100,
      "BrightGlow",
      4.7,
      ["led", "light strips", "decor"],
      ["rgb led strips", "smart light strips", "home decor lighting"],
      `### Illuminate Your Space
  
      LED light strips are versatile lighting solutions that can be used for decoration, ambiance, or functional lighting. They are flexible, easy to install, and come with various color and brightness options.
      - **Customizable Colors**: Choose from millions of colors to match your mood.
      - **Smart Control**: Compatible with mobile apps and voice assistants.
      - **Energy Efficient**: Low power consumption with high brightness.
      - **Easy Installation**: Adhesive backing for quick setup.
      - **Cuttable Design**: Adjust the length to fit your space.
      - **Water-Resistant Options**: Suitable for indoor and outdoor use.
  
      ### Physical Details
      | Property   | Value       |
      |------------|-------------|
      | **Length** | 16.4 feet   |
      | **Width**  | 0.4 inches  |
      | **Weight** | 200g        |
      | **Extra**  | Includes remote control and power adapter |
  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tristique vestibulum orci sit amet accumsan. Nunc odio augue, egestas eget arcu sit amet, dapibus scelerisque mauris. Donec rutrum eros at justo consectetur mattis eget ut augue. Morbi tempus nulla non diam ultricies laoreet. Pellentesque congue felis enim, eget bibendum lorem molestie vitae. Donec consectetur tristique arcu nec vehicula. Donec porttitor facilisis nisl vitae maximus. Sed sit amet elit sit amet odio varius volutpat. Sed porttitor mattis tellus, ac elementum mi malesuada ac. Duis neque ex, pellentesque quis arcu et, mollis ultrices purus. Nam at posuere orci. Praesent auctor risus mi, at lacinia sem aliquet quis. Praesent rhoncus ultrices enim, sit amet pulvinar leo tincidunt et. Sed ultricies non lorem varius lacinia.
      `,
      [
        { label: "Length", value: "16.4 feet" },
        { label: "Power", value: "12V DC" },
        { label: "Control", value: "Remote, App, Voice" },
        { label: "Water Resistance", value: "IP65 (optional)" },
        { label: "Color Options", value: "RGB, Warm White, Cool White" },
        { label: "Lifespan", value: "50,000 hours" },
      ],
      [
        "Millions of Color Options",
        "Smart App and Voice Control",
        "Energy Efficient LED Technology",
        "Flexible and Cuttable Design",
        "Adhesive Backing for Easy Installation",
        "Optional Water-Resistant Coating",
      ],
      [
        "/products/LEDStrips.jpg",
        "/products/LEDStrips2.jpg",
        "/products/LEDStrips3.jpg",
      ],
      4.7,
      200
    ),
    // More products can be added here
  ]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
