import { Phone, Mail, CheckCircle } from "lucide-react";
import { candidateInfo } from "@/data/candidate";

export default function CandidateProfile() {
  return (
    <section id="candidate" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">후보자 소개</h2>
          <p className="text-xl text-gray-600">진안군의 미래를 이끌어갈 이우규를 소개합니다</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-full max-w-md mx-auto">
              <img 
                src="/attached_assets/이우규-원본_1751090980969.JPG" 
                alt="이우규 후보자 프로필" 
                className="w-full rounded-xl shadow-lg object-cover"
                style={{ maxWidth: '400px', height: 'auto' }}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold jinan-green mb-2">
                {candidateInfo.name}
              </h3>

              <p className="text-lg text-gray-700 leading-relaxed">
                {candidateInfo.description}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">주요 경력</h4>
              <ul className="space-y-2 text-gray-700">
                {candidateInfo.careers.map((career, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-700 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{career}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-4">
              <a 
                href={`tel:${candidateInfo.phone}`} 
                className="flex items-center space-x-2 text-blue-600 hover:text-green-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{candidateInfo.phone}</span>
              </a>
              <a 
                href={`mailto:${candidateInfo.email}`} 
                className="flex items-center space-x-2 text-blue-600 hover:text-green-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{candidateInfo.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
