interface TabNavigationProps{
    tabs: {
        id: string;
        label: string;
        badge?: number;
    }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}
export const TabNavigation = ({ tabs, activeTab, onTabChange, className = '' }: TabNavigationProps) => {
  return (
    <div className={`flex gap-x-1 md:gap-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-[9px] md:text-sm font-normal transition-all relative cursor-pointer ${
            activeTab === tab.id
              ? 'text-white border-b-3 border-[#1BAA04]'
              : 'text-[#909599] hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};