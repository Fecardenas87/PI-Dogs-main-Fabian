import React from "react";

export default function Card({name, image,temperament, temperaments, minWeight, maxWeight, minHeight, maxHeight, id}) {
    return (
        <div> 
            <h3> {name} </h3>
            <img src= {image}  alt= "img not found" width="400px" height="250px" />         
            <h5>Temperament:<br/> {temperaments}{Array.isArray(temperament)? temperament.join(', ' ) : temperament}</h5>             
            <h5>Min Height: {minHeight} cm - Max Height: {maxHeight} cm</h5>
            <h5>Min Weight: {minWeight} kg - Max Weight: {maxWeight} kg</h5>
        </div>
    )
}