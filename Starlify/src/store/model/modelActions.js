export function fetchModel(modelId) {
	return dispatch => {
		dispatch(fetchModelBegin());
		return fetch(process.env.REACT_APP_API + '/hypermedia/network/' + modelId + '/systems')
			.then(res => res.json())
			.then(json => {
				dispatch(fetchModelSuccess(json));
				return json;
			})
			.catch(error => dispatch(fetchModelFailure(error)));
	};
}

export const FETCH_MODEL_BEGIN = "FETCH_MODEL_BEGIN";
export const FETCH_MODEL_SUCCESS = "FETCH_MODEL_SUCCESS";
export const FETCH_MODEL_FAILURE = "FETCH_MODEL_FAILURE";

export const fetchModelBegin = () => ({
	type: FETCH_MODEL_BEGIN
});

export const fetchModelSuccess = (model) => ({
	type: FETCH_MODEL_SUCCESS,
	payload: { model }
});

export const fetchModelFailure = (error) => ({
	type: FETCH_MODEL_FAILURE,
	payload: { error }
});