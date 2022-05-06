import React, {useEffect} from "react";

export function Poll({ candidates, candidateInfo, submitVote }) {
        
useEffect(() => {
        var len = candidates.length;
        var form = document.getElementById("form1");
        var formTextElements = form.getElementsByClassName("choiceText");
        console.log(formTextElements);

        while (formTextElements[0]) {
            form.removeChild(formTextElements[0]);
        }

        // console.log("Poll.js candidates: " + candidates);
            for (var i = 0; i < len; i++) {
                var radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = 'candidate';
                    radio.className = "radioButtons";
                    radio.value = candidates[i];
                    radio.id = "choice" + i;
                var radioText = document.createElement("div");
                    radioText.id = "c" + i;
                    radioText.className = "choiceText";
                    radioText.innerHTML = candidateInfo[candidates[i]].name + ": " + candidates[i] + "     ";
    
                
                radioText.appendChild(radio);
                form.appendChild(radioText);                
            }
        })

    return (
        <div>
            <h4> Poll </h4>

            <p>Select Candidate</p>

            <form id="form1" onSubmit = {(event) => {
                event.preventDefault();
                
                const formData = new FormData(event.target);
                const candidateSelection = formData.get("candidate");
            
                if (candidateSelection) {
                    submitVote(candidateSelection);
                }
                }}
            >
                
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="Submit Vote" />
                </div>
            </form>
        </div>
    )
}
