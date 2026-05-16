import { createContext, useContext, useState, ReactNode } from 'react';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: ReactNode }) {
  return <div className="flex border-b border-zinc-800">{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      onClick={() => context?.onValueChange(value)}
      className={`px-6 py-3 text-sm font-medium transition-colors flex-1 text-center
        ${isActive 
          ? 'border-b-2 border-blue-500 text-white' 
          : 'text-zinc-400 hover:text-zinc-200'
        }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (context?.value !== value) return null;
  return <div className="mt-6">{children}</div>;
}
