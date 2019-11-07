// Fetch divisions API
export function fetchDivisions(domainId) {
	return dispatch => {
      return fetch(process.env.REACT_APP_API + "/hypermedia/domain/" + domainId)
      .then(res => res.json())
      .then( (result) => {
        var org = result.organisation;
        dispatch(fetchOrgSuccess(org.id));
        fetch(process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/organisation/" + org.id + "/organisations")
        .then(res => res.json())
        .then(async (json) => {
					var divisions = json;
					for (var i = 0; i < divisions.length; i++) {
						let org = divisions[i];
						org["teams"] = [];
						if (org._links && org._links.length !== 0) {
							await fetchTeams(domainId, org.id).then(
								teams => (org["teams"] = teams)
							);
						}
					}

          dispatch(fetchDivisionSuccess(divisions));
          return divisions;
        })
        .catch(error => dispatch(fetchDivisionFailure(error)));
      })
      .catch(error => dispatch(fetchOrgFailure(error)));
	};
}

const fetchTeams = (domainId, orgid) => {
	return fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/organisation/" + orgid + "/organisations" )
		.then(res => res.json())
		.then(json => {
			var teams = json;
			for (var i = 0; i < teams.length; i++) {
				let org = teams[i];
				org["persons"] = [];
				if (org._links && org._links.length !== 0) {
					fetchPersons(domainId, org.id).then(
						persons => (org["persons"] = persons)
					);
				}
			}
			return teams;
		});
};

const fetchPersons = (domainId, orgid) => {
	return fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/organisation/" + orgid + "/persons" )
		.then(res => res.json())
		.then(persons => {
			return persons;
		});
};

export const fetchOrgSuccess = (orgid) => ({
	type: "FETCH_ORG_SUCCESS",
	orgid: orgid
});

export const fetchOrgFailure = (error) => ({
	type: "FETCH_ORG_FAILURE",
	payload: { error }
});

export const fetchDivisionSuccess = (divisions) => ({
	type: "FETCH_DIVISION_SUCCESS",
	payload: { divisions }
});

export const fetchDivisionFailure = (error) => ({
	type: "FETCH_MODEL_FAILURE",
	payload: { error }
});
