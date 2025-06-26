import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, Building, Heart, DollarSign, Zap } from 'lucide-react';

// 진안군 현황 데이터
const populationData = [
  { year: '2020', population: 25012 },
  { year: '2021', population: 24896 },
  { year: '2022', population: 24963 },
  { year: '2023', population: 24631 },
  { year: '2024', population: 24496 }
];

const ageDistributionData = [
  { name: '0-14세', value: 8.2, color: '#3B82F6' },
  { name: '15-64세', value: 52.8, color: '#10B981' },
  { name: '65세 이상', value: 39.0, color: '#F59E0B' }
];

const budgetAllocationData = [
  { category: '주민참여행정', budget: 150, color: '#059669' },
  { category: '복지・삶의질', budget: 280, color: '#3B82F6' },
  { category: '경제성장', budget: 420, color: '#F59E0B' },
  { category: '행정혁신', budget: 180, color: '#8B5CF6' },
  { category: '인프라개선', budget: 350, color: '#EF4444' },
  { category: '인구유입', budget: 220, color: '#EC4899' }
];

const districtProjectsData = [
  { district: '진안읍', projects: 8, budget: 530 },
  { district: '마령면', projects: 4, budget: 240 },
  { district: '용담면', projects: 6, budget: 465 },
  { district: '정천면', projects: 5, budget: 630 },
  { district: '주천면', projects: 7, budget: 600 },
  { district: '부귀면', projects: 3, budget: 285 },
  { district: '백운면', projects: 3, budget: 90 },
  { district: '성수면', projects: 4, budget: 62 },
  { district: '안천면', projects: 4, budget: 188 },
  { district: '상전면', projects: 3, budget: 62 },
  { district: '동향면', projects: 2, budget: 53 }
];

const StatCard = ({ icon: Icon, title, value, unit, color }: any) => (
  <div className="bg-white rounded-lg p-6 shadow-lg border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value}<span className="text-lg text-gray-600">{unit}</span>
        </p>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
    </div>
  </div>
);

export default function Infographics() {
  return (
    <section id="data" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">진안군 현황 및 공약 데이터</h2>
          <p className="text-xl text-gray-600">데이터로 보는 진안군의 현재와 미래</p>
        </div>

        {/* 주요 지표 카드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard 
            icon={Users}
            title="총 인구"
            value="24,496"
            unit="명"
            color="#059669"
          />
          <StatCard 
            icon={Building}
            title="행정구역"
            value="11"
            unit="개 (1읍 10면)"
            color="#3B82F6"
          />
          <StatCard 
            icon={TrendingUp}
            title="고령화율"
            value="39.0"
            unit="%"
            color="#F59E0B"
          />
          <StatCard 
            icon={DollarSign}
            title="총 공약예산"
            value="1,600"
            unit="억원"
            color="#8B5CF6"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* 인구 변화 추이 */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">진안군 인구 변화 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={populationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}명`, '인구']} />
                <Line 
                  type="monotone" 
                  dataKey="population" 
                  stroke="#059669" 
                  strokeWidth={3}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4">
              * 지속적인 인구 감소 추세로 인구유입 정책 강화 필요
            </p>
          </div>

          {/* 연령대별 분포 */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">연령대별 인구 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {ageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4">
              * 고령화율 39%로 전국 평균(17.5%) 대비 2배 이상
            </p>
          </div>
        </div>

        {/* 6대 공약 예산 배분 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-16">
          <h3 className="text-xl font-bold text-gray-800 mb-6">6대 공약 분야별 예산 배분</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={budgetAllocationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}억원`, '예산']} />
              <Bar 
                dataKey="budget" 
                fill="#059669"
                radius={[4, 4, 0, 0]}
              >
                {budgetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {budgetAllocationData.map((item, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-4 h-4 rounded mx-auto mb-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <p className="text-sm font-medium">{item.category}</p>
                <p className="text-xs text-gray-600">{item.budget}억원</p>
              </div>
            ))}
          </div>
        </div>

        {/* 면별 사업 현황 */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">면별 사업 개수 및 예산 현황</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtProjectsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="district" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'projects' ? `${value}개` : `${value}억원`,
                  name === 'projects' ? '사업 개수' : '예산'
                ]}
              />
              <Bar yAxisId="left" dataKey="projects" fill="#3B82F6" name="projects" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="budget" fill="#059669" name="budget" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm">사업 개수</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
              <span className="text-sm">예산 (억원)</span>
            </div>
          </div>
        </div>

        {/* 주요 성과 지표 */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="h-8 w-8" />
              <span className="text-2xl font-bold">1위</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">농어촌 삶의질 종합지수</h4>
            <p className="text-green-100 text-sm">전국 최상위 지역 달성</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-8 w-8" />
              <span className="text-2xl font-bold">83.7%</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">대선 지지율</h4>
            <p className="text-blue-100 text-sm">국민주권정부 압도적 지지</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Building className="h-8 w-8" />
              <span className="text-2xl font-bold">789km²</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">총 면적</h4>
            <p className="text-purple-100 text-sm">전북 2위 규모</p>
          </div>
        </div>
      </div>
    </section>
  );
}