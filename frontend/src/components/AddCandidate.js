import React from "react";

export function AddCandidate({newCandidate}) {
    return (
        <div>
            <h4>Add candidate</h4>
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    const formData = new FormData(event.target);
                    const candidateAddress = formData.get("candidateAddress");
                    const candidateName = formData.get("candidateName");

                    if (candidateAddress && candidateName) {
                        newCandidate(candidateAddress, candidateName);
                    }
                }}
            >
                <div className="form-group">
                    <label>New Candidate</label>
                    <input
                        className="form-control"
                        type="text"
                        name="candidateAddress"
                        placeholder="0xExampleAddress"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="text"
                        name="candidateName"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="Add Candidate"/>
                </div>
            </form>

        </div>
    );
}