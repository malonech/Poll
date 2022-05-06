import React, {useEffect} from "react";

export function Results({ candidates, candidateInfo }) {
        
useEffect(() => {
        var len = candidates.length;
        var resultsElementbyID = document.getElementById("resultsID");
        var resultsElements = resultsElementbyID.getElementsByClassName("resultText");

        while (resultsElements[0]) {
            resultsElementbyID.removeChild(resultsElements[0]);
        }

        // console.log("Poll.js candidates: " + candidates);
            for (var i = 0; i < len; i++) {
                var radioText = document.createElement("div");
                    radioText.id = "c" + i;
                    radioText.className = "resultText";
                    radioText.innerHTML = candidateInfo[candidates[i]].name + ":     " + candidateInfo[candidates[i]].votes;
    
                resultsElementbyID.appendChild(radioText);                
            }
        })

    return (
        <div>
            <h4> Current Results </h4>
            <div className="resultsClass" id="resultsID"/>
        </div>
    )
}