// Sample data for leaderboard
const leaderboardData = [
    { rank: 1, user: "Alice", contributions: 120, points: 3000 },
    { rank: 2, user: "Bob", contributions: 110, points: 2900 },
    { rank: 3, user: "Charlie", contributions: 100, points: 2800 },
    { rank: 4, user: "Daisy", contributions: 90, points: 2700 },
    { rank: 5, user: "Eve", contributions: 80, points: 2600 },
];

// Populate leaderboard table
document.addEventListener("DOMContentLoaded", () => {
    const leaderboardBody = document.getElementById("leaderboard-body");

    leaderboardData.forEach((entry) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${entry.rank}</td>
            <td>${entry.user}</td>
            <td>${entry.contributions}</td>
            <td>${entry.points}</td>
        `;

        leaderboardBody.appendChild(row);
    });
});
