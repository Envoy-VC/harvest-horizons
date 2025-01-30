import Phaser from 'phaser';

export abstract class GameSceneAbstract extends Phaser.Scene {
  abstract isModalOpen: boolean;
}
