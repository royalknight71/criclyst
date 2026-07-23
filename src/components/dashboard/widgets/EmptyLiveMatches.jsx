import { MdSportsCricket } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { FaSatelliteDish } from "react-icons/fa";
function EmptyLiveMatches(){
return (
<section className="bg-gradient-to-b
from-[#172840]
via-[#182234]
to-[#0f172a] pt-14 pb-20">

    <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="max-w-5xl mx-auto mb-8">

<p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold">
    Live Cricket
</p>

    <h2 className="mt-2 text-4xl font-bold text-white">
        Live Matches
    </h2>

    <p className="mt-3 text-slate-400 text-lg">
        Real-time scores and live match updates.
    </p>

</div>
        {/* Card */}

        <div className="
        max-w-6xl
        mx-auto
        rounded-3xl
        border
        border-slate-700
        bg-slate-900
        px-10
        py-16
        text-center
        transition-all
        duration-300
        hover:border-cyan-400/40
        hover:shadow-2xl
        hover:shadow-cyan-500/10
        ">

            {/* Icon */}

            <div className="
            mx-auto
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            border
            border-cyan-500/20
            bg-cyan-500/10
            shadow-lg
            shadow-cyan-500/10
            ">

                <FaSatelliteDish className="text-5xl text-cyan-400"/>

            </div>

            {/* Heading */}

            <h3 className="mt-8 text-4xl font-bold text-white">
                No Live Matches
            </h3>

            {/* Description */}

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">

                No matches are currently in progress.
                Live scores and real-time match statistics
                will appear automatically once a match begins.

            </p>

            {/* Divider */}

            <div className="mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"/>

            {/* Bottom Badge */}

            <div className="
            mt-8
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-cyan-500/20
            bg-cyan-500/5
            px-5
            py-3
            ">

                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"/>

                <span className="text-slate-300">
                    Monitoring live matches...
                </span>

            </div>

        </div>

    </div>

</section>
);
}
export default EmptyLiveMatches