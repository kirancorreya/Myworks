
export function fetchFlows(modelId) {
	return dispatch => {
		return fetch(process.env.REACT_APP_API + '/hypermedia/network/' + modelId + '/flows')
			.then(res => res.json())
			.then(json => {
                dispatch(fetchFlowsSuccess(json));
				return json;
			})
			.catch(error => dispatch(fetchFailure(error)));
	};
}

export function fetchSystemDetils(modelId, systemId) {
	return dispatch => {
		return fetch(process.env.REACT_APP_API + `${modelId}/system/` + systemId,)
			.then(res => res.json())
			.then(json => {
                dispatch(fetchSystemDetailsSuccess(json));
				return json;
			})
			.catch(error => dispatch(fetchFailure(error)));
	};
}

export function fetchFlowDetils(modelId, flowId) {
	return dispatch => {
		return fetch(process.env.REACT_APP_API + `/hypermedia/network/${modelId}/flow/` + flowId,)
			.then(res => res.json())
			.then(async (json) => {
				
				await dispatch(fetchflowInvocation(json.invocations));
				await dispatch(fetchflowDetailsSuccess(json));
				return json;
			})
			.catch(error => dispatch(fetchFailure(error)));
	};
}

export function fetchflowInvocation(invocations) {
	return dispatch => {
		var data = []
		invocations
      .map(invocation => {
        invocation._links
      .filter(links => links.rel === "THROUGH")
      .map(reference => {
		data.push({id : invocation.id, refrenceId : reference.params.id})
		return true
      });
        return true
	  });
	  dispatch(displayInvocation(data));
	};
}

export function displayInvocation(data) {
	return dispatch => {
		var invocatioDisplay = []
		data.map((invocation, i) => {
			fetch(
			  process.env.REACT_APP_API +
				`/hypermedia/network/a0434a1d-fc55-42b0-996c-10d5a30fb20f/system/3db7a16a-cb27-4492-8866-3d42643e413c/reference/${invocation.refrenceId}`,
			  {
				method: "GET"
			  }
			)
			  .then(response => response.json())
			  .then(responseJson => {
				var consumer, service, provider;
				responseJson._links
				  .filter(links => links.rel === "OF")
				  .map((referenceData, i) => {
					consumer = referenceData.title;
					return true
				  });
				responseJson._links
				  .filter(links => links.rel === "TO")
				  .map((serviceData, i) => {
					service = serviceData.title;
					fetch(process.env.REACT_APP_API + serviceData.uri, {
					  method: "GET"
					})
					  .then(response => response.json())
					  .then(responseJson => {
						responseJson._links
						  .filter(links => links.rel === "OF")
						  .map((systemData, i) => {
							provider = systemData.title;
						  });
						 
						  invocatioDisplay.push({
						  consumer: consumer,
						  service: service,
						  provider: provider,
						  referenceId: invocation.refrenceId,
						  invocationId :  invocation.id
						});
						
					  })
					  .catch(error => console.log(error));
					 
				  });
			  })
			  .catch(error => console.log(error));
		  });
		  dispatch(displayInvocationSuccess(invocatioDisplay));
	};
}

export function addSoucrSystem(sourceSystems, modelId, flowId) {
	return dispatch => {

		sourceSystems.map((system, i) => {
			fetch(process.env.REACT_APP_API + '/hypermedia/network/' + modelId + '/flow/' + flowId + '/source/' + system.value,
			  {
				method: "POST",
				headers: {
				  "Content-Type": "application/json"
				}
			  }
			)
			  .then(response => {
				
	
	
			  })
			  .catch(error => console.log(error));
			  return true
	
		  })
	
	};
}
export function updateFlow(data, sourceSystems, modelId, flowId) {
	return dispatch => {

		fetch(
			process.env.REACT_APP_API + `${modelId}/flow/` + flowId,
			{
			  method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
			}
		  )
		  .then(res => res.json())
		  .then(json => {
				dispatch(addSoucrSystem(sourceSystems, modelId, flowId));
			})
			.catch(error => console.log(error));
	
	};
}

export const FETCH_FLOWS_SUCCESS = "FETCH_FLOWS_SUCCESS";
export const FETCH_SYSTEM_DETAILS_SUCCESS = "FETCH_SYSTEM_DETAILS_SUCCESS";
export const FETCH_FLOW_DETAILS_SUCCESS = "FETCH_FLOW_DETAILS_SUCCESS";
export const UPDATE_FLOW_SUCCESS = "UPDATE_FLOW_SUCCESS";
export const UPDATE_FLOW_DETAILS_FAILURE = "FETCH_FLOW_DETAILS_FAILURE";
export const FETCH_FAILURE = "FETCH_DETAILS_FAILURE";
export const DISPLAY_INVOCATION_SUCCESS = "DISPLAY_INVOCATION_SUCCESS";

export const fetchFlowsSuccess = (flows) => ({
	type: FETCH_FLOWS_SUCCESS,
	payload: { flows }
});

export const displayInvocationSuccess = (details) => ({
	type: DISPLAY_INVOCATION_SUCCESS,
	payload: { details }
});

export const fetchSystemDetailsSuccess = (details) => ({
	type: FETCH_SYSTEM_DETAILS_SUCCESS,
	payload: { details }
});

export const fetchflowDetailsSuccess = (details) => ({
	type: FETCH_FLOW_DETAILS_SUCCESS,
	payload: { details }
});

export const updateFlowSuccess = (details) => ({
	type: UPDATE_FLOW_SUCCESS,
	payload: { details }
});

export const updateflowDetailsFailure = (error) => ({
	type: FETCH_FAILURE,
	payload: { error }
});

export const fetchFailure = (error) => ({
	type: FETCH_FAILURE,
	payload: { error }
});