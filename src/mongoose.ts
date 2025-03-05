import mongoose from 'mongoose';
import { UserModel, IUser } from './user.js';
import { CarModel, ICar } from './car.js';
import { IConcessionaire, ConcessionaireModel } from './concessionaire.js';

async function createCar(carData: ICar): Promise<ICar> {
  const newCar = new CarModel(carData);
  return await newCar.save();
}

async function getCarById(carId: string): Promise<ICar | null> {
  return await CarModel.findById(carId);
}

async function listCars(): Promise<ICar[]> {
  return await CarModel.find();
}

async function updateCar(carId: string, carData: Partial<ICar>): Promise<ICar | null> {
  return await CarModel.findByIdAndUpdate(carId, carData, { new: true });
}

async function deleteCar(carId: string): Promise<ICar | null> {
  return await CarModel.findByIdAndDelete(carId);
}

async function aggregateCars() {
  return await CarModel.aggregate([
    {
      $group: {
        _id: '$brand',
        total: { $sum: 1 }
      }
    }
  ]);
}

async function main() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));

  const user1:  IUser = {
    "name": 'Bill',
    "email": 'bill@initech.com',
    "avatar": 'https://i.imgur.com/dM7Thhn.png'
  };

  console.log("user1", user1); 
  const newUser= new UserModel(user1);
  const user2: IUser = await newUser.save();
  console.log("user2",user2);

  // findById devuelve un objeto usando el _id.
  const user3: IUser | null = await UserModel.findById(user2._id);
  console.log("user3",user3);

  // findOne devuelve un objeto usando un filtro.
  const user4: IUser | null = await UserModel.findOne({name: 'Bill'});
  console.log("user4",user4);

  // Partial<IUser> Indica que el objeto puede tener solo algunos campos de IUser.
  // select('name email') solo devuelve name y email.
  // lean() devuelve un objeto plano de JS en lugar de un documento de Mongoose.
  const user5: Partial<IUser> | null  = await UserModel.findOne({ name: 'Bill' })
    .select('name email').lean();
  console.log("user5",user5);

  /**
   * EJERCICIO SEMINARIO ----------------------------------------------
   */
  const car1:  ICar = {
    "brand": 'Ford',
    "model": 'Focus',
    "description": 'Coche de empresa'
  };

  const car2:  ICar = {
    "brand": 'Audi',
    "model": 'Rs3',
    "description": 'Coche personal'
  };
  
  const newCar = await createCar(car1);
  console.log("Car created:",newCar);

  const newCar2 = await createCar(car2);
  console.log("Car created:",newCar2);

  // leer un coche por ID
  if (newCar._id) {
    const car = await getCarById(newCar._id);
    console.log('Car fetched:', car);
  } else {
    console.error('Car not created, missing ID');
  }

  // listar coches
  const cars = await listCars();
  console.log('Cars listed:', cars);

  // actualizar un coche
  if (newCar._id) {
    const updatedCar = await updateCar(newCar._id, { brand: 'Toyota' });
    console.log('Car updated:', updatedCar);
  } else {
    console.error('Car not created, missing ID');
  }

  // borrar un coche
  if (newCar._id) {
    const deletedCar = await deleteCar(newCar._id);
    console.log('Car deleted:', deletedCar);
  } else {
    console.error('Car not created, missing ID');
  }

  // Uso del aggregation pipeline
  const aggregatedCars = await aggregateCars();
  console.log('Cars aggregated:', aggregatedCars);

  //Enlazar concesionario con coches
  const concessionaire1: IConcessionaire = {
    "name": 'Concesionario 1',
    "email": 'concesionario@falso.com',
    "direction": 'Calle Falsa 123',
  };


  const newConcessionaire = new ConcessionaireModel(concessionaire1);
  await newConcessionaire.save();
  console.log("Concessionaire created:",newConcessionaire);

  // Añadir un coche al concesionario
  if (newCar._id) {
    await ConcessionaireModel.findByIdAndUpdate(newConcessionaire._id, {
      $push: { cars: newCar._id }
    });
    console.log('Car added to concessionaire');
  } else {
    console.error('Car not created, missing ID');
  }
  const concessionaireWithCars = await ConcessionaireModel.findById(newConcessionaire._id).populate('cars');
  console.log('Concessionaire with cars:', concessionaireWithCars);


}

main()

    
