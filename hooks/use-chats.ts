import { useAuthApi } from "./use-auth-api";
import { Chat, GetChatsParams } from "../types/chat";
import { ApiResponse } from "../types/api";

export function useChats() {
  const api = useAuthApi<Chat[]>((response: ApiResponse<any>) =>
    response.data.map((chat: any) => ({
      id: chat.id,
      input: chat.input,
      playbookId: chat.playbookId,
      playbookTitle: chat.playbookTitle,
      startedAt: chat.startedAt,
      finishedAt: chat.finishedAt,
      mode: chat.mode,
      suggestedQuestions: chat.suggestedQuestions,
      settings: chat.settings,
    })),
  );

  const getChats = async (params?: GetChatsParams) => {
    await api.call("/chat", "GET", {
      page: params?.page || 1,
      perPage: params?.perPage || 10,
      ...params,
    });
  };

  return {
    chats: api.data || [],
    isLoading: api.isLoading,
    error: api.isError,
    getChats,
    deleteChat: async (chatId: string) => {
      await api.call(`/chat/${chatId}`, "DELETE");
      await getChats(); // Refresh the list
    },
    renameChat: async (chatId: string, title: string) => {
      await api.call(`/chat/${chatId}`, "PUT", undefined, { title });
      await getChats(); // Refresh the list
    },
  };
}
