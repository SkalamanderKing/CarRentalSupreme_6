const router = require("express").Router();
var moment = require('moment');
//app.locals.moment = require('moment');

module.exports = (Car, User) => {

  router.get("/", (req, res) => {
    res.render("main", { title: "Main!" });
     //Car.find({}, (error, results) =>{ 
     //  User.find({}, (error, results) =>{ 
    //res.json(results);
    //});
  });

  router.get("/cars", (req, res) => {
    Car.find({}, (err, cars) => {
      console.log("Get cars!");
      res.render("cars", { allCars: cars, title: "CARS" });
    });
  });

  router.get("/userInformation", (req, res) => {
    User.find({}, (err, users) => {
      if (err) console.log(err);
      console.log(users);
      res.render("userInformation", { title: "User info!!!!" });
    });
  });

/* Check if a car i booked and if so print this and date and person*/
 router.get("/booked", (req, res) => {
    Car.find({}, (err, cars) => {
      User.find({}, (err, users) => {
        var bookedCarByPerson = [];
        var tmp;
        for (var i in cars)
        {
          //Get id from car of booked car
          var tmpCar= cars[i].bookedBy;
          for(var j in users){
            //get id of user
            tmp=users[j]._id;
            //Check if user and id has equality and exclude undefined
            if(tmp==tmpCar && tmp!=undefined)
            {
              bookedCarByPerson.push("Car: "+ cars[i].brand+". Booked from: "+ 
                moment(cars[i].bookedFr).format('YYYY-MM-DD') +" to "+ 
                moment(cars[i].bookedFr).format('YYYY-MM-DD') +" by "+
                users[j].firstName+" "+users[j].lastName);
            }
            else if(tmp!=tmpCar && tmp==undefined) bookedCarByPerson.push("No cars is booked");
          }
        }
      res.render("booked", {  title: "BOOKED", bookedCarByPerson});
       });
    });
  });

  router.post("/userInformation", (req, res) => {
    let newUser = new User(req.body);

    newUser.save((err) => {
      if (!err) {
        console.log("Success!");
        console.log(newUser);
        res.render("userInformation", { userInfo: newUser, title: "User info!" });
      } else {
        console.log("Uh-oh!");
        console.log(err);
        res.render("userInformation", { errorInfo: err, title: "Something went wrong." });
      }
    });
  });

router.post('/newCar', (req, res) => {
var car = new Car(req.body);
car.save((error, results)=>{
  if(error) res.send(error.errors.title.message);
  res.send(results);
});
});
 

  router.patch('/:id', (req, res) => {
  Car.findByIdAndUpdate(req.params.id,
  //User.findByIdAndUpdate(req.params.id,  
  {
   /*
    brand: req.body.brand
    model: req.body.model
    seats: req.body.seats
    gearbox: req.body.gearbox
    railing: req.body.railing
    price: req.body.price*/
    booked: req.body.booked,
    bookedFr: req.body.bookedFr,
    bookedTo: req.body.bookedTo,
    bookedBy: req.body.bookedBy
  } ,{new: true} 
  ,(error, result) =>{
    if(error)res.send(error);
    res.send(result);
  });
});
  //delete
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (error, result) =>{
    if(error)res.send(error);
    res.send(result + "Successfully removed!");
  });
});
  return router;
}
