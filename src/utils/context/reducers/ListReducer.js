
import Types from '../actions/Types';
export const initListState = [];

const ListReducer = (state, action) => {
    switch (action.type) {
        case Types.GET_DATA:
            return [...action.payload];//return an array
        case Types.ADD_DATA:
            return [action.payload, ...state];//return array with new object
        case Types.UPDATE_DATA:
            // let objIndex = state.findIndex((obj => obj.id === action.payload.id));
            // state[objIndex] = action.payload;
            // console.log(objIndex);
            // state = state.map(itm => {
            //     const id_field = action.payload.id
            //     if (itm[id_field] === action.payload[id_field])
            //         return action.payload;
            //     else
            //         return itm;
            // });
            // return state;//return array with updated object
            if(state.length===1) {
                return state.map((updateData) => updateData.id === action.payload.id?action.payload:state);
            }else {
                return state.filter((updateData) => updateData.id === action.payload.id);
            }
        case Types.DELETE_DATA:
            return state.filter((Deletedata) => Deletedata.id === action.payload.id);
        default:
            return state;//default arry
    }

}
export default ListReducer;