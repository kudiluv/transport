import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node-gpu';
import * as fs from 'fs/promises';

@Injectable()
export class TensorService {
  constructor() {
    // console.log('learn');

    // this.predict();
  }
  async predict() {
    const model = await tf.loadLayersModel('file://./my-model/model.json');
    const dataFalse = JSON.parse(
      await fs.readFile('./learn-data-false.json', {
        encoding: 'utf-8',
      }),
    );
    const dataTrue = JSON.parse(
      await fs.readFile('./learn-data-true.json', {
        encoding: 'utf-8',
      }),
    );
    for (let index = 0; index < 100; index++) {
      const res = tf.rand([4], () => +(Math.random() * 300).toFixed(0));
      const prediction = model.predict(tf.tensor([res.arraySync()]));

      console.log(
        // @ts-ignore
        JSON.stringify(prediction.arraySync().map(([value]) => value > 0.5)),
      );
    }
  }

  async learn() {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }),
    );
    model.add(
      tf.layers.dense({ units: 32, activation: 'relu', dtype: 'int32' }),
    );
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    // Компиляция модели
    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
    });

    const dataFalse = JSON.parse(
      await fs.readFile('./learn-data-false.json', {
        encoding: 'utf-8',
      }),
    );
    const dataTrue = JSON.parse(
      await fs.readFile('./learn-data-true.json', {
        encoding: 'utf-8',
      }),
    );

    const dataFalseLEarn = dataFalse.slice(0, -3);
    const dataTrueLearn = dataTrue.slice(0, -3);
    // Входные данные
    const X_train = tf.tensor2d(
      [...dataFalseLEarn, ...dataTrueLearn],
      null,
      'int32',
    );
    console.log(X_train.shape);
    const y_train = tf.tensor1d([
      ...new Array(dataFalseLEarn.length).fill(0),
      ...new Array(dataTrueLearn.length).fill(1),
    ]);

    await model.fit(X_train, y_train, { epochs: 2000, batchSize: 4000 });

    await model.save('file://./my-model');
  }
}
