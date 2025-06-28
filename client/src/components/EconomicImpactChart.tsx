import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Users, Zap, AlertTriangle } from 'lucide-react';

// 지역화폐 경제효과 시뮬레이션 데이터
const localCurrencyImpact = [
  { month: '1월', circulation: 50, businesses: 120, jobs: 45 },
  { month: '3월', circulation: 180, businesses: 145, jobs: 78 },
  { month: '6월', circulation: 320, businesses: 180, jobs: 125 },
  { month: '9월', circulation: 480, businesses: 220, jobs: 168 },
  { month: '12월', circulation: 600, businesses: 280, jobs: 200 }
];

// 스마트팜 경제효과
const smartFarmData = [
  { category: '청년농업인', target: 30, income: 4800 },
  { category: '기존농가', target: 50, income: 3200 },
  { category: '가공업체', target: 15, income: 8500 },
  { category: '유통업체', target: 20, income: 2400 }
];

// 신재생에너지 수익 분배
const renewableEnergyData = [
  { type: '마을태양광', capacity: '50MW', revenue: 120, households: 200 },
  { type: '소수력발전', capacity: '10MW', revenue: 45, households: 80 },
  { type: '영농형태양광', capacity: '30MW', revenue: 85, households: 150 },
  { type: '바이오가스', capacity: '5MW', revenue: 35, households: 60 }
];

// 진안군 인구 변화 데이터 (실제 데이터 기반)
const populationData = [
  { year: '2015', population: 26854 },
  { year: '2016', population: 26234 },
  { year: '2017', population: 25687 },
  { year: '2018', population: 25198 },
  { year: '2019', population: 24756 },
  { year: '2020', population: 24496 },
  { year: '2021', population: 24187 },
  { year: '2022', population: 23912 },
  { year: '2023', population: 23665 },
  { year: '2024', population: 23421 }
];

const COLORS = ['#059669', '#3B82F6', '#F59E0B', '#8B5CF6'];

export default function EconomicImpactChart() {
  return (
    <section id="data" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">경제정책 기대효과</h2>
          <p className="text-xl text-gray-600">데이터 기반 경제 활성화 시나리오</p>
        </div>

        {/* 지역화폐 순환 효과 */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign className="mr-3 text-green-600" />
            지역화폐 경제 순환 효과
          </h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={localCurrencyImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}${name === 'circulation' ? '억원' : name === 'businesses' ? '개소' : '명'}`,
                      name === 'circulation' ? '유통액' : name === 'businesses' ? '참여업체' : '일자리'
                    ]}
                  />
                  <Area type="monotone" dataKey="circulation" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="businesses" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="jobs" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">600억원</div>
                  <div className="text-sm text-gray-600">연간 유통 목표</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">280개</div>
                  <div className="text-sm text-gray-600">참여 업체</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">200명</div>
                  <div className="text-sm text-gray-600">신규 일자리</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">15%</div>
                  <div className="text-sm text-gray-600">지역경제 성장률</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 스마트팜 경제효과 */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="mr-3 text-green-600" />
              스마트팜 클러스터 경제효과
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={smartFarmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === 'target' ? '명/개소' : '만원'}`,
                    name === 'target' ? '목표 수' : '평균 연소득'
                  ]}
                />
                <Bar dataKey="target" fill="#3B82F6" name="target" />
                <Bar dataKey="income" fill="#059669" name="income" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p>• 총 115개 농가/업체 참여 목표</p>
              <p>• 연간 총 소득 증대 효과: 약 190억원</p>
            </div>
          </div>

          {/* 신재생에너지 수익 분배 */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Zap className="mr-3 text-yellow-600" />
              신재생에너지 주민수익 분배
            </h3>
            <div className="space-y-4">
              {renewableEnergyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-gray-600">{item.capacity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{item.revenue}억원</p>
                    <p className="text-xs text-gray-600">{item.households}가구 수혜</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 mb-1">285억원</div>
                <div className="text-sm text-green-600">연간 총 주민수익</div>
                <div className="text-xs text-gray-600 mt-1">490가구 직접 수혜</div>
              </div>
            </div>
          </div>
        </div>

        {/* 진안군 인구 변화 현황 */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <AlertTriangle className="mr-3 text-red-600" />
            진안군 인구 변화 현황
          </h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    domain={[23000, 27000]}
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}천명`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()}명`, '인구수']}
                    labelFormatter={(label) => `${label}년`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="population" 
                    stroke="#DC2626" 
                    strokeWidth={3}
                    dot={{ fill: '#DC2626', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, stroke: '#DC2626', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
                <h4 className="text-lg font-bold text-red-700 mb-3">인구감소 위기</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">2015년 인구</span>
                    <span className="font-bold text-gray-800">26,854명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">2024년 인구</span>
                    <span className="font-bold text-red-600">23,421명</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">9년간 감소</span>
                      <span className="font-bold text-red-700 text-lg">-3,433명</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600 text-sm">감소율</span>
                      <span className="font-bold text-red-600">-12.8%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="text-lg font-bold text-blue-700 mb-3">정책 목표</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">• 2028년까지 인구 25,000명 회복</p>
                  <p className="text-gray-700">• 청년층 유입을 통한 인구구조 개선</p>
                  <p className="text-gray-700">• 지역경제 활성화로 일자리 창출</p>
                  <p className="text-gray-700">• 정주여건 개선으로 인구유출 방지</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 종합 경제효과 요약 */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">종합 경제효과 (연간)</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1,075억원</div>
              <div className="text-lg opacity-90">총 경제효과</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1,200명</div>
              <div className="text-lg opacity-90">신규 일자리</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24%</div>
              <div className="text-lg opacity-90">지역 GDP 증가</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">3,500명</div>
              <div className="text-lg opacity-90">직간접 수혜자</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}