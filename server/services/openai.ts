import OpenAI from "openai";

// Enhanced OpenAI configuration with deployment safety
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR;
  
  if (!apiKey || apiKey === "sk-default-key") {
    console.warn("OpenAI API key not configured - AI chat will return fallback responses");
    return null;
  }
  
  return new OpenAI({ apiKey });
};

interface ChatResponse {
  response: string;
  confidence: number;
}

export async function getChatResponse(userMessage: string): Promise<ChatResponse> {
  const openai = getOpenAIClient();
  
  // Handle missing API key gracefully for deployment
  if (!openai) {
    return {
      response: "AI 상담 서비스가 현재 설정되지 않았습니다. 직접 선거사무소(010-7366-8789)로 문의해주세요.",
      confidence: 0.1
    };
  }
  
  try {
    const prompt = `
당신은 진안군수 후보 이우규의 공약과 정책을 안내하는 AI 상담원입니다.
다음은 주요 공약 정보입니다:

6대 핵심 공약:
1. 주민참여행정 - 기본사회위원회 운영, 찾아가는 찐반장/찐여사 프로그램
2. 삶의 질 향상 - 마을별 생활 활력센터 구축, 장애인 복지 향상
3. 지속가능한 경제성장 - 지역화폐 발행(1인당 50만원), 신재생에너지 발전
4. 행정 혁신 - 수요응답형 행복콜 서비스, 버스 공영화
5. 인프라 개선 - 전력 및 초고속 광통신망 유치
6. 인구 유입 - 귀농 청년층 스마트팜 단지, 인구유입 정책 예산 증액

면별 특화 공약도 있습니다: 진안읍, 동향면, 마령면, 백운면, 부귀면, 상전면, 성수면, 안천면, 용담면, 정천면, 주천면

사용자 질문에 대해 정확하고 친근하게 답변하되, 확실하지 않은 내용은 "정확한 내용은 선거사무소로 문의해주세요"라고 안내하세요.

사용자 질문: ${userMessage}

다음 JSON 형식으로 답변해주세요:
{
  "response": "답변 내용",
  "confidence": 0.0-1.0 사이의 신뢰도 점수
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "당신은 진안군수 후보 이우규의 공약 상담 AI입니다. 한국어로 정확하고 친근하게 답변하세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"response": "죄송합니다. 현재 서비스에 문제가 있습니다.", "confidence": 0.1}');
    
    return {
      response: result.response || "죄송합니다. 답변을 생성할 수 없습니다.",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    return {
      response: "죄송합니다. 현재 AI 상담 서비스에 일시적인 문제가 있습니다. 직접 선거사무소(010-7366-8789)로 문의해주세요.",
      confidence: 0.1
    };
  }
}
