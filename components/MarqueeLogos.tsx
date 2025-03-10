export default function MarqueeLogos() {
  const logos = [
    "http://pngimg.com/uploads/google/google_PNG19625.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Emblem.jpg",
    "https://logos-world.net/wp-content/uploads/2021/11/Meta-Emblem.png",
    "http://pngimg.com/uploads/apple_logo/apple_logo_PNG19673.png",
    "https://vignette2.wikia.nocookie.net/logopedia/images/b/b2/NetflixIcon2016.jpg/revision/latest/scale-to-width-down/2000?cb=20160620223003",
    "http://brandongaille.com/wp-content/uploads/2013/07/Microsoft-Company-Logo.jpg",
    "https://logodix.com/logo/592851.png",
    "https://vectorified.com/images/paytm-icon-14.png",
    "https://thumbs.dreamstime.com/z/stuttgart-germany-person-holding-smartphone-logo-indian-payments-company-phonepe-pvt-ltd-screen-front-website-267281494.jpg?w=992",
    "https://logodix.com/logo/828928.jpg",
    "http://pngimg.com/uploads/google/google_PNG19625.png",
    "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Emblem.jpg",
    "https://logos-world.net/wp-content/uploads/2021/11/Meta-Emblem.png",
    "http://pngimg.com/uploads/apple_logo/apple_logo_PNG19673.png",
    "https://vignette2.wikia.nocookie.net/logopedia/images/b/b2/NetflixIcon2016.jpg/revision/latest/scale-to-width-down/2000?cb=20160620223003",
    "http://brandongaille.com/wp-content/uploads/2013/07/Microsoft-Company-Logo.jpg",
    "https://logodix.com/logo/592851.png",
    "https://vectorified.com/images/paytm-icon-14.png",
    "https://thumbs.dreamstime.com/z/stuttgart-germany-person-holding-smartphone-logo-indian-payments-company-phonepe-pvt-ltd-screen-front-website-267281494.jpg?w=992",
    "https://logodix.com/logo/828928.jpg",
    
  ];

  return (
    <div className="mt-10 text-center" id="about">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-gray-100 mb-4">
        🚀 Our Hiring Partners & Placement Stats 📈
      </h2>

      {/* Marquee */}
      <div className="overflow-hidden whitespace-nowrap py-4 bg-gray-900 rounded-lg shadow-lg">
        <div className="flex space-x-10 animate-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <img key={index} src={logo} alt="Company Logo" className="h-12" />
          ))}
        </div>
      </div>
    </div>
  );
}
