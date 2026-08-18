import { useState, useEffect, useCallback } from 'react';
import type { ConstructionAIMessage, ConstructionAISession } from '../types';
import { streamConstructionAIMessage } from '../services/constructionAI';

const STORAGE_KEY = 'conark_ai_sessions_v1';

export type AIStatus = 'IDLE' | 'THINKING' | 'GENERATING' | 'COMPLETE' | 'ERROR';

export function useConstructionAI() {
  const [sessions, setSessions] = useState<ConstructionAISession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    const defaultId = 'session-' + Date.now();
    return [
      {
        id: defaultId,
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
        messages: []
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-' + Date.now();
  });

  const [status, setStatus] = useState<AIStatus>('IDLE');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string>('ALL');
  const [projectContext, setProjectContext] = useState<Record<string, any> | null>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  // Helper to update current session messages
  const updateCurrentMessages = useCallback(
    (updater: (msgs: ConstructionAIMessage[]) => ConstructionAIMessage[], newTitle?: string) => {
      setSessions(prevSessions =>
        prevSessions.map(s => {
          if (s.id === currentSessionId) {
            const updatedMsgs = updater(s.messages);
            let title = s.title;
            if (newTitle) {
              title = newTitle;
            } else if (s.title === 'New Conversation' && updatedMsgs.length > 0) {
              const firstUserMsg = updatedMsgs.find(m => m.role === 'user');
              if (firstUserMsg) {
                const words = firstUserMsg.content.trim().split(/\s+/).slice(0, 4).join(' ');
                title = words.charAt(0).toUpperCase() + words.slice(1);
              }
            }
            return { ...s, messages: updatedMsgs, title };
          }
          return s;
        })
      );
    },
    [currentSessionId]
  );

  const startNewChat = useCallback(() => {
    const newId = 'session-' + Date.now();
    const newSession: ConstructionAISession = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setStatus('IDLE');
    setErrorMsg(null);
  }, []);

  const selectSession = useCallback((id: string) => {
    setCurrentSessionId(id);
    setStatus('IDLE');
    setErrorMsg(null);
  }, []);

  const deleteSession = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const freshId = 'session-' + Date.now();
        const freshSession = {
          id: freshId,
          title: 'New Conversation',
          createdAt: new Date().toISOString(),
          messages: []
        };
        setCurrentSessionId(freshId);
        return [freshSession];
      }
      return filtered;
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string, customContext?: Record<string, any>) => {
      const cleanPrompt = text.trim();
      if (!cleanPrompt || status === 'THINKING' || status === 'GENERATING') return;

      setErrorMsg(null);
      setStatus('THINKING');

      const userMsgId = 'msg-' + Date.now();
      const assistantMsgId = 'msg-' + (Date.now() + 1);

      const userMsg: ConstructionAIMessage = {
        id: userMsgId,
        role: 'user',
        content: cleanPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const assistantMsg: ConstructionAIMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Add user message and blank assistant placeholder
      updateCurrentMessages(msgs => [...msgs, userMsg, assistantMsg]);

      // Construct history for backend API
      const historyPayload = (currentSession?.messages || []).map(m => ({
        role: m.role,
        content: m.content
      }));

      const contextToUse = customContext || projectContext || undefined;

      await streamConstructionAIMessage(
        cleanPrompt,
        historyPayload,
        {
          onChunk: (chunk: string) => {
            setStatus('GENERATING');
            updateCurrentMessages(msgs =>
              msgs.map(m => (m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m))
            );
          },
          onDone: () => {
            setStatus('COMPLETE');
          },
          onError: (errMsg: string) => {
            setStatus('ERROR');
            setErrorMsg(errMsg);
            updateCurrentMessages(msgs =>
              msgs.map(m =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: m.content || errMsg,
                      error: true
                    }
                  : m
              )
            );
          }
        },
        currentSessionId,
        contextToUse
      );
    },
    [currentSession, currentSessionId, projectContext, status, updateCurrentMessages]
  );

  const regenerateLastMessage = useCallback(() => {
    if (!currentSession || currentSession.messages.length < 2) return;
    const lastUserIndex = [...currentSession.messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserIndex === -1) return;

    const actualUserMsg = currentSession.messages[currentSession.messages.length - 1 - lastUserIndex];
    if (!actualUserMsg) return;

    // Pop off last assistant response
    updateCurrentMessages(msgs => msgs.filter(m => m.id !== currentSession.messages[currentSession.messages.length - 1].id));
    sendMessage(actualUserMsg.content);
  }, [currentSession, sendMessage, updateCurrentMessages]);

  const clearMessages = useCallback(() => {
    updateCurrentMessages(() => []);
    setStatus('IDLE');
    setErrorMsg(null);
  }, [updateCurrentMessages]);

  return {
    sessions,
    currentSession,
    currentSessionId,
    status,
    errorMsg,
    activeTopic,
    setActiveTopic,
    projectContext,
    setProjectContext,
    startNewChat,
    selectSession,
    deleteSession,
    sendMessage,
    regenerateLastMessage,
    clearMessages
  };
}
