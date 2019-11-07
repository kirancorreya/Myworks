import {
	FETCH_MODEL_BEGIN,
	FETCH_MODEL_SUCCESS,
	FETCH_MODEL_FAILURE
} from "./modelActions";

const initialState = {
	domain: "",
	modelUri: "",
	modelId: "",
	activeSystem: "",
	activeService: "",
	activeReference: "",
	items: [],
	loading: false,
	error: null,
	details: [],
	type: null
};

export default function modelReducer( state = initialState, action ){

	switch (action.type) {
		case "SELECTDOMAIN":
			return{
				...state,
				domain: action.domain,
				modelUri: "",
				activeSystem: "",
				activeService: "",
				activeReference: "",
				items: [],
				type: action.type
			};
		case "SELECTMODEL":
			return{
				...state,
				modelUri: action.model,
				modelId: action.modelId,
				type: action.type
			};
		case "HIGHLIGHT_SYSTEM":
			return{
				...state,
				activeSystem: action.system,
				type: action.type
			};
		case "HIGHLIGHT_SERVICE":
			return{
				...state,
				activeService: action.service,
				type: action.type
			};
		case "HIGHLIGHT_REFERENCE":
			return{
				...state,
				activeReference: action.reference,
				type: action.type
			};
		case FETCH_MODEL_BEGIN:
			return {
				...state,
				loading: true,
				error: null,
				type: action.type
			};

		case FETCH_MODEL_SUCCESS:
			return {
				...state,
				loading: false,
				items: action.payload.model,
				type: action.type
			};

		case FETCH_MODEL_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				items: [],
				type: action.type
			};


		default:
			return state;
	}
}
