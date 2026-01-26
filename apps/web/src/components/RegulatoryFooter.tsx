
const RegulatoryFooter = () => {

    return (
        <div className="bg-[#f8f9fa] dark:bg-[#1a1b1a] py-8 px-6 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto text-center space-y-4">
                <p className="text-black dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto">
                    This Website and the “Sportsdey” trademark are owned and operated by Halla Gaming Limited,
                    a company established in Nigeria with RC1396896, having its registered address at
                    First floor, Lagos City Mall, Onikan, Lagos state. Halla Gaming Limited is licensed
                    and regulated by the National Lottery Regulatory Commission under license 00000010,
                    issued on the 15th of August 2023.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] sm:text-xs font-bold tracking-wider text-primary dark:text-white uppercase pt-2">
                    <span>Play Responsibly</span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span>18+ Only</span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span>Please Gamble Responsibly</span>
                </div>
            </div>
        </div>
    );
};

export default RegulatoryFooter;
