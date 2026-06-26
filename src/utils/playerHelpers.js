

export function getPlayerByName(players, name) {
    return (
        players.find((player)=>player.name===name)
    )
}

export function getPlayerRole(player) {
    return player.role;
}

export function formatNumber(num) {
    return num.toLocaleString();
}

export function isBowler(player) {
    return player.role === "Bowler";
}

export function isBatsman(player) {
    return player.role === "Batsman";
}
export function formatNumber(num) {
    return num.toLocaleString();
}

export function isBowler(player) {
    return player.role === "Bowler";
}

export function isBatsman(player) {
    return player.role === "Batsman";
}

export function getRoleColor(role) {
    switch(role){
        case "Batsman":
            return "#2563eb";

        case "Bowler":
            return "#dc2626";

        case "All-Rounder":
            return "#16a34a";

        case "Wicket Keeper":
            return "#2563eb";

        default:
            return "#6b7280";
    }
}