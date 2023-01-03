
import React from "react";
import {useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllDogs } from "../actions";
import {Link} from "react-router-dom"
import Card from "./Card"; 

export default function Home (){
    const dispatch = useDispatch()
    const allDogs = useSelector((state) => state.dogs)

    useEffect (() =>{
        dispatch(getAllDogs());
    }, [dispatch])

    function handleClick(e) {
        e.preventDefault();
        dispatch(getAllDogs());
    }

    return (
        <div>
            <Link to= "/dogs">Create Dogs</Link>
            <h1>Doggis</h1>
            <button onClick={e=> {handleClick(e)}}>Reload Dogs</button>
            <div> 
                <select>
                    <option value= ""> ---- </option>
                    <option value= "ascendente">Lightest</option>
                    <option value= "descendente">Heaviest</option>
                </select>
                <select>
                    <option value= ""> ---- </option>
                    <option value= "az"> A-Z </option>
                    <option value= "za"> Z-A </option>
                </select>

                {allDogs?.map( (c) => {
                        return (
                            <fragment>
                            <Link to= {"/home/" + c.id}>
                            <Card
                                //key={c.id}
                                //id={c.id}
                                name={c.name}
                                image={c.image ? c.image : c.image}
                                //maxWeight={c.maxWeight}
                                //minWeight={c.minWeight}
                                //minHeight={c.minHeight}
                                //maxHeight={c.maxHeight}
                                temperament={c.temperament}
                                temperaments={c.temperaments?.map((t) => t.name).join(', ')}
                                />
                            </Link>
                            </fragment>
                            
                    )
                    })
                }               
            </div>
        </div>
    )

}