'use client'

import { IsLoadingContextType } from "@/types";
import { createContext } from "react";

export const IsLoadingContext = createContext<IsLoadingContextType | undefined>(undefined)