const initialState = {
  orgid: "",
	divisions: [],
	division: "",
	teams: [],
	team: "",
	persons: [],
  type: null,
  error: null
};

export default function orgReducer( state = initialState, action ){

  //console.log(action);

	switch (action.type) {

    case "FETCH_ORG_FAILURE":
			return {
				...state,
				error: action.payload.error,
        orgid: "",
        divisions: [],
        division: "",
        teams: [],
        team: "",
        persons: [],
				type: action.type
		};

    case "FETCH_ORG_SUCCESS":
			return {
				...state,
        orgid: action.orgid,
        divisions: [],
        division: "",
        teams: [],
        team: "",
        persons: [],
				type: action.type
		};

    case "SELECT_DIVISION":
			return {
				...state,
				division: action.division,
        teams: [],
        team: "",
        persons: [],
				type: action.type
			};

		case "FETCH_DIVISION_FAILURE":
			return {
				...state,
				error: action.payload.error,
        divisions: [],
        division: "",
        teams: [],
        team: "",
        persons: [],
				type: action.type
		};

    case "FETCH_DIVISION_SUCCESS":
			return {
				...state,
				divisions: action.payload.divisions,
        teams: [],
        team: "",
        persons: [],
				type: action.type
		};

    case "SELECT_TEAM":
			return {
				...state,
				team: action.team,
        persons: [],
				type: action.type
			};

		default:
			return state;
	}
}
