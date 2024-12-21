'use client';

import { NextUIProvider } from '@nextui-org/react';
import React from 'react';

export default function NextUIWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <NextUIProvider>{children}</NextUIProvider>;
}
