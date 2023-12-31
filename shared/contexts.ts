import React, { createContext } from 'react';

export const SoundContext = createContext({
  isSoundEnabled: true,
  toggleSound: () => {},
});