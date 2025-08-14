
import { Card, CardContent } from "@/components/ui/card";

const Partners = () => {
  const partnerTypes = [
    {
      title: "NGOs & Health Ministries",
      description: "Collaborating with local organizations to expand reach",
      icon: "🏛️",
      color: "from-orange-400 to-red-400"
    },
    {
      title: "Community Health Workers",
      description: "Training and supporting frontline health advocates",
      icon: "👥",
      color: "from-amber-400 to-orange-400"
    },
    {
      title: "Telehealth Clinics",
      description: "Connecting women with qualified healthcare professionals",
      icon: "🏥",
      color: "from-red-400 to-pink-400"
    },
    {
      title: "Technology Partners",
      description: "Leveraging cutting-edge health technology solutions",
      icon: "💻",
      color: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    "Improved Health Awareness",
    "Empowered Women"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building a network of collaboration to maximize impact across communities
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {partnerTypes.map((partner, index) => (
            <Card 
              key={index} 
              className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${partner.color} flex items-center justify-center text-2xl`}>
                  {partner.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {partner.title}
                </h3>
                <p className="text-gray-600">
                  {partner.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Benefits */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Partnership Benefits</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
                <span className="text-xl font-semibold text-gray-700">{benefit}</span>
                {index < benefits.length - 1 && (
                  <div className="hidden sm:block w-8 h-0.5 bg-orange-400"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
