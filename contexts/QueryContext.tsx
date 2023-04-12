"use client";

import React from 'react';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface QueryContextProps {
    children: React.ReactNode;
}

export default function QueryContext ({ children }: QueryContextProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}