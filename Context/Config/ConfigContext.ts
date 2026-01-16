'use client'

import { ConfigContextType } from "@/types";
import { createContext } from "react";

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined)