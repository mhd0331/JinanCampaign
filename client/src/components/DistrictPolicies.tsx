import { useState } from "react";
import { Button } from "@/components/ui/button";
import { districts } from "@/data/districts";

export default function DistrictPolicies() {
  const [activeDistrict, setActiveDistrict] = useState("jinan");
  
  const currentDistrict = districts.find(d => d.id === activeDistrict) || districts[0];

  return (
    <section id="districts" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">면별 맞춤형 공약</h2>
          <p className="text-xl text-gray-600">11개 면의 특성에 맞는 구체적인 발전 방안을 제시합니다</p>
        </div>
        
        {/* District Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {districts.map((district) => (
            <Button
              key={district.id}
              onClick={() => setActiveDistrict(district.id)}
              variant={activeDistrict === district.id ? "default" : "outline"}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeDistrict === district.id 
                  ? 'bg-jinan-green text-white hover:bg-green-800' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {district.name}
            </Button>
          ))}
        </div>
        
        {/* District Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={currentDistrict.image}
              alt={`${currentDistrict.name} 모습`}
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold jinan-green mb-6">{currentDistrict.title}</h3>
            <p className="text-lg text-gray-600 mb-8">{currentDistrict.description}</p>
            <div className="space-y-6">
              {currentDistrict.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">{project.title}</h4>
                  <p className="text-green-700 font-semibold mb-2">예산: {project.budget}</p>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
