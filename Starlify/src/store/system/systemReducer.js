
import {
	FETCH_FLOWS_SUCCESS,
	FETCH_SYSTEM_DETAILS_SUCCESS,
	FETCH_FLOW_DETAILS_SUCCESS,
	UPDATE_FLOW_SUCCESS,
	FETCH_FAILURE,
	DISPLAY_INVOCATION_SUCCESS
} from "./systemActions";

const initialState = {
	flows: [],
	systemDetails: [],
	flowDetails: [],
	error: null,
	type: null,
	invocations : []
};

export default function systemReducer(state = initialState, action) {

	switch (action.type) {
		case "FLOW_SELECT":
			return {
				...state,
				activeFlow: action.flowId,
				type: action.type
			};

		case FETCH_FLOWS_SUCCESS:
			return {
				...state,
				flows: action.payload.flows
		};

		case FETCH_SYSTEM_DETAILS_SUCCESS:
			return {
				...state,
				systemDetails: action.payload.details
		};

		case DISPLAY_INVOCATION_SUCCESS:
			
			return {
				...state,
				type: action.type,
				invocations: action.payload.details
			};

		case FETCH_FLOW_DETAILS_SUCCESS:
			return {
				...state,
				flowDetails: action.payload.details,
				type: action.type
			};
		
		case UPDATE_FLOW_SUCCESS:
				return {
					...state,
				type: action.type,
				flowDetails: action.payload.details
				};

		case FETCH_FAILURE:
			return {
				...state,
				error: action.payload.error
			};


		default:
			return state;
	}
}
