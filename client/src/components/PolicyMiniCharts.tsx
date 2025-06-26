import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

// 주민참여행정 - 찐반장/찐여사 프로그램 대상 연령대
const participationData = [
  { name: '50-60대', value: 65, color: '#059669' },
  { name: '기타', value: 35, color: '#10B981' }
];

// 복지 - 장애인 복지 서비스 분야
const welfareData = [
  { category: '이동권', impact: 90 },
  { category: '일자리', impact: 75 },
  { category: '체육활동', impact: 60 },
  { category: '가족지원', impact: 85 }
];

// 경제 - 지역화폐 할인율과 월 발행액
const economyData = [
  { amount: '15만원', discount: '10%', color: '#F59E0B' },
  { amount: '30만원', discount: '10%', color: '#F59E0B' },
  { amount: '50만원', discount: '10%', color: '#F59E0B' }
];

// 행정혁신 - DRT 서비스 커버리지
const adminData = [
  { area: '진안읍', coverage: 100 },
  { area: '면지역', coverage: 85 },
  { area: '산간지역', coverage: 70 }
];

// 인프라 - 광통신망 속도 개선
const infraData = [
  { type: '현재', speed: 100, color: '#EF4444' },
  { type: '목표', speed: 10000, color: '#059669' }
];

// 인구유입 - 연령대별 지원금
const populationData = [
  { type: '청년정착', amount: 3000, color: '#8B5CF6' },
  { type: '신혼부부', amount: 2000, color: '#EC4899' },
  { type: '출산장려', amount: 500, color: '#3B82F6' }
];

interface MiniChartProps {
  policyId: string;
}

export default function PolicyMiniCharts({ policyId }: MiniChartProps) {
  const renderChart = () => {
    switch (policyId) {
      case 'participation':
        return (
          <div className="h-24 mb-4">
            <p className="text-xs text-gray-600 mb-2">찐반장 프로그램 대상층</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={35}
                  dataKey="value"
                >
                  {participationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'welfare':
        return (
          <div className="h-24 mb-4">
            <p className="text-xs text-gray-600 mb-2">장애인 복지 개선 분야</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={welfareData}>
                <Bar dataKey="impact" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'economy':
        return (
          <div className="h-24 mb-4">
            <p className="text-xs text-gray-600 mb-2">지역화폐 월 발행 계획</p>
            <div className="grid grid-cols-3 gap-1 h-16">
              {economyData.map((item, index) => (
                <div key={index} className="bg-yellow-100 rounded p-1 text-center">
                  <div className="text-xs font-bold text-yellow-800">{item.amount}</div>
                  <div className="text-xs text-yellow-600">{item.discount}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'administration':
        return (
          <div className="h-24 mb-4">
            <p className="text-xs text-gray-600 mb-2">행복콜 서비스 커버리지</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminData}>
                <Bar dataKey="coverage" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'infrastructure':
        return (
          <div className="h-24 mb-4">
            <p className="text-xs text-gray-600 mb-2">초고속 인터넷 (Mbps)</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={infraData}>
                <Bar dataKey="speed" radius={[2, 2, 0, 0]}>
                  {infraData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'population':
        return (
          <div className="h-24 mb-4">
            <p className="text-xs text-gray-600 mb-2">인구유입 지원금 (만원)</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={populationData}>
                <Bar dataKey="amount" radius={[2, 2, 0, 0]}>
                  {populationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return renderChart();
}