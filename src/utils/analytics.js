/**
 * Analytics utilities for computing leaderboard rankings and
 * squad-composition data from a collection of player objects.
 * All functions are pure: they return new arrays without
 * mutating the input.
 */

/**
 * Get the top 5 players ranked by career runs.
 *
 * @param {Array<Object>} players - Collection of player objects with a `runs` field.
 * @returns {Array<Object>} New array of up to 5 players, sorted by runs (descending).
 */
export function getTopRuns(players){
    return (
    [...players]
    .sort((a, b) => b.runs - a.runs)
    .slice(0,5)
    )
}

/**
 * Get the top 5 players ranked by wickets taken.
 *
 * @param {Array<Object>} players - Collection of player objects with a `wickets` field.
 * @returns {Array<Object>} New array of up to 5 players, sorted by wickets (descending).
 */
export function getTopWickets(players){
    return (
    [...players]
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0,5)
    )
}
/**
 * Get the top 5 players ranked by average.
 *
 * @param {Array<Object>} players - Collection of player objects with an `average` field.
 * @returns {Array<Object>} New array of up to 5 players, sorted by average (descending).
 */
export function getTopAvg(players){
    return (
    [...players]
    .sort((a, b) => b.average - a.average)
    .slice(0,5)
    )
}
/**
 * Get the top 5 players ranked by strike rate.
 *
 * @param {Array<Object>} players - Collection of player objects with a `strikeRate` field.
 * @returns {Array<Object>} New array of up to 5 players, sorted by strike rate (descending).
 */
export function getTopSR(players){
    return (
    [...players]
    .sort((a, b) => b.strikeRate - a.strikeRate)
    .slice(0,5)
    )
}

/**
 * Count players per playing role and return the distribution
 * in a chart-friendly shape.
 *
 * @param {Array<Object>} players - Collection of player objects with a `role` field.
 * @returns {Array<{role: string, count: number}>} One entry each for
 *   "Batsman", "Bowler", "All-Rounder" and "Wicket Keeper", always in that order.
 */
export function getRoleDistribution(players) {

        const data=[]
    let cntBat=0
    let cntBowl=0
    let allRound=0
    let wktKeep=0
    for (const player of players) {
        if(player.role==="Batsman")
            cntBat++
        else if(player.role==="Bowler")
            cntBowl++
        else if(player.role==="All-Rounder")
            allRound++
        else if(player.role==="Wicket Keeper")
            wktKeep++
    }
    data.push({
        role:"Batsman",
        count:cntBat
    })
    data.push({
        role:"Bowler",
        count:cntBowl
    })
    data.push({
        role:"All-Rounder",
        count:allRound
    })
    data.push({
        role:"Wicket Keeper",
        count:wktKeep
    })
    return data
}

