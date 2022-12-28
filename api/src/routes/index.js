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
            temperament: element.temperament,
            life_span: element.life_span,
            image: "https://cdn2.thedogapi.com/images/" + element.reference_image_id + ".jpg",
            
            minHeight: element.height.metric.slice(0,2),
            maxHeight: element.height.metric.slice(4),
            minWeight: element.weight.metric.slice(0,2),
            maxWeight: element.weight.metric.slice(4)
        };
    });
    return data;
} 

const getDbData = async () => {
    const infoDb = await Dog.findAll({
        include: [{
        model: Temperament,
        attributes: ["name"],
        through: {
            attributes: [],
        }
    }]
});
return infoDb;
}

const getAllDogs = async () => {
    const infoApi = await getApiData();
    const dbData = await getDbData();
    const allDogs = await infoApi.concat(dbData);
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

router.post("/dogs", async (req,res) => {
    let {
        name,
        minHeight, 
        maxHeight, 
        minWeight, 
        maxWeight, 
        life_span,
        image,
        temperament,
        createdInDataBase,
    } = req.body

    //if (!name){
    //return res.json({error: "Name is required"})
    //}

    //const existe = await Dog.findOne({ where: { name: name } });
    //if (existe) return res.json({ error: "The dog already exists" });

    //try {
    let dogCreate = await Dog.create({
        name,
        minHeight, 
        maxHeight, 
        minWeight, 
        maxWeight,
        life_span,
        image,
        temperament,
        createdInDataBase,
    })

   let temperamentDb = await Temperament.findAll({ 
    where: { name : temperament} 
    })

    dogCreate.addTemperament(temperamentDb);
    res.send("Your dog has been created");
//} catch(error){
    //next(error)

});

router.get("/dogs/:id", async (req, res) => {
    const {id} = req.params;
    const infoApi = await getAllDogs()
    if (id) {
        let dogById = await infoApi.filter ( dog => dog.id == id);
        dogById.length?
        res.status(200).json(dogById) :
        res.status(404).send("Dog not found")
    }
})


module.exports = router;
