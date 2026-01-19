import { GoogleGenAI, Chat } from "@google/genai";

export const createHACCPChat = (apiKey: string): Chat => {
  if (!apiKey) {
    throw new Error("Clé API manquante");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Tu es VISI-JN, un assistant expert en hygiène et sécurité alimentaire (HACCP) pour les professionnels de la restauration.
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

export const sendMessageToGemini = async (chat: Chat, message: string) => {
  try {
    const response = await chat.sendMessageStream({ message });
    return response;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};