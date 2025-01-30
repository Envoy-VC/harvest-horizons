import Phaser from 'phaser';
import GameMap from 'public/assets/map.json';

import { createAnimations } from '../helpers/movement';

const spriteSheets = ['farmer', 'trader'];

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    for (const tileset of GameMap.tilesets) {
      this.load.image(tileset.name, `assets/${tileset.image}`);
    }
    this.load.image('background', 'assets/background.jpg');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('button', 'assets/ui/button.png');
    this.load.tilemapTiledJSON('world', 'assets/map.json');

    for (const character of spriteSheets) {
      this.load.spritesheet(character, `assets/sprites/${character}.png`, {
        frameWidth: 64,
        frameHeight: 64,
      });
    }
  }

  create() {
    for (const character of spriteSheets) {
      createAnimations(this, character);
    }
    this.scene.start('MainMenu');
  }
}
