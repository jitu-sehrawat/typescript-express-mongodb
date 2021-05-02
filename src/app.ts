import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,{
      keepAlive: true,
      bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
      useNewUrlParser: true,
      autoIndex: false,
      useUnifiedTopology: true
    });

    mongoose.connection.on('error', function (e) {
      console.log('db: mongodb error ' + e);
      // reconnect here
    });
    
    mongoose.connection.on('connected', function (e) {
      console.log('db: mongodb is connected: ' + MONGO_PATH);
    });
    
    mongoose.connection.on('disconnected', function () {
      console.log('db: mongodb is disconnected');
    });
    
    mongoose.connection.on('reconnected', function () {
      console.log('db: mongodb is reconnected: ' + MONGO_PATH);
    });
    
    mongoose.connection.on('timeout', function (e) {
      console.log('db: mongodb timeout ' + e);
      // reconnect here
    });
    
    mongoose.connection.on('close', function () {
      console.log('db: mongodb connection closed');
    });
  }
}

export default App;
