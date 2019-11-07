export const fetchTeams = (domainId, divid) => {
	return fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/organisation/" + divid + "/organisations" )
		.then(res => res.json())
		.then(async json => {
			var teams = json;
			for (var i = 0; i < teams.length; i++) {
				let org = teams[i];
				org["persons"] = [];
				if (org._links && org._links.length !== 0) {
					await fetchPersons(domainId, org.id).then(
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
