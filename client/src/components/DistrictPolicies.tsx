import { useState } from "react";
import { Button } from "@/components/ui/button";
import { districts } from "@/data/districts";
import { trackDistrictView } from "@/lib/analytics";

// 인포그래픽 이미지 import
import drtBusImage from "@assets/DRT_1751090487916.png";
import publicBusImage from "@assets/DRT공공버스_1751090497062.png";
import lakesideImage from "@assets/lakeside-tuor_1751090497063.png";
import medicalWelfare1 from "@assets/medical welfare-1_1751090513749.png";
import medicalWelfare2 from "@assets/medical welfare-2_1751090513751.png";
import riverFishImage from "@assets/river-fish_1751090513751.png";
import sheepGoatImage from "@assets/sheep-goat_1751090513752.png";
import trackingImage from "@assets/tracking_1751090513753.png";

export default function DistrictPolicies() {
  const [activeDistrict, setActiveDistrict] = useState("jinan");
  
  const currentDistrict = districts.find(d => d.id === activeDistrict) || districts[0];
  
  // 면별 인포그래픽 매핑
  const getInfographics = (districtId: string) => {
    const infographicMap: { [key: string]: string[] } = {
      "jinan": [drtBusImage, publicBusImage, medicalWelfare1],
      "yongdam": [lakesideImage, trackingImage],
      "baekun": [riverFishImage, medicalWelfare2],
      "jusucheon": [sheepGoatImage, trackingImage],
      "dongyang": [drtBusImage, medicalWelfare1],
      "maeryeong": [lakesideImage, riverFishImage],
      "ancheon": [lakesideImage, sheepGoatImage],
      "buguiwon": [trackingImage, medicalWelfare2],
      "sangjeong": [riverFishImage, sheepGoatImage],
      "seongsu": [drtBusImage, trackingImage],
      "jeongcheon": [medicalWelfare1, lakesideImage]
    };
    return infographicMap[districtId] || [drtBusImage, medicalWelfare1];
  };

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
              onClick={() => {
                trackDistrictView(district.name);
                setActiveDistrict(district.id);
              }}
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
        <div className="space-y-12">
          {/* 기본 정보 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={currentDistrict.image}
                alt={`${currentDistrict.name} 정책 인포그래픽`}
                className="w-full rounded-xl shadow-lg"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa'
                }}
                loading="lazy"
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
          
          {/* 인포그래픽 섹션 */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
            <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {currentDistrict.name} 정책 비전
            </h4>
            <div className="grid md:grid-cols-2 gap-8">
              {getInfographics(activeDistrict).map((infographic, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={infographic}
                    alt={`${currentDistrict.name} 정책 인포그래픽 ${index + 1}`}
                    className="w-full h-auto"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      backgroundColor: '#ffffff'
                    }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
