const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
const { Dog, Temperament } = require ('../db')

const router = Router();
const {YOUR_API_KEY} = process.env;

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


//--FUNCIONES DE BASE DE DATOS--//

const getApiData = async () => {
    const infoApi = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`) 
    
    const data = await infoApi.data.map(element => {
        return {
            id: element.id,
            name: element.name,
            altura: element.height,
            peso: element.weight,
            temperamento: element.temperament,
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

//--FUNCIONES RUTAS DE DOGS--// Esta ruta la debo usar en el front para buscar por nombre
router.get("/dogs", async (req, res) => {
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

router.get('/temperaments',async(req,res)=>{
    try{
        let tempeSet = new Set();
        const temperamentApi = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`)

       
        temperamentApi.data.forEach(dog => {
            let tempArray = dog.temperament ? dog.temperament.split(', ') : []
            tempArray.forEach(temperament => tempeSet.add(temperament))

        })
        const tempe = Array.from(tempeSet)

        tempe.forEach(async(elem)=>{
            await Temperament.findOrCreate({
                    where:{
                        name:elem,
                    }
                });
        });

        const temperamentDog = await Temperament.findAll();
        res.json(temperamentDog);
        
    }catch (error){
        console.log(error);
    }
});






module.exports = router;
