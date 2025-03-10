export default function MembershipCards() {
    const memberships = [
      {
        type: "Free",
        price: "₹0",
        color: "bg-gray-700",
        hover: "hover:bg-gray-800",
        features: ["Handwritten Notes", "DPP (Daily Practice Problems)"],
      },
      {
        type: "Silver",
        price: "₹999",
        color: "bg-blue-600",
        hover: "hover:bg-blue-700",
        features: ["Handwritten Notes", "DPP", "TA Assistance", "Live Lectures"],
      },
      {
        type: "Gold",
        price: "₹1999",
        color: "bg-yellow-700",
        hover: "hover:bg-yellow-600",
        features: ["Handwritten Notes", "DPP", "TA Assistance", "Live Lectures", "1:1 Mentorship"],
      },
      {
        type: "Diamond",
        price: "₹3999",
        color: "bg-purple-600",
        hover: "hover:bg-purple-700",
        features: [
          "Handwritten Notes",
          "DPP",
          "TA Assistance",
          "Live Lectures",
          "1:1 Mentorship",
          "Placement Guidance",
        ],
      },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        {memberships.map((membership, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-lg text-center transition ${membership.color} ${membership.hover} cursor-pointer h-80 flex flex-col justify-between`}
          >
            <div>
              <h2 className="text-2xl font-bold">{membership.type} Membership</h2>
              <p className="text-lg font-semibold mt-2">{membership.price}</p>
              <ul className="mt-4 text-sm text-gray-200">
                {membership.features.map((feature, i) => (
                  <li key={i} className="mt-1">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className="mt-4 px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-opacity-80">
              Subscribe
            </button>
          </div>
        ))}
      </div>
    );
  }
  