import axios from "axios";
export const GET_ALL_DOGS = "GET_ALL_DOGS"; 

export function getAllDogs(){
    return async function (dispatch) {
        var json = await axios.get ("http://localhost:3001/dogs",{

        });
        return dispatch({
            type: "GET_ALL_DOGS",
            payload: json.data
        })
    }
}