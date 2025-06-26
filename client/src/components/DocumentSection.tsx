import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Image, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trackDocumentDownload } from "@/lib/analytics";

interface Document {
  id: number;
  title: string;
  description: string;
  type: string;
  icon: string;
  color: string;
}

const iconMap = {
  "file-pdf": FileText,
  "file-word": FileText,
  "chart-bar": BarChart3,
  "image": Image,
  "newspaper": Newspaper
};

const colorMap = {
  "red-500": "text-red-500",
  "blue-500": "text-blue-500", 
  "green-500": "text-green-500",
  "purple-500": "text-purple-500",
  "indigo-500": "text-indigo-500"
};

const bgColorMap = {
  "red-500": "bg-red-600 hover:bg-red-700",
  "blue-500": "bg-blue-600 hover:bg-blue-700",
  "green-500": "bg-green-600 hover:bg-green-700", 
  "purple-500": "bg-purple-600 hover:bg-purple-700",
  "indigo-500": "bg-indigo-600 hover:bg-indigo-700"
};

export default function DocumentSection() {
  const { data: documentsData } = useQuery({
    queryKey: ['/api/documents'],
  });

  const documents = documentsData?.documents || [];

  const handleDownload = (documentId: number, title: string) => {
    trackDocumentDownload(title);
    // In a real implementation, this would trigger an actual file download
    alert(`${title} 다운로드를 시작합니다.`);
  };

  return (
    <section id="documents" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">자료실</h2>
          <p className="text-xl text-gray-600">공약 관련 문서와 자료를 확인하세요</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: Document) => {
            const IconComponent = iconMap[doc.icon as keyof typeof iconMap] || FileText;
            const iconColor = colorMap[doc.color as keyof typeof colorMap] || "text-gray-500";
            const bgColor = bgColorMap[doc.color as keyof typeof bgColorMap] || "bg-gray-600 hover:bg-gray-700";
            
            return (
              <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <IconComponent className={`${iconColor} text-2xl mr-3 h-8 w-8`} />
                  <h3 className="text-lg font-semibold">{doc.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{doc.description}</p>
                <Button 
                  onClick={() => handleDownload(doc.id, doc.title)}
                  className={`w-full text-white py-2 rounded-lg transition-colors ${bgColor}`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
