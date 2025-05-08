// index.js
const express = require('express');
const PORT = 3000;
const pets = require('./data/pets.json')
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const pool = require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Homepage route
app.get('/', (req, res) => {
    res.send('Welcome to the Pet API!');
  });
  
  // /pets route
  app.get('/pets', (req, res) => {
    res.json(pets);    
  });

  // /pets route random
  app.get('/random', (req, res) => {
    res.json(pets[Math.floor(Math.random()*pets.length)]);    
  });

app.get('/pets/:id', (req, res) => {
    console.log(req.params.id)
   res.json(pets.find(obj => obj.id == req.params.id));
 
});
  // /pets route
app.post('/pets', (req, res) => {
    const {pet_name, speciese,age} = req.body;
    const pets_id = pets.map(val =>val.id)
    console.log(req.body); // logs JSON body to consolevv
  const newPet = {

    id : (pets_id.length > 0 ? Math.max(...pets_id):0) + 1,
    pet_name,
    speciese,
    age
  }

  const new_pets = pets.concat(newPet);
  fs.writeFile('./data/pets.json', JSON.stringify(new_pets),err=> console.log(err));
  res.json(newPet);



    // res.send('Pet received!');
});

app.put('/pets/:id',(req,res)=>{

    const {id} = req.params;
    const {pet_name, speciese, age} = req.body;

    const old_pet = pets.find(val => val.id == id)

    if(pet_name) old_pet.pet_name=pet_name;
    if(speciese) old_pet.speciese=speciese;
    if(age) old_pet.age=age;

  fs.writeFile('./data/pets.json', JSON.stringify(pets),err=> console.log(err));
  res.json(pets);

})

app.delete('',(req,res)=>{
  const {id} = req.params;
  // const TBdel_pet = pets.filter(obj => obj.id == id)
  const new_pets = pets.filter(obj => obj.id != id)
  // console.log(TBdel_pet)
  fs.writeFile('./data/pets.json', JSON.stringify(new_pets),err=> console.log(err));
  res.json(new_pets)

})

app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT * from movies');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


