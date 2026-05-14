import React from "react";

const faqs = [
  {
    question: "Do cameras work without internet?",
    answer:
      "Yes. The cameras can continue recording locally on the NVR recorder. Internet is only needed for mobile live view and remote playback.",
  },
  {
    question: "Can I watch the cameras on my phone?",
    answer:
      "Yes. We set up the mobile app so you can watch live view and playback from your phone.",
  },
  {
    question: "What is the difference between indoor and outdoor cameras?",
    answer:
      "Indoor cameras are usually dome cameras for rooms, shops, and offices. Outdoor cameras are stronger, waterproof, and better for entrances, gates, parking, and outside areas.",
  },
  {
    question: "How many cameras do I need for my home?",
    answer:
      "Most homes need 3 to 4 cameras: main entrance, parking or gate, hallway or living room, and balcony or back door.",
  },
  {
    question: "How many days can the recorder save video?",
    answer:
      "It depends on the number of cameras, camera quality, recording settings, and hard disk size. A bigger HDD gives more recording days.",
  },
  {
    question: "Do you install the cameras?",
    answer:
      "Yes. CRC Camera Security provides installation, setup, mobile app configuration, and support.",
  },
  {
    question: "Can cameras record at night?",
    answer:
      "Yes. We offer cameras with IR night vision and Full Color night vision for clearer footage in dark areas.",
  },
  {
    question: "What is PoE camera?",
    answer:
      "PoE means Power over Ethernet. One network cable gives both power and data to the camera, making installation cleaner and more stable.",
  },
  {
    question: "Can I add more cameras later?",
    answer:
      "Yes. You can add more cameras later if your NVR has extra channels, such as 8CH or 16CH.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Whish Money and cash payment depending on the order and installation agreement.",
  },
];

export default function FAQ() {
  return (
    <div className="container section">
      <div className="pageHeader">
        <span className="sectionLabel">Support</span>
        <h2 className="h2 bigTitle">FAQ</h2>
        <p className="muted">
          Common questions about cameras, recording, installation, and mobile view.
        </p>
      </div>

      <div className="faqGridPro">
        {faqs.map((item, index) => (
          <div className="faqCardPro" key={index}>
            <span className="faqNumberPro">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}