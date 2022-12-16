const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
const { Dog,Temperament} = require ('../db')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const getApiData = async () => {
    const infoApi = await axios.get("https://api.thedogapi.com/v1/breeds") 
    
    const data = await infoApi.data.map(element => {
        return {
            id: element.id,
            name: element.name,
            altura: element.height,
            peso: element.weight,
            lifeSpan: element.life_span,
            image: element.image, 
        };
    });
    return data;
} 

const getDbData = async () => {
    return await Dog.findAll({
        model: Temperament,
        attributes: ["name"],
        through: {
            attributes: [],
        }
    })
}

const getAllDogs = async () => {
    const infoApi = await getApiData();
    const dbData = await getDbData();
    const allDogs = infoApi.concat(dbData);
    return allDogs;
}

//--FUNCIONES RUTAS DE DOGS--//
router.get("/breeds", async (req, res) => {
    const { name } = req.query;
    let info = await getAllDogs();

    if (name) {
        let dogName = await info.filter((e)=> 
        e.name.toLowerCase().includes(name.toLowerCase()));
        name.length 
        ? res.status (200).send(dogName)
        : res.status (400).send("Dog Not Found");
    } else {
        res.status(200).send(info);
    }
})





module.exports = router;
