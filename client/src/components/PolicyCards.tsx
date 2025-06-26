import { Button } from "@/components/ui/button";
import { policies } from "@/data/policies";
import { Users, Heart, TrendingUp, Settings, Building, Home } from "lucide-react";
import PolicyMiniCharts from "@/components/PolicyMiniCharts";
import { trackPolicyView } from "@/lib/analytics";
import { Link } from "wouter";

const iconMap = {
  Users,
  Heart, 
  TrendingUp,
  Settings,
  Building,
  Home
};

export default function PolicyCards() {
  return (
    <section id="policies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">6대 핵심 공약</h2>
          <p className="text-xl text-gray-600">진안군의 미래를 위한 구체적인 정책 방향을 제시합니다</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policies.map((policy) => {
            const IconComponent = iconMap[policy.icon as keyof typeof iconMap];
            return (
              <div key={policy.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-48 bg-gradient-to-br ${policy.bgGradient} p-6 flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <IconComponent className="h-16 w-16 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold">{policy.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <PolicyMiniCharts policyId={policy.id} />
                  <h4 className="text-lg font-semibold mb-3">{policy.subtitle}</h4>
                  <p className="text-gray-600 mb-4">
                    {policy.description}
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    {policy.details.map((detail, index) => (
                      <li key={index}>• {detail}</li>
                    ))}
                  </ul>
                  <Link href={`/policy/${policy.id}`}>
                    <Button 
                      onClick={() => trackPolicyView(policy.id)}
                      className={`w-full bg-gradient-to-r ${policy.bgGradient} text-white hover:opacity-90 transition-opacity`}
                    >
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
