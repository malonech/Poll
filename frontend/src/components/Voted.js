import React from "react";

export function Voted({ userVote, userVoteTime }) {
    return (
        <h4>You have already voted for {userVote} at {userVoteTime}</h4>
    )
}