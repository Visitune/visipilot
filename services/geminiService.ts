import { GoogleGenerativeAI, ChatSession } from "@google/genai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const createHACCPChat = (): ChatSession => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Tu es Visipilot, un assistant expert en hygiène et sécurité alimentaire (HACCP) pour les professionnels de la restauration.
      Ton objectif est d'aider les chefs et le personnel de cuisine à maintenir des normes irréprochables.
      
      Tes missions :
      - Répondre aux questions sur les températures de stockage, la cuisson, et les bonnes pratiques d'hygiène.
      - Conseiller sur les dates limites de consommation (DLC) et l'étiquetage secondaire.
      - Aider à la gestion des allergènes.
      - Si un utilisateur signale un problème critique (ex: frigo en panne), propose des actions correctives immédiates.
      
      Ton ton doit être professionnel, concis et rassurant, adapté à une lecture rapide sur tablette en cuisine.`,
      temperature: 0.4,
    },
  });
};

export const sendMessageToGemini = async (chat: ChatSession, message: string) => {
  try {
    const response = await chat.sendMessageStream(message);
    return response.stream;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};