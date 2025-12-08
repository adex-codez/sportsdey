import DetailsImageCard from "@/shared/DetailsImageCard";
import { useState } from "react";
import TennisInfo from "./TennisInfo";

const TennisDetailsPage = () => {
    const [activeTab, setActiveTab] = useState('info');
    const gameTabs = [
        { id: 'info', label: 'Info' },
        { id: 'videos', label: 'Videos' },
        { id: 'news', label: 'News' }
    ];
    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <TennisInfo />
                );
            case 'videos':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">Game Highlights</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition cursor-pointer">
                                    <div className="h-32 bg-linear-to-br from-blue-900 to-gray-900 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-primary text-sm font-medium">Highlight {i}</p>
                                        <p className="text-gray-400 text-xs">2:15</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'news':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">Latest News</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition cursor-pointer">
                                    <h4 className="text-primary font-medium mb-1">Post-Game Analysis: Bulls Dominate</h4>
                                    <p className="text-gray-400 text-sm mb-2">
                                        Chicago Bulls showcase stellar performance in their victory over Detroit Pistons...
                                    </p>
                                    <p className="text-gray-500 text-xs">2 hours ago</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };
    return (
        <div className="space-y-3 pb-28 lg:pb-10">
            <div className='py-4 lg:py-0'>
                <DetailsImageCard gameTabs={gameTabs} activeTab={activeTab} setActiveTab={setActiveTab} competitionCountry='International' competitionName={`International - Women's Champions League`} hostTeamName='Samir Hamza Reguig' hostTeamLogo='/Profile.png' matchStatus='finished' hostTeamScore={2} guestTeamScore={0} guestTeamLogo='/Profile.png' guestTeamName='Nikita Lanin' />
            </div>
            <div>
                {renderTabContent()}
            </div>
        </div>
    )
}

export default TennisDetailsPage
