import React from 'react'
import VenueGuide from '../basketball-section/VenueGuide'
import TennisScoreTable from './TennisScoreTable'




const TennisInfo = () => {
    return (
        <div className='w-full space-y-4'>
            <div className='w-full'>
                <TennisScoreTable
                    players={[
                        { name: "Samir Hamza Reguig", periodScores: [6, 6, 2], pts: "", s: "" },
                        { name: "Nikita Lanin", periodScores: [2, 4, 0], pts: "", s: "" }
                    ]}
                    onSeeAllClick={() => console.log("See all standings clicked")}
                />
            </div>
            <div className='w-full'>
                <VenueGuide venueName={"Estadi johan Cruyff"} />
            </div>
        </div>
    )
}

export default TennisInfo