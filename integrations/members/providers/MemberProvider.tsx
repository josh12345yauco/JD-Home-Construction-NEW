import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { MemberActions, MemberContext, MemberState } from '.';
import { getCurrentMember, Member } from '..';

// Local storage key
const MEMBER_STORAGE_KEY = 'member-store';

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [state, setState] = useState<MemberState>(() => {
    let storedMemberData: Member | null = null;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(MEMBER_STORAGE_KEY);
        if (stored) {
          const parsedData = JSON.parse(stored);
          // Only use member data from localStorage, not authentication status
          storedMemberData = parsedData;
        }
      } catch (error) {
        console.error('Error loading member state from localStorage:', error);
      }
    }

    // Always start with loading true and not authenticated
    // We'll verify authentication with the server on mount
    return {
      member: storedMemberData,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving member state to localStorage:', error);
      }
    }
  }, [state]);

  // Update state helper
  const updateState = useCallback((updates: Partial<MemberState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Member actions
  const actions: MemberActions = {
    /**
     * Load current member from Wix
     */
    loadCurrentMember: useCallback(async () => {
      try {
        updateState({ isLoading: true, error: null });
        const member = await getCurrentMember();
        updateState({
          member: member ?? null,
          isAuthenticated: !!member,
          isLoading: false,
        });
      } catch {
        updateState({ member: null, isAuthenticated: false, isLoading: false });
      }
    }, [updateState]),

    login: useCallback(() => {
      // No-op on Vercel: no Wix auth
    }, []),

    logout: useCallback(() => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(MEMBER_STORAGE_KEY);
        } catch {}
      }
      updateState({ member: null, isAuthenticated: false, isLoading: false, error: null });
    }, [updateState]),

    clearMember: useCallback(() => {
      updateState({ member: null, isAuthenticated: false, isLoading: false, error: null });
    }, [updateState]),
  };

  // Auto-load member on mount
  useEffect(() => {
    actions.loadCurrentMember();
  }, [actions.loadCurrentMember]);

  // Context value
  const contextValue = {
    ...state,
    actions,
  };

  return (
    <MemberContext.Provider value={contextValue}>
      {children}
    </MemberContext.Provider>
  );
};
