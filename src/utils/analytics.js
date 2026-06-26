
export function getTopRuns(players){
    return (
    [...players]
    .sort((a, b) => b.runs - a.runs)
    .slice(0,5)
    )
}

export function getTopWickets(players){
    return (
    [...players]
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0,5)
    )
}

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

